const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  pips: { type: Number, default: 0 },
  rolls: {
    current: { type: Number, default: 10 },
    max: { type: Number, default: 10 },
    lastRegenerationAt: { type: Date, default: Date.now }
  },
  collection: [
    {
      cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
      obtainedAt: Date,
      count: Number,
    }
  ],
  wishlist: [
    {
      cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
      addedAt: Date,
    }
  ],
  stats: {
    totalRolls: { type: Number, default: 0 },
    totalSpentPips: { type: Number, default: 0 },
    eventsParticipated: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
