const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['addition', 'deduction'],
    required: true
  },
  fromWhere: {
    type: String,
    enum: ['repair', 'sell', 'repairProducts', 'buyingProducts', "worker'sBuyings", 'other'],
    required: true
  },
  whichUser: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);