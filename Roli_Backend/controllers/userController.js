const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').exec();
    res.render('admin/users/list', { users, user: req.user });
  } catch (error) {
    res.status(500).send('Erreur serveur : ' + error.message);
  }
};

exports.showEditForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash').exec();
    if (!user) return res.status(404).send('Utilisateur introuvable');
    res.render('admin/users/edit', { user, currentUser: req.user });
  } catch (error) {
    res.status(500).send('Erreur serveur : ' + error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, email, role, avatarUrl } = req.body;
    await User.findByIdAndUpdate(req.params.id, {
      username,
      email,
      role,
      avatarUrl,
    });
    res.redirect('/admin/users');
  } catch (error) {
    res.status(400).send('Erreur mise à jour utilisateur : ' + error.message);
  }
};

exports.banUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { banned: true });
    res.redirect('/admin/users');
  } catch (error) {
    res.status(400).send('Erreur bannissement utilisateur : ' + error.message);
  }
};

exports.unbanUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { banned: false });
    res.redirect('/admin/users');
  } catch (error) {
    res.status(400).send('Erreur débannissement utilisateur : ' + error.message);
  }
};
