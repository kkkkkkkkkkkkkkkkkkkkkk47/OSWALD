const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/portfolioController');

// Public routes
router.get('/', ctrl.getPortfolios);
router.get('/featured', ctrl.getFeatured);
router.get('/slug/:slug', ctrl.getPortfolioBySlug);

// Partner routes
router.get('/my', protect, authorize('partner'), ctrl.getMyPortfolios);
router.post('/', protect, authorize('partner'), upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), ctrl.createPortfolio);
router.put('/:id', protect, authorize('partner'), upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), ctrl.updatePortfolio);
router.delete('/:id', protect, authorize('partner'), ctrl.deletePortfolio);
router.patch('/:id/toggle-publish', protect, authorize('partner'), ctrl.togglePublish);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), ctrl.getAllPortfolios);
router.get('/admin/:id', protect, authorize('admin'), ctrl.getPortfolioById);
router.patch('/admin/:id/featured', protect, authorize('admin'), ctrl.toggleFeatured);
router.patch('/admin/:id/status', protect, authorize('admin'), ctrl.adminUpdateStatus);

module.exports = router;
