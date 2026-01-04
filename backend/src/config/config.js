require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  jwt_secret: process.env.JWT_SECRET,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    port: process.env.DB_PORT || 3306,
  },
};

module.exports = config;
