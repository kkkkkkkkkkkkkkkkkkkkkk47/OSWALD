const mongoose = require('mongoose');

const partnerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  website: { type: String, default: '' },
  logo: { type: String, default: '' },
  banner: { type: String, default: '' },
  specializations: [{ type: String }],
  verified: { type: Boolean, default: false },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' },
  totalSales: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  socialLinks: {
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    telegram: { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('PartnerProfile', partnerProfileSchema);
