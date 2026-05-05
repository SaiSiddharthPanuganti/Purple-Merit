const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'mysql',
  logging: false,
  dialectOptions: env.DB_SSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : undefined,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    require('../models/associations');
    await sequelize.sync();
    console.log(`✅ MySQL connected: ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
  } catch (error) {
    console.error(`❌ MySQL connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.sequelize = sequelize;
