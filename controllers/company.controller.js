const Company = require('../models/company.model');

exports.createCompany = (req, res) => {
  const { name, phoneNumber, email, address, whatsapp, website, termsOfService } = req.body;
  const { filename, path } = req.file;

  const company = new Company({
    name,
    phoneNumber,
    email,
    address,
    whatsapp,
    website,
    termsOfService,
    photo: {
      filename,
      path,
      metadata: {
        // Set any additional metadata fields for the photo
        // ...
      }
    }
  });

  company.save()
    .then(() => {
      console.log('Company details saved to the database');
      res.status(200).json({ message: 'Company created successfully' });
    })
    .catch(err => {
      console.error('Error saving company details:', err);
      res.status(500).json({ error: 'An error occurred while creating the company' });
    });
};