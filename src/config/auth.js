require('dotenv/config');

module.exports = {
  secret: process.env.AUTH_SECRET,
  expiresIn: '1d',
};