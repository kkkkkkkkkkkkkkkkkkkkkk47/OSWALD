const mongoose = require('mongoose');
const slugify = require('slugify');

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  thumbnail: { type: String, default: '' },
  banner: { type: String, default: '' },
  shortDescription: { type: String, required: true, maxlength: 300 },
  fullDescription: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  strategyType: { type: String, required: true, enum: ['momentum', 'value', 'growth', 'income', 'balanced', 'aggressive', 'conservative', 'quantitative', 'swing', 'day-trading'] },
  marketType: { type: String, required: true, enum: ['stocks', 'crypto', 'forex', 'commodities', 'bonds', 'mixed'] },
  riskLevel: { type: String, required: true, enum: ['low', 'medium', 'high', 'very-high'] },
  estimatedReturn: { type: String, default: '' },
  historicalPerformance: [{
    period: String,
    returnPercent: Number,
  }],
  minimumBuyAmount: { type: Number, default: 0 },
  duration: { type: String, default: '' },
  tags: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  featured: { type: Boolean, default: false },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalPurchases: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  images: [{ type: String }],
}, { timestamps: true });

portfolioSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

portfolioSchema.index({ title: 'text', shortDescription: 'text', tags: 'text' });
portfolioSchema.index({ status: 1, partner: 1 });
portfolioSchema.index({ category: 1, riskLevel: 1, price: 1 });

module.exports = mongoose.model('Portfolio', portfolioSchema);
