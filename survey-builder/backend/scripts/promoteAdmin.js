// This script promotes a user to Admin role based on their email address.

require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../src/models/User");

console.log("Admin promotion script started");
async function promoteAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const email = process.argv[2]?.toLowerCase();

    if (!email) {
      throw new Error("Provide an email address.");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found.");
    }

    console.log(`Promoting ${user.email} to Admin...`);
    user.role = "Admin";
    await user.save();

    console.log(`${user.email} is now an Admin.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

promoteAdmin();