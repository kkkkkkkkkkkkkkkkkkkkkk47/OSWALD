const Favorite = require('../models/Favorite');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/AppError');

exports.toggleFavorite = async (req, res, next) => {
  try {
    const { portfolioId } = req.body;
    const existing = await Favorite.findOne({ user: req.user._id, portfolio: portfolioId });
    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return ApiResponse.success(res, { favorited: false }, 'Removed from favorites');
    }
    await Favorite.create({ user: req.user._id, portfolio: portfolioId });
    ApiResponse.success(res, { favorited: true }, 'Added to favorites');
  } catch (error) { next(error); }
};

exports.getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({ path: 'portfolio', populate: { path: 'partner', select: 'name' } })
      .sort({ createdAt: -1 });
    const portfolios = favorites.map(f => f.portfolio).filter(Boolean);
    ApiResponse.success(res, { portfolios });
  } catch (error) { next(error); }
};

exports.checkFavorite = async (req, res, next) => {
  try {
    const fav = await Favorite.findOne({ user: req.user._id, portfolio: req.params.portfolioId });
    ApiResponse.success(res, { favorited: !!fav });
  } catch (error) { next(error); }
};
