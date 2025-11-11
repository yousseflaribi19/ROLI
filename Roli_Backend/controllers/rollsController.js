const User = require('../models/User');

const REGEN_INTERVAL_MIN = 30;  

// Calcul nombre rolls actuel en tenant compte de la régénération
const calculateCurrentRolls = (user) => {
  const now = new Date();
  const last = user.rolls.lastRegenerationAt || now;
  const elapsedMin = (now - last) / 1000 / 60;
  const regenCount = Math.floor(elapsedMin / REGEN_INTERVAL_MIN);
  const newRolls = Math.min(user.rolls.current + regenCount, user.rolls.max);

  return { rolls: newRolls, regenCount };
};

exports.getRolls = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const { rolls, regenCount } = calculateCurrentRolls(user);

    if (regenCount > 0) {
      user.rolls.current = rolls;
      user.rolls.lastRegenerationAt = new Date();
      await user.save();
    }

    res.json({ currentRolls: rolls, maxRolls: user.rolls.max });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Utilisation d’un roll 
exports.useRoll = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const { rolls, regenCount } = calculateCurrentRolls(user);

    if (regenCount > 0) {
      user.rolls.current = rolls;
      user.rolls.lastRegenerationAt = new Date();
    }

    if (user.rolls.current < 1) {
      return res.status(400).json({ message: 'Pas assez de rolls disponibles' });
    }

    user.rolls.current -= 1;
    user.stats.totalRolls = (user.stats.totalRolls || 0) + 1;
    await user.save();

    // Logique tirage et retour carte à implémenter ici 
    res.json({ message: 'Roll utilisé avec succès', rollsRestants: user.rolls.current });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Conversion doublons en pips 
exports.convertDuplicateToPips = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const { duplicatesCount, rarity } = req.body;
    const conversionTable = { Common: 1, Uncommon: 3, Rare: 10, Epic: 40, Legendary: 200 };

    const pipsEarned = (conversionTable[rarity] || 0) * duplicatesCount;

    user.pips += pipsEarned;
    await user.save();

    res.json({ message: `Converti en ${pipsEarned} pips`, totalPips: user.pips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
