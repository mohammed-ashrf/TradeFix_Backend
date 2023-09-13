const mongoose = require('mongoose');

const lossSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  who: {type: String, required: true},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Loss', lossSchema);