const User = require('../models/User');
const env = require('../config/env');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: env.SEED_ADMIN_EMAIL });
    if (adminExists) {
      return;
    }

    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: env.SEED_ADMIN_EMAIL,
      password: env.SEED_ADMIN_PASSWORD,
      role: 'admin',
      status: 'active',
    });

    console.log(`✅ Demo admin account created (${env.SEED_ADMIN_EMAIL})`);

    const samplePassword = env.SEED_SAMPLE_PASSWORD;

    // Seed sample users for demo
    const sampleUsers = [
      { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@purplemerit.com', password: samplePassword, role: 'manager', status: 'active', createdBy: admin._id, updatedBy: admin._id },
      { firstName: 'Michael', lastName: 'Chen', email: 'michael.chen@purplemerit.com', password: samplePassword, role: 'manager', status: 'active', createdBy: admin._id, updatedBy: admin._id },
      { firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.rodriguez@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin._id, updatedBy: admin._id },
      { firstName: 'James', lastName: 'Wilson', email: 'james.wilson@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin._id, updatedBy: admin._id },
      { firstName: 'Aisha', lastName: 'Patel', email: 'aisha.patel@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin._id, updatedBy: admin._id },
      { firstName: 'David', lastName: 'Kim', email: 'david.kim@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin._id, updatedBy: admin._id },
      { firstName: 'Lisa', lastName: 'Thompson', email: 'lisa.thompson@purplemerit.com', password: samplePassword, role: 'user', status: 'inactive', createdBy: admin._id, updatedBy: admin._id },
      { firstName: 'Robert', lastName: 'Garcia', email: 'robert.garcia@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin._id, updatedBy: admin._id },
      { firstName: 'Amanda', lastName: 'Lee', email: 'amanda.lee@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin._id, updatedBy: admin._id },
      { firstName: 'Daniel', lastName: 'Martinez', email: 'daniel.martinez@purplemerit.com', password: samplePassword, role: 'manager', status: 'active', createdBy: admin._id, updatedBy: admin._id },
      { firstName: 'Jessica', lastName: 'Brown', email: 'jessica.brown@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin._id, updatedBy: admin._id },
      { firstName: 'Kevin', lastName: 'Taylor', email: 'kevin.taylor@purplemerit.com', password: samplePassword, role: 'user', status: 'inactive', createdBy: admin._id, updatedBy: admin._id },
      { firstName: 'Rachel', lastName: 'Anderson', email: 'rachel.anderson@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin._id, updatedBy: admin._id },
      { firstName: 'Christopher', lastName: 'Thomas', email: 'chris.thomas@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin._id, updatedBy: admin._id },
      { firstName: 'Jennifer', lastName: 'White', email: 'jennifer.white@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin._id, updatedBy: admin._id },
    ];

    for (const userData of sampleUsers) {
      await User.create(userData);
    }

    console.log(`✅ ${sampleUsers.length} sample users seeded`);
  } catch (error) {
    // If it's a duplicate key error, users already exist — that's fine
    if (error.code !== 11000) {
      console.error('⚠️  Seed error:', error.message);
    }
  }
};

module.exports = seedAdmin;
