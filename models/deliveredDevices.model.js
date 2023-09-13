const mongoose = require('mongoose');

const product = new mongoose.Schema({
  productId: {type: String},
  productName: {type: String},
  purchasePrice: {type: Number},
  productPrice: {type: Number},
  quantity: {type: Number},
});
const deliveredDeviceSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  telnum: { type: String, required: true },
  deviceType: { type: String, required: true },
  section: { type: String, required: true },
  engineer: { type: String, required: false},
  priority: { type: String, required: false},
  clientSelection: { type: String, required: true },
  complain: { type: String, required: true },
  repair: { type: String, required: false },
  products: [product],
  notes: { type: String, required: false },
  productsMoney: {type: Number, required: false, default: 0},
  fees: { type: Number, required: true },
  discount: {type: Number, required: true},
  total: { type: Number, required: true},
  cash: { type: Number, required: true},
  owing: { type: Number, required: true},
  finished: { type: Boolean, required: false },
  receivingDate: { type: String, required: true },
  deliveredDate: { type: Date, required: true },
  repairDate: { type: String, required: true },
  repaired: { type: Boolean, required: false },
  paidAdmissionFees: { type: Boolean, required: false },
  delivered: { type: Boolean, required: false },
  returned: { type: Boolean, required: false },
});

module.exports = mongoose.model('DeliveredDevice', deliveredDeviceSchema);