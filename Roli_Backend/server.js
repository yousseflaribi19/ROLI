const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
