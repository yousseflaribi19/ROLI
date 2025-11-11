const User = require('../models/User');

// Calcul et liste top joueurs
exports.getLeaderboard = async (req, res) => {
  // Exemple 
  // Sum (count_card_i × rarity_weight_i) + UniqueBonus − DuplicatePenalty + floor(pips/100)
  // Pour simplifier nclasi bl pips houni

  const topUsers = await User.find()
    .sort({ pips: -1 })
    .limit(50)
    .select('username pips rolls')
    .lean();

  res.json(topUsers);
};
