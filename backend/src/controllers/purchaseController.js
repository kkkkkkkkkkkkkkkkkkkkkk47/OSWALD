const Purchase = require('../models/Purchase');
const Portfolio = require('../models/Portfolio');
const PartnerProfile = require('../models/PartnerProfile');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const logAudit = require('../utils/auditLogger');

// User: buy portfolio
exports.createPurchase = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.body.portfolioId);
    if (!portfolio || portfolio.status !== 'published') throw new AppError('Portfolio not available', 404);

    const existing = await Purchase.findOne({ user: req.user._id, portfolio: portfolio._id, paymentStatus: 'paid' });
    if (existing) throw new AppError('Already purchased this portfolio', 400);

    // Mock payment processing
    const transactionId = 'TXN_' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();

    const purchase = await Purchase.create({
      user: req.user._id,
      portfolio: portfolio._id,
      partner: portfolio.partner,
      amount: portfolio.price,
      paymentStatus: 'paid',
      paymentMethod: 'mock_gateway',
      transactionId,
      accessGranted: true,
    });

    // Update portfolio stats
    portfolio.totalPurchases += 1;
    portfolio.totalRevenue += portfolio.price;
    await portfolio.save();

    // Update partner stats
    await PartnerProfile.findOneAndUpdate(
      { user: portfolio.partner },
      { $inc: { totalSales: 1, totalRevenue: portfolio.price } }
    );

    await logAudit(req, 'PURCHASE', 'Purchase', purchase._id, `Bought: ${portfolio.title}`);
    ApiResponse.created(res, { purchase }, 'Purchase successful');
  } catch (error) { next(error); }
};

// User: get my purchases
exports.getMyPurchases = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const query = { user: req.user._id };

    const [purchases, total] = await Promise.all([
      Purchase.find(query).populate('portfolio', 'title slug thumbnail price riskLevel').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Purchase.countDocuments(query),
    ]);
    ApiResponse.paginated(res, purchases, page, limit, total);
  } catch (error) { next(error); }
};

// Partner: get sales
exports.getPartnerSales = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const query = { partner: req.user._id };

    const [purchases, total] = await Promise.all([
      Purchase.find(query).populate('user', 'name email').populate('portfolio', 'title price').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Purchase.countDocuments(query),
    ]);
    ApiResponse.paginated(res, purchases, page, limit, total);
  } catch (error) { next(error); }
};

// Admin: get all purchases
exports.getAllPurchases = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, paymentStatus } = req.query;
    const query = {};
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const skip = (Number(page) - 1) * Number(limit);
    const [purchases, total] = await Promise.all([
      Purchase.find(query).populate('user', 'name email').populate('portfolio', 'title price').populate('partner', 'name').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Purchase.countDocuments(query),
    ]);
    ApiResponse.paginated(res, purchases, page, limit, total);
  } catch (error) { next(error); }
};

// Check if user purchased a portfolio
exports.checkPurchase = async (req, res, next) => {
  try {
    const purchase = await Purchase.findOne({ user: req.user._id, portfolio: req.params.portfolioId, paymentStatus: 'paid' });
    ApiResponse.success(res, { purchased: !!purchase, purchase });
  } catch (error) { next(error); }
};
