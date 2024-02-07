// models/product.model.js

const mongoose = require('mongoose');

// const buyer = new mongoose.Schema({
//   type: {type: String, required: false},
//   name: {type:String, required: false},
//   number: {type: String, required: false},
//   product: {type: String, required: false},
//   quantity: {type: Number, required: false},
//   itemPrice: {type: Number, required: false},
//   totalPrice: {type: Number, required: false},
//   paid: {type: Number, required: false},
//   Oweing: {type: Number, required: false},
//   sellerName: {type: String, required: false},
//   date: {type: Date, default: Date.now},
// });
const supplier = new mongoose.Schema({
  id: {type: String, required: true},
  name: {type: String, required: true},
  quantity: { type: Number, default: 0 },
  purchasePrice: { type: Number, required: true },
  purchasedate: { type: String, required: true},
  whatIsPaid: {type: Number, required: true},
  oweing: {type: Number, required: true},
  informationId: {type: String, required: false},
});
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
  suppliers: [supplier],
  description: { type: String },
  deallerSellingPrice: { type: Number, required: true },
  deallerSellingPriceAll: { type: Number, required: true },
  userSellingPrice: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true},
  quantity: { type: Number, default: 0 },
  quantitySold: {type: Number, required: false},
  sellingdate: { type: String, required: false},
});

module.exports = mongoose.model('Product', productSchema);