const Card = require('../models/Card');

// lister cartes
exports.listCards = async (req, res) => {
  try {
    const cards = await Card.find().populate('rarityId').populate('categoryId').exec();
    res.render('admin/cards/list', { cards, user: req.user });
  } catch (error) {
    res.status(500).send('Erreur serveur : ' + error.message);
  }
};

// formulaire création carte
exports.showCreateForm = (req, res) => {
  res.render('admin/cards/form', { card: {}, user: req.user });
};

// création carte avec upload image sur Cloudinary
exports.createCard = async (req, res) => {
  try {
    // multer ajoute file à req
    if (!req.file) throw new Error('Image requise');

    const { title, rarityId, categoryId, metadata, isEventExclusive } = req.body;

    await Card.create({
      title,
      imageUrl: req.file.path,     // url Cloudinary automatiquement ici
      rarityId,
      categoryId,
      metadata: metadata ? JSON.parse(metadata) : {},
      isEventExclusive: isEventExclusive === 'on',
    });
    res.redirect('/admin/cards');
  } catch (error) {
    res.status(400).send('Erreur création carte : ' + error.message);
  }
};

// formulaire édition avec sélection image manuelle possible
exports.showEditForm = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).send('Carte introuvable');
    res.render('admin/cards/edit', { card, user: req.user });
  } catch (error) {
    res.status(500).send('Erreur serveur : ' + error.message);
  }
};

// mise à jour carte, upload image optionnelle
exports.updateCard = async (req, res) => {
  try {
    const { title, rarityId, categoryId, metadata, isEventExclusive } = req.body;

    const updateData = {
      title,
      rarityId,
      categoryId,
      metadata: metadata ? JSON.parse(metadata) : {},
      isEventExclusive: isEventExclusive === 'on',
    };

    // si nouvelle image uploadée, maj imageUrl
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    await Card.findByIdAndUpdate(req.params.id, updateData);
    res.redirect('/admin/cards');
  } catch (error) {
    res.status(400).send('Erreur mise à jour carte : ' + error.message);
  }
};

// suppression carte
exports.deleteCard = async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.redirect('/admin/cards');
  } catch (error) {
    res.status(400).send('Erreur suppression carte : ' + error.message);
  }
};
