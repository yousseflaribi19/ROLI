const authService = require('../services/authService');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.authenticate(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
 