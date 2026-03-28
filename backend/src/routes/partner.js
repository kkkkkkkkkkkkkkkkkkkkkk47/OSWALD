const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/partnerController');

router.use(protect, authorize('partner'));

router.get('/dashboard', ctrl.getDashboardStats);
router.get('/profile', ctrl.getProfile);
router.put('/profile', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), ctrl.updateProfile);
router.get('/analytics', ctrl.getSalesAnalytics);

module.exports = router;
