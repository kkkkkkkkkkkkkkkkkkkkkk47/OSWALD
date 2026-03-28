const Portfolio = require('../models/Portfolio');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const logAudit = require('../utils/auditLogger');

// Public: get published portfolios with search/filter/sort/pagination
exports.getPortfolios = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search, category, riskLevel, minPrice, maxPrice, sort, strategyType, marketType } = req.query;
    const query = { status: 'published' };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (riskLevel) query.riskLevel = riskLevel;
    if (strategyType) query.strategyType = strategyType;
    if (marketType) query.marketType = marketType;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'popular') sortObj = { totalPurchases: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [portfolios, total] = await Promise.all([
      Portfolio.find(query).populate('partner', 'name').populate('category', 'name slug').sort(sortObj).skip(skip).limit(Number(limit)),
      Portfolio.countDocuments(query),
    ]);

    ApiResponse.paginated(res, portfolios, page, limit, total);
  } catch (error) { next(error); }
};

// Public: get single portfolio by slug
exports.getPortfolioBySlug = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug, status: 'published' })
      .populate('partner', 'name email')
      .populate('category', 'name slug');
    if (!portfolio) throw new AppError('Portfolio not found', 404);
    ApiResponse.success(res, { portfolio });
  } catch (error) { next(error); }
};

// Partner: create portfolio
exports.createPortfolio = async (req, res, next) => {
  try {
    req.body.partner = req.user._id;
    if (req.files?.thumbnail) req.body.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    if (req.files?.banner) req.body.banner = `/uploads/${req.files.banner[0].filename}`;

    const portfolio = await Portfolio.create(req.body);
    await logAudit(req, 'CREATE_PORTFOLIO', 'Portfolio', portfolio._id, portfolio.title);
    ApiResponse.created(res, { portfolio }, 'Portfolio created');
  } catch (error) { next(error); }
};

// Partner: update portfolio
exports.updatePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, partner: req.user._id });
    if (!portfolio) throw new AppError('Portfolio not found', 404);

    if (req.files?.thumbnail) req.body.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    if (req.files?.banner) req.body.banner = `/uploads/${req.files.banner[0].filename}`;

    Object.assign(portfolio, req.body);
    await portfolio.save();
    await logAudit(req, 'UPDATE_PORTFOLIO', 'Portfolio', portfolio._id, portfolio.title);
    ApiResponse.success(res, { portfolio }, 'Portfolio updated');
  } catch (error) { next(error); }
};

// Partner: delete portfolio
exports.deletePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
    if (!portfolio) throw new AppError('Portfolio not found', 404);
    await logAudit(req, 'DELETE_PORTFOLIO', 'Portfolio', portfolio._id, portfolio.title);
    ApiResponse.success(res, null, 'Portfolio deleted');
  } catch (error) { next(error); }
};

// Partner: get own portfolios
exports.getMyPortfolios = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = { partner: req.user._id };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [portfolios, total] = await Promise.all([
      Portfolio.find(query).populate('category', 'name').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Portfolio.countDocuments(query),
    ]);
    ApiResponse.paginated(res, portfolios, page, limit, total);
  } catch (error) { next(error); }
};

// Partner: toggle publish
exports.togglePublish = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, partner: req.user._id });
    if (!portfolio) throw new AppError('Portfolio not found', 404);
    portfolio.status = portfolio.status === 'published' ? 'draft' : 'published';
    await portfolio.save();
    await logAudit(req, 'TOGGLE_PUBLISH', 'Portfolio', portfolio._id, `Status: ${portfolio.status}`);
    ApiResponse.success(res, { portfolio }, `Portfolio ${portfolio.status}`);
  } catch (error) { next(error); }
};

// Admin: get all portfolios
exports.getAllPortfolios = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, partner } = req.query;
    const query = {};
    if (status) query.status = status;
    if (partner) query.partner = partner;

    const skip = (Number(page) - 1) * Number(limit);
    const [portfolios, total] = await Promise.all([
      Portfolio.find(query).populate('partner', 'name email').populate('category', 'name').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Portfolio.countDocuments(query),
    ]);
    ApiResponse.paginated(res, portfolios, page, limit, total);
  } catch (error) { next(error); }
};

// Admin: toggle featured
exports.toggleFeatured = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) throw new AppError('Portfolio not found', 404);
    portfolio.featured = !portfolio.featured;
    await portfolio.save();
    await logAudit(req, 'TOGGLE_FEATURED', 'Portfolio', portfolio._id);
    ApiResponse.success(res, { portfolio }, `Featured: ${portfolio.featured}`);
  } catch (error) { next(error); }
};

// Admin: update portfolio status
exports.adminUpdateStatus = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!portfolio) throw new AppError('Portfolio not found', 404);
    await logAudit(req, 'ADMIN_UPDATE_STATUS', 'Portfolio', portfolio._id, req.body.status);
    ApiResponse.success(res, { portfolio }, 'Status updated');
  } catch (error) { next(error); }
};

// Public: get featured portfolios
exports.getFeatured = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find({ status: 'published', featured: true })
      .populate('partner', 'name').populate('category', 'name').limit(8);
    ApiResponse.success(res, { portfolios });
  } catch (error) { next(error); }
};

// Get single by ID (for admin/partner)
exports.getPortfolioById = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id)
      .populate('partner', 'name email').populate('category', 'name slug');
    if (!portfolio) throw new AppError('Portfolio not found', 404);
    ApiResponse.success(res, { portfolio });
  } catch (error) { next(error); }
};
