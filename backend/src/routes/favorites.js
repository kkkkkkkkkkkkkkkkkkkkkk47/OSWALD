const router = require('express').Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/favoriteController');

router.post('/toggle', protect, ctrl.toggleFavorite);
router.get('/my', protect, ctrl.getMyFavorites);
router.get('/check/:portfolioId', protect, ctrl.checkFavorite);

module.exports = router;
