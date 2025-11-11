const Quest = require('../models/Quest');
const QuestProgress = require('../models/QuestProgress');
const User = require('../models/User');

// Lister quêtes actives
exports.listQuests = async (req, res) => {
  const quests = await Quest.find({ active: true });
  res.json(quests);
};

// Obtenir progression utilisateur
exports.getUserProgress = async (req, res) => {
  const userId = req.user.id;
  const progresses = await QuestProgress.find({ userId }).populate('questId');
  res.json(progresses);
};

// Réclamer récompense quête
exports.claimReward = async (req, res) => {
  try {
    const { questId } = req.params;
    const userId = req.user.id;

    const progress = await QuestProgress.findOne({ userId, questId });
    if (!progress || progress.rewardsClaimed || !progress.completedAt) {
      return res.status(400).json({ message: 'Récompense non disponible' });
    }

    const quest = await Quest.findById(questId);
    const user = await User.findById(userId);

    // Ajouter récompenses utilisateurs
    user.pips += quest.rewards.pips;
    user.rolls.current = Math.min(user.rolls.current + quest.rewards.rolls, user.rolls.max);
    // TODO: Ajouter cartes et boosts selon besoins

    progress.rewardsClaimed = true;
    await progress.save();
    await user.save();

    res.json({ message: 'Récompenses attribuées avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
