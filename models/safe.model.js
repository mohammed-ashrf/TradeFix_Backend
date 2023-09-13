const mongoose = require('mongoose');

const safeSchema = new mongoose.Schema({
  cashBalance: {
    type: Number,
    required: true,
    default: 0
  },
  initialBalance: {
    type: Number,
    required: true,
    default: 0
  },
  todayBalance: {
    type: Number,
    required: true,
    default: 0
  },
  productsMoney: {
    type: Number,
    required: true,
    default: 0,
  },
  TotalLossesMoney: {
    type: Number,
    required: true,
    default: 0
  },
  productsMoneyAfterSelling: {
    type: Number,
    required: true,
    default: 0,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  ]
});

module.exports = mongoose.model('Safe', safeSchema);