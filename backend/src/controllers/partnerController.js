const PartnerProfile = require('../models/PartnerProfile');
const Portfolio = require('../models/Portfolio');
const Purchase = require('../models/Purchase');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/AppError');

exports.getProfile = async (req, res, next) => {
  try {
    let profile = await PartnerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await PartnerProfile.create({ user: req.user._id, companyName: req.user.name });
    }
    ApiResponse.success(res, { profile });
  } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { companyName, description, website, specializations, socialLinks } = req.body;
    if (req.files?.logo) req.body.logo = `/uploads/${req.files.logo[0].filename}`;
    if (req.files?.banner) req.body.banner = `/uploads/${req.files.banner[0].filename}`;

    const profile = await PartnerProfile.findOneAndUpdate(
      { user: req.user._id },
      { companyName, description, website, specializations, socialLinks, ...req.body },
      { new: true, upsert: true }
    );
    ApiResponse.success(res, { profile }, 'Profile updated');
  } catch (error) { next(error); }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalPortfolios, publishedPortfolios, totalSales, revenueAgg, recentSales] = await Promise.all([
      Portfolio.countDocuments({ partner: req.user._id }),
      Portfolio.countDocuments({ partner: req.user._id, status: 'published' }),
      Purchase.countDocuments({ partner: req.user._id, paymentStatus: 'paid' }),
      Purchase.aggregate([{ $match: { partner: req.user._id, paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Purchase.find({ partner: req.user._id }).populate('user', 'name email').populate('portfolio', 'title price').sort({ createdAt: -1 }).limit(5),
    ]);

    ApiResponse.success(res, {
      stats: {
        totalPortfolios, publishedPortfolios, totalSales,
        totalRevenue: revenueAgg[0]?.total || 0,
      },
      recentSales,
    });
  } catch (error) { next(error); }
};

exports.getSalesAnalytics = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [salesOverTime, topPortfolios] = await Promise.all([
      Purchase.aggregate([
        { $match: { partner: req.user._id, paymentStatus: 'paid', createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, revenue: { $sum: '$amount' } } },
        { $sort: { _id: 1 } },
      ]),
      Portfolio.find({ partner: req.user._id }).sort({ totalPurchases: -1 }).limit(5).select('title totalPurchases totalRevenue'),
    ]);
    ApiResponse.success(res, { salesOverTime, topPortfolios });
  } catch (error) { next(error); }
};
