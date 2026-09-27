// Run this once with: node seeder.js
// Creates an admin user so you can log into the admin panel

const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@kurtistore.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    await User.create({
      name: "Admin",
      email: "admin@kurtistore.com",
      password: "admin123", // change this after first login!
      role: "admin",
    });

    console.log("Admin user created: admin@kurtistore.com / admin123");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
