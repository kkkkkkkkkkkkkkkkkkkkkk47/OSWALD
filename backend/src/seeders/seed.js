require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const PartnerProfile = require('../models/PartnerProfile');
const Portfolio = require('../models/Portfolio');
const Category = require('../models/Category');
const Purchase = require('../models/Purchase');
const AuditLog = require('../models/AuditLog');
const Favorite = require('../models/Favorite');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/osvald-trading';

const categories = [
  { name: 'Equities', slug: 'equities', description: 'Stock market portfolios', order: 1 },
  { name: 'Cryptocurrency', slug: 'cryptocurrency', description: 'Digital asset portfolios', order: 2 },
  { name: 'Forex', slug: 'forex', description: 'Foreign exchange portfolios', order: 3 },
  { name: 'Commodities', slug: 'commodities', description: 'Commodity trading portfolios', order: 4 },
  { name: 'Fixed Income', slug: 'fixed-income', description: 'Bond and fixed income portfolios', order: 5 },
  { name: 'Multi-Asset', slug: 'multi-asset', description: 'Diversified multi-asset portfolios', order: 6 },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear all existing data
    await Promise.all([
      User.deleteMany({}),
      PartnerProfile.deleteMany({}),
      Portfolio.deleteMany({}),
      Category.deleteMany({}),
      Purchase.deleteMany({}),
      AuditLog.deleteMany({}),
      Favorite.deleteMany({}),
    ]);
    console.log('Cleared all existing data');

    // Create default categories
    await Category.insertMany(categories);
    console.log('Categories seeded');

    // Create super admin only
    const admin = await User.create({
      name: 'Osvald Admin',
      email: 'admin@osvald.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
    });
    console.log('Super Admin created');

    console.log('\n--- Super Admin Account ---');
    console.log('Email:    admin@osvald.com');
    console.log('Password: admin123');
    console.log('\nSeeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
