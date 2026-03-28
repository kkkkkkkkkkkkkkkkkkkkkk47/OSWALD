const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/adminController');

router.use(protect, authorize('admin'));

router.get('/dashboard', ctrl.getDashboardStats);
router.get('/analytics', ctrl.getAnalytics);

// Users
router.get('/users', ctrl.getUsers);
router.post('/users', [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], validate, ctrl.createUser);
router.patch('/users/:id/status', ctrl.updateUserStatus);
router.patch('/users/:id/reset-password', ctrl.resetUserPassword);

// Partners
router.get('/partners', ctrl.getPartners);
router.post('/partners', [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('companyName').trim().notEmpty(),
], validate, ctrl.createPartner);
router.patch('/partners/:id/approval', ctrl.updatePartnerApproval);

// Categories
router.get('/categories', ctrl.getCategories);
router.post('/categories', ctrl.createCategory);
router.put('/categories/:id', ctrl.updateCategory);
router.delete('/categories/:id', ctrl.deleteCategory);

// Audit logs
router.get('/audit-logs', ctrl.getAuditLogs);

module.exports = router;
