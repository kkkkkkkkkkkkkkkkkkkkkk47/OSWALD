const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, default: 'mock_gateway' },
  transactionId: { type: String, default: '' },
  accessGranted: { type: Boolean, default: false },
  notes: { type: String, default: '' },
}, { timestamps: true });

purchaseSchema.index({ user: 1, portfolio: 1 });
purchaseSchema.index({ partner: 1 });

module.exports = mongoose.model('Purchase', purchaseSchema);
