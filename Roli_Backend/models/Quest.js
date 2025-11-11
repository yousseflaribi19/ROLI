const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['daily', 'monthly', 'event'], required: true },
  description: String,
  rewards: {
    pips: { type: Number, default: 0 },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
    boosts: [String],   // ids
    rolls: { type: Number, default: 0 }
  },
  resetInterval: Number, // jours
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Quest', questSchema);
