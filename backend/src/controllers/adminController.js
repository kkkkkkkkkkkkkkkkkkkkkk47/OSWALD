const User = require('../models/User');
const PartnerProfile = require('../models/PartnerProfile');
const Portfolio = require('../models/Portfolio');
const Purchase = require('../models/Purchase');
const AuditLog = require('../models/AuditLog');
const Category = require('../models/Category');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const logAudit = require('../utils/auditLogger');

// Dashboard stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalPartners, totalPortfolios, totalPurchases, revenueAgg, recentUsers, recentPurchases] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'partner' }),
      Portfolio.countDocuments(),
      Purchase.countDocuments({ paymentStatus: 'paid' }),
      Purchase.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(5).select('name email createdAt status'),
      Purchase.find().populate('user', 'name').populate('portfolio', 'title price').sort({ createdAt: -1 }).limit(5),
    ]);

    ApiResponse.success(res, {
      stats: {
        totalUsers, totalPartners, totalPortfolios, totalPurchases,
        totalRevenue: revenueAgg[0]?.total || 0,
      },
      recentUsers,
      recentPurchases,
    });
  } catch (error) { next(error); }
};

// Manage users
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status, role } = req.query;
    const query = {};
    if (role) query.role = role; else query.role = { $in: ['user'] };
    if (status) query.status = status;
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);
    ApiResponse.paginated(res, users, page, limit, total);
  } catch (error) { next(error); }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    const exists = await User.findOne({ email });
    if (exists) throw new AppError('Email already exists', 400);

    const user = await User.create({ name, email, password, role });
    await logAudit(req, 'ADMIN_CREATE_USER', 'User', user._id, `Created ${role}: ${email}`);
    ApiResponse.created(res, { user }, 'User created');
  } catch (error) { next(error); }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!user) throw new AppError('User not found', 404);
    await logAudit(req, 'UPDATE_USER_STATUS', 'User', user._id, `Status: ${req.body.status}`);
    ApiResponse.success(res, { user }, 'User status updated');
  } catch (error) { next(error); }
};

exports.resetUserPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError('User not found', 404);
    user.password = req.body.password;
    await user.save();
    await logAudit(req, 'ADMIN_RESET_PASSWORD', 'User', user._id);
    ApiResponse.success(res, null, 'Password reset');
  } catch (error) { next(error); }
};

// Manage partners
exports.getPartners = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const query = { role: 'partner' };
    if (status) query.status = status;
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];

    const skip = (Number(page) - 1) * Number(limit);
    const [partners, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    // Attach partner profiles
    const partnerIds = partners.map(p => p._id);
    const profiles = await PartnerProfile.find({ user: { $in: partnerIds } });
    const profileMap = {};
    profiles.forEach(p => { profileMap[p.user.toString()] = p; });

    const data = partners.map(p => ({ ...p.toJSON(), profile: profileMap[p._id.toString()] || null }));
    ApiResponse.paginated(res, data, page, limit, total);
  } catch (error) { next(error); }
};

exports.createPartner = async (req, res, next) => {
  try {
    const { name, email, password, companyName, description } = req.body;
    const exists = await User.findOne({ email });
    if (exists) throw new AppError('Email already exists', 400);

    const user = await User.create({ name, email, password, role: 'partner' });
    await PartnerProfile.create({ user: user._id, companyName: companyName || name, description: description || '', approvalStatus: 'approved', verified: true });

    await logAudit(req, 'ADMIN_CREATE_PARTNER', 'User', user._id, `Created partner: ${email}`);
    ApiResponse.created(res, { user }, 'Partner created');
  } catch (error) { next(error); }
};

exports.updatePartnerApproval = async (req, res, next) => {
  try {
    const profile = await PartnerProfile.findOneAndUpdate(
      { user: req.params.id },
      { approvalStatus: req.body.approvalStatus },
      { new: true }
    );
    if (!profile) throw new AppError('Partner profile not found', 404);
    await logAudit(req, 'UPDATE_PARTNER_APPROVAL', 'PartnerProfile', profile._id, req.body.approvalStatus);
    ApiResponse.success(res, { profile }, 'Partner approval updated');
  } catch (error) { next(error); }
};

// Categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    ApiResponse.success(res, { categories });
  } catch (error) { next(error); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    await logAudit(req, 'CREATE_CATEGORY', 'Category', category._id, category.name);
    ApiResponse.created(res, { category });
  } catch (error) { next(error); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) throw new AppError('Category not found', 404);
    ApiResponse.success(res, { category });
  } catch (error) { next(error); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    ApiResponse.success(res, null, 'Category deleted');
  } catch (error) { next(error); }
};

// Audit logs
exports.getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total] = await Promise.all([
      AuditLog.find().populate('user', 'name email role').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      AuditLog.countDocuments(),
    ]);
    ApiResponse.paginated(res, logs, page, limit, total);
  } catch (error) { next(error); }
};

// Analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [purchasesOverTime, topPortfolios, partnerPerformance] = await Promise.all([
      Purchase.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, revenue: { $sum: '$amount' } } },
        { $sort: { _id: 1 } },
      ]),
      Portfolio.find({ status: 'published' }).sort({ totalPurchases: -1 }).limit(10).select('title totalPurchases totalRevenue price'),
      Purchase.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: '$partner', totalSales: { $sum: 1 }, totalRevenue: { $sum: '$amount' } } },
        { $sort: { totalRevenue: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'partner' } },
        { $unwind: '$partner' },
        { $project: { partnerName: '$partner.name', totalSales: 1, totalRevenue: 1 } },
      ]),
    ]);

    ApiResponse.success(res, { purchasesOverTime, topPortfolios, partnerPerformance });
  } catch (error) { next(error); }
};
