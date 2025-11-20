import sequelize from './config/database.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
  try {
    await sequelize.sync({ alter: true });

    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Default admin user created');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seed();
