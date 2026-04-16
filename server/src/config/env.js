const dotenv = require('dotenv');
dotenv.config();

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue;
  return value === 'true';
};

const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/purplemerit',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
  SEED_DEMO_DATA: parseBoolean(process.env.SEED_DEMO_DATA, false),
  SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL || 'admin@purplemerit.com',
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD,
  SEED_SAMPLE_PASSWORD: process.env.SEED_SAMPLE_PASSWORD || process.env.SEED_ADMIN_PASSWORD,
};

const requiredEnvVars = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
const missingRequiredEnvVars = requiredEnvVars.filter((key) => !env[key]);

if (missingRequiredEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingRequiredEnvVars.join(', ')}`
  );
}

if (env.SEED_DEMO_DATA && !env.SEED_ADMIN_PASSWORD) {
  throw new Error('SEED_ADMIN_PASSWORD is required when SEED_DEMO_DATA=true');
}

module.exports = env;
