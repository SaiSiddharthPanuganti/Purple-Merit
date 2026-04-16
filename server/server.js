const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');
const seedAdmin = require('./src/utils/seed');

const startServer = async () => {
  try {
    await connectDB();
    if (env.SEED_DEMO_DATA) {
      await seedAdmin();
    }

    app.listen(env.PORT, () => {
      console.log(`🚀 PurpleMerit API running on port ${env.PORT} [${env.NODE_ENV}]`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
