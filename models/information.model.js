const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    checkingFees: {type: Number},
    description: { type: String },
});
const productSectionSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    description: { type: String },
});

const supplierProductInformations = new mongoose.Schema({
    quantity: { type: Number,required: false},
    purchasePrice: { type: Number, required: false },
    purchasedate: { type: String, required: false},
    whatIsPaid: {type: Number, required: false},
    oweing: {type: Number, required: false},
});
const supplierProducts = new mongoose.Schema({
    productId: {type: String, required: false},
    productName: { type: String, required: false},
    informations: [supplierProductInformations],
});

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    whatsappNumber: {type: String},
    address: {type: String},
    phone: { type: String},
    notes: {type: String},
    cash: {type: Number, default: 0},
    owing: {type: Number, default: 0},
    products: [supplierProducts],
});

const dealerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    whatsappNumber: {type: String},
    address: {type: String},
    email: { type: String, unique: true, required: false },
    phone: { type: String },
    notes: { type: String },
});

const dollarPriceSchema = new mongoose.Schema({
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

const Section = mongoose.model('Section', sectionSchema);
const ProductSection = mongoose.model('ProductSection', productSectionSchema)
const Supplier = mongoose.model('Supplier', supplierSchema)
const Dealer = mongoose.model('Dealer', dealerSchema);
const DollarPrice = mongoose.model('DollarPrice', dollarPriceSchema);

module.exports = {
  Section,
  ProductSection,
  Supplier,
  Dealer,
  DollarPrice,
};