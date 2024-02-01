const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  email: String,
  address: String,
  whatsapp: String,
  website: String,
  termsOfService: String,
  photo: {
    filename: String,
    path: String,
    metadata: {
      // Add any additional metadata fields for the photo
      // ...
    }
  }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;