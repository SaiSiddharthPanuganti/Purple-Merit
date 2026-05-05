const User = require('../models/User');
const env = require('../config/env');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ where: { email: env.SEED_ADMIN_EMAIL } });
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
      { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@purplemerit.com', password: samplePassword, role: 'manager', status: 'active', createdBy: admin.id, updatedBy: admin.id },
      { firstName: 'Michael', lastName: 'Chen', email: 'michael.chen@purplemerit.com', password: samplePassword, role: 'manager', status: 'active', createdBy: admin.id, updatedBy: admin.id },
      { firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.rodriguez@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin.id, updatedBy: admin.id },
      { firstName: 'James', lastName: 'Wilson', email: 'james.wilson@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin.id, updatedBy: admin.id },
      { firstName: 'Aisha', lastName: 'Patel', email: 'aisha.patel@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin.id, updatedBy: admin.id },
      { firstName: 'David', lastName: 'Kim', email: 'david.kim@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin.id, updatedBy: admin.id },
      { firstName: 'Lisa', lastName: 'Thompson', email: 'lisa.thompson@purplemerit.com', password: samplePassword, role: 'user', status: 'inactive', createdBy: admin.id, updatedBy: admin.id },
      { firstName: 'Robert', lastName: 'Garcia', email: 'robert.garcia@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin.id, updatedBy: admin.id },
      { firstName: 'Amanda', lastName: 'Lee', email: 'amanda.lee@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin.id, updatedBy: admin.id },
      { firstName: 'Daniel', lastName: 'Martinez', email: 'daniel.martinez@purplemerit.com', password: samplePassword, role: 'manager', status: 'active', createdBy: admin.id, updatedBy: admin.id },
      { firstName: 'Jessica', lastName: 'Brown', email: 'jessica.brown@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin.id, updatedBy: admin.id },
      { firstName: 'Kevin', lastName: 'Taylor', email: 'kevin.taylor@purplemerit.com', password: samplePassword, role: 'user', status: 'inactive', createdBy: admin.id, updatedBy: admin.id },
      { firstName: 'Rachel', lastName: 'Anderson', email: 'rachel.anderson@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin.id, updatedBy: admin.id },
      { firstName: 'Christopher', lastName: 'Thomas', email: 'chris.thomas@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin.id, updatedBy: admin.id },
      { firstName: 'Jennifer', lastName: 'White', email: 'jennifer.white@purplemerit.com', password: samplePassword, role: 'user', status: 'active', createdBy: admin.id, updatedBy: admin.id },
    ];

    await User.bulkCreate(sampleUsers);

    console.log(`✅ ${sampleUsers.length} sample users seeded`);
  } catch (error) {
    // Duplicate records can happen if seed has already been applied.
    if (error.name !== 'SequelizeUniqueConstraintError' && error.code !== 11000) {
      console.error('⚠️  Seed error:', error.message);
    }
  }
};

module.exports = seedAdmin;
