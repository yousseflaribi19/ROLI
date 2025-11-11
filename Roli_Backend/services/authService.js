const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.authenticate = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Utilisateur non trouvé');

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new Error('Mot de passe incorrect');

  const payload = { id: user._id, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};
