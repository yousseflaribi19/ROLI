const stripe = require('../config/stripe');
const ShopItem = require('../models/ShopItem');
const User = require('../models/User');

exports.listShopItems = async (req, res) => {
  const items = await ShopItem.find({ isActive: true });
  res.json(items);
};

// Créer une session Stripe Checkout
exports.createCheckoutSession = async (req, res) => {
  try {
    const { itemId, userId } = req.body;

    const item = await ShopItem.findById(itemId);
    if (!item) return res.status(404).json({ error: 'Produit introuvable' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: item.currency,
          product_data: { name: item.name },
          unit_amount: item.priceCents,
        },
        quantity: 1,
      }],
      metadata: { userId, itemId },
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Webhook Stripe pour valider paiement et mise à jour derniers achats utilisateur
exports.stripeWebhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const itemId = session.metadata.itemId;

    // Exemples d'actions à faire : créditer pips, activer boost, etc.
    try {
      const user = await User.findById(userId);
      const item = await ShopItem.findById(itemId);

      if (item.type === 'roll') {
        user.rolls.current = Math.min(user.rolls.current + 1, user.rolls.max);
      }
      // Ajoutez logiques selon type d'item...

      await user.save();
    } catch (err) {
      console.error('Erreur mise à jour après paiement :', err.message);
    }
  }

  res.json({ received: true });
};
