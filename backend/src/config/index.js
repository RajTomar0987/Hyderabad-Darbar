require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'hyderabad_darbar_fallback_secret_key_2026',
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@hyderabaddarbar.com',
    password: process.env.ADMIN_PASSWORD || 'change_this_password'
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};

module.exports = config;
