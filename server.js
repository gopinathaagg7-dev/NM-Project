import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import User from "./models/User.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Seed initial data if users collection is empty
const seedUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log("🌱 Seeding sample users...");
      await User.insertMany([
        { name: "John", sales: 100, views: 200 },
        { name: "Alice", sales: 150, views: 300 },
        { name: "Bob", sales: 120, views: 250 },
      ]);
      console.log("✅ Sample users inserted!");
    }
  } catch (err) {
    console.error("❌ Error seeding users:", err);
  }
};
seedUsers();

// ✅ Update user metrics every 5 seconds
setInterval(async () => {
  try {
    const users = await User.find();
    for (let user of users) {
      user.sales += Math.floor(Math.random() * 50); // Random increment
      user.views += Math.floor(Math.random() * 100);
      await user.save();
    }
    console.log("📊 User metrics updated");
  } catch (err) {
    console.error("❌ Error updating user metrics:", err.message);
  }
}, 5000);

// ✅ API Endpoint for metrics
app.get("/api/metrics", async (req, res) => {
  try {
    const users = await User.find();
    const totalSales = users.reduce((acc, user) => acc + user.sales, 0);
    const totalViews = users.reduce((acc, user) => acc + user.views, 0);

    res.json({
      users: users.length,
      sales: totalSales,
      views: totalViews,
    });
  } catch (err) {
    console.error("❌ Error fetching metrics:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
