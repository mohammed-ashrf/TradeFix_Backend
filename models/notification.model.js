// notification.model.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    required: true,
    enum: ['product', 'repair']
  },
  id: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Notification', notificationSchema);