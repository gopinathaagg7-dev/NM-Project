const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const users = await User.countDocuments();

    const salesData = await User.aggregate([
      { $group: { _id: null, totalSales: { $sum: '$sales' } } }
    ]);

    const viewsData = await User.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    res.json({
      users,
      sales: salesData[0]?.totalSales || 0,
      views: viewsData[0]?.totalViews || 0,
      salesHistory: req.salesHistory || [], // last 10 sales
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
