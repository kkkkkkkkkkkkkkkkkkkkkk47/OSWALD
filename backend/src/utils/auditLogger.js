const AuditLog = require('../models/AuditLog');

const logAudit = async (req, action, resource, resourceId = null, details = '') => {
  try {
    await AuditLog.create({
      user: req.user?._id,
      action,
      resource,
      resourceId,
      details,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || '',
    });
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
};

module.exports = logAudit;
