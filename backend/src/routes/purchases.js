const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/purchaseController');

router.post('/', protect, authorize('user'), ctrl.createPurchase);
router.get('/my', protect, authorize('user'), ctrl.getMyPurchases);
router.get('/check/:portfolioId', protect, ctrl.checkPurchase);
router.get('/partner/sales', protect, authorize('partner'), ctrl.getPartnerSales);
router.get('/admin/all', protect, authorize('admin'), ctrl.getAllPurchases);

module.exports = router;
