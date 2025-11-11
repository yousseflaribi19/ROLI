const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  priceCents: { type: Number, required: true },  
  currency: { type: String, default: 'usd' },
  type: { type: String, enum: ['roll', 'boost', 'slot', 'pack'], required: true },
  durationDays: Number,  
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('ShopItem', shopItemSchema);
