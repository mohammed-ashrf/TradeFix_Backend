const mongoose = require('mongoose');

const product = new mongoose.Schema({
  productId: {type: String},
  productName: {type: String},
  purchasePrice: {type: Number},
  productPrice: {type: Number},
  quantity: {type: Number},
});
const repair = new mongoose.Schema({
  value: {type: String},
  engineer: {type: String},
  date: {type: Date},
});
const deviceSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  telnum: { type: String, required: true },
  deviceType: { type: String, required: true },
  section: { type: String, required: true },
  engineer: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  currentEngineer: {type:String, required: true},
  priority: { type: String, required: false},
  clientSelection: { type: String, required: true },
  complain: { type: String, required: true },
  repair: [repair],
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
  toDeliverDate: { type: String, required: true},
  repairDate: { type: String, required: false},
  repaired: { type: Boolean, required: false },
  paidAdmissionFees: { type: Boolean, required: false },
  delivered: { type: Boolean, required: false },
  returned: { type: Boolean, required: false },
  reciever: { type: String, required: true},
});

module.exports = mongoose.model('Device', deviceSchema);