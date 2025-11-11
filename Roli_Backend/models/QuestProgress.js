const mongoose = require('mongoose');

const questProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest', required: true },
  progress: { type: Number, default: 0 },
  target: { type: Number, required: true },
  completedAt: Date,
  rewardsClaimed: { type: Boolean, default: false },
  resetAt: Date
});

module.exports = mongoose.model('QuestProgress', questProgressSchema);
