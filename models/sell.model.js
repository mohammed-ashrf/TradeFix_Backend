const mongoose = require('mongoose');

const CartItem = new mongoose.Schema({
    product: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
          },
        nameOfProduct: {type: String, required: true, unique: false},
        price: { type: Number, required: true },
        category: { type: String, required: true },
        status: { type: String, required: true },
        description: { type: String, required: false },
        purchasePrice: { type: Number, required: true },
        informationId: { type: String, required: false },
    },
    quantity: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
});

const soldCartSchema = new mongoose.Schema({
    cartName: {type: String, required: true},
    buyerName: {type: String, required: false},
    PhoneNumber: {type: String, required: false},
    totalPrice: {type: Number, required: true},
    discount: {type: Number, required: true},
    pastOwing: {type:Number, required: false},
    total: {type:Number, required: true},
    paid: {type: Number, required: true},
    owing: {type: Number, required: true},
    sellerName: {type: String, required: true},
    payType: {type: String, required: true},
    buyerType: {type: String, required: true},
    date: {type: Date, default: Date.now},
    products:[CartItem],
});

const buyerSchema = new mongoose.Schema({
    buyerName: {type: String, required: false},
    buyerType: {type: String, required: true},
    PhoneNumber: {type: String, required: false},
    carts: [soldCartSchema],
})

const SoldCart = mongoose.model('SoldCart', soldCartSchema);
const Buyer = mongoose.model('Buyer', buyerSchema);

module.exports = {
   SoldCart,
   Buyer
};