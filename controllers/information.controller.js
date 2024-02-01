const {  Section, ProductSection, Supplier, Dealer, DollarPrice } = require('../models/information.model');
// Sections controller
async function getSections(req, res) {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function getSectionById (req, res) {
  try {
    const section = await Section.findById(req.params.id);
    res.json(section);
  } catch (error) {
    console.error('Failed to get device:', error.message);
    res.status(500).json({ message: 'Failed to get device' });
  }
};

async function createSection(req, res) {
  try {
    const section = new Section({
      name: req.body.name,
      description: req.body.description,
      checkingFees: req.body.checkingFees,
    });

    const savedSection = await section.save();
    res.status(201).json(savedSection);
  } catch (err) {
    console.warn(err);
    res.status(400).send(err);
  }
};

async function updateSection(req, res) {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteSection(req, res) {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// ProductSections controller
async function getProductSection(req, res) {
  try {
    const productSections = await ProductSection.find();
    res.json(productSections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function getProductSectionById (req, res) {
  try {
    const productSections = await ProductSection.findById(req.params.id);
    res.json(productSections);
  } catch (error) {
    console.error('Failed to get device:', error.message);
    res.status(500).json({ message: 'Failed to get device' });
  }
};

async function createProductSection(req, res) {
  try {
    const productSections = new ProductSection({
      name: req.body.name,
      description: req.body.description,
      checkingFees: req.body.checkingFees,
    });

    const savedProductSection = await productSections.save();
    res.status(201).json(savedProductSection);
  } catch (err) {
    console.warn(err);
    res.status(400).send(err);
  }
};

async function updateProductSection(req, res) {
  try {
    const productSections = await ProductSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(productSections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteProductSection(req, res) {
  try {
    const productSection = await ProductSection.findByIdAndDelete(req.params.id);
    if (!productSection) {
      return res.status(404).json({ error: 'Product Section not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Suppliers controller
async function getSuppliers(req, res) {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function getSupplierById (req, res) {
  try {
    const supplier = await Supplier.findById(req.params.id);
    res.json(supplier);
  } catch (error) {
    console.error('Failed to get device:', error.message);
    res.status(500).json({ message: 'Failed to get device' });
  }
};

async function createSupplier(req, res) {
  try {
    const { name, owner, whatsappNumber,address,phone,notes,cash,owing} = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required required' });
    }
    
    const supplier = new Supplier({ name, owner,whatsappNumber,address,phone,notes,cash,owing});
    const savedSupplier = await supplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    console.error('Failed to create device:', error.message);
    res.status(500).json({ message: 'Failed to create device' });
  }
};

async function updateSupplier(req, res) {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(supplier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateSupplierProducts(req, res) {
  try {
    const supplierId = req.params.id;
    const {product} = req.body;

    if(!product){
      console.log("their is no product with the req");
      return res.status(404).json({ error: 'their is no product with the req' });
    }

    // Find the supplier by ID
    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const productIndex = supplier.products.findIndex(p => p.productId === product.productId);
    if (productIndex === -1) {
      const data = {
        productId: product.productId,
        productName: product.productName,
        informations: [
          {
            quantity: product.quantity,
            purchasePrice: product.purchasePrice,
            purchasedate: product.purchasedate,
            whatIsPaid: product.whatIsPaid,
            oweing: product.oweing,
          }
        ]
      }
      // product._id = product.productId;
      supplier.products.push(data);
    }else {
      const information = {
        quantity: product.quantity,
        purchasePrice: product.purchasePrice,
        purchasedate: product.purchasedate,
        whatIsPaid: product.whatIsPaid,
        oweing: product.oweing,
      }
      supplier.products[productIndex].informations.push(information);
    }
    if (isNaN(supplier.cash)) {
      supplier.cash = 0;
    }
    if(isNaN(supplier.owing)) {
      supplier.owing = 0;
    }
    supplier.cash += product.whatIsPaid;
    supplier.owing += product.oweing;
    // Save the updated supplier
    const updatedSupplier = await supplier.save();
    if (!updatedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    if (productIndex === -1) {
      res.status(201).json(updatedSupplier.products[updatedSupplier.products.length - 1].informations[0]);
    }else {
      const informationIndex = updatedSupplier.products[productIndex].informations.length - 1;
      res.status(201).json(updatedSupplier.products[productIndex].informations[informationIndex]);
    }
  } catch (err) {
    console.error('Failed to update supplier products:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function updateSupplierCash(req, res) {
  try {
    const supplierId = req.params.id;
    const cash = req.body;
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    if (isNaN(supplier.cash)) {
      supplier.cash = 0;
    }
    if(isNaN(supplier.owing)) {
      supplier.owing = 0;
    }
    supplier.cash += cash;
    supplier.owing -= cash;
    
    const updatedSupplier = await supplier.save();
    res.status(201).json(updatedSupplier.cash, updatedSupplier.owing);
  } catch (err) {
    console.error('Failed to add cash:', err.message);
    res.status(500).json({error: 'Internal server error'});
  }
}

async function deleteSupplierProduct(req, res) {
  try {
    const supplierId = req.params.supplierId;
    const productId = req.params.productId;
    const informationId = req.params.informationId;

    // Find the supplier by ID
    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    // Find the index of the product to be deleted
    const productIndex = supplier.products.findIndex(product => product.productId === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Supplier product not found' });
    }

    if(supplier.products[productIndex].informations.length === 1){
      supplier.cash -= supplier.products[productIndex].informations[0].whatIsPaid;
      supplier.owing -= supplier.products[productIndex].informations[0].oweing;
      supplier.products.splice(productIndex, 1);
    }else {
      // Find the index of the information to be deleted
      const informationIndex = supplier.products[productIndex].informations.findIndex(info => info._id == informationId);
      if (informationIndex === -1) {
        return res.status(404).json({ error: 'Supplier product information not found' });
      }
      // Remove the information from the product's informations array
      supplier.cash -= supplier.products[productIndex].informations[informationIndex].whatIsPaid;
      supplier.owing -= supplier.products[productIndex].informations[informationIndex].oweing;
      supplier.products[productIndex].informations.splice(informationIndex, 1);
    }


    // Save the updated supplier
    const updatedSupplier = await supplier.save();
    if (!updatedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.status(200).json(updatedSupplier);
  } catch (err) {
    console.error('Failed to delete supplier product:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteSupplier(req, res) {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Dealers controller
async function getDealers(req, res) {
  try {
    const dealers = await Dealer.find();
    res.json(dealers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getDealerById (req, res) {
  try {
    const dealer = await Dealer.findById(req.params.id);
    res.json(dealer);
  } catch (error) {
    console.error('Failed to get device:', error.message);
    res.status(500).json({ message: 'Failed to get device' });
  }
};

async function createDealer(req, res) {
  try {
    const dealer = new Dealer({
      name: req.body.name,
      owner: req.body.owner,
      whatsappNumber: req.body.whatsappNumber,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      notes: req.body.notes,
    });
    const savedDealer = await dealer.save();
    res.status(201).json(savedDealer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateDealer(req, res) {
  try {
    const dealer = await Dealer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(dealer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteDealer(req, res) {
  try {
    const dealer = await Dealer.findByIdAndDelete(req.params.id);
    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Dollar prices controller
async function getDollarPrice(req, res) {
  try {
    const dollarPrice = await DollarPrice.findOne().sort({ date: -1 });
    res.json(dollarPrice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function getDollarPriceById (req, res) {
  try {
    const dollarPrice = await DollarPrice.findById(req.params.id);
    res.json(dollarPrice);
  } catch (error) {
    console.error('Failed to get device:', error.message);
    res.status(500).json({ message: 'Failed to get device' });
  }
};

async function createDollarPrice(req, res) {
  try {
    const dollarPrice = new DollarPrice({
      price: req.body.price,
      date: req.body.date,
    });
    await dollarPrice.save();
    res.json(dollarPrice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateDollarPrice(req, res) {
  try {
    const dollarPrice = await DollarPrice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(dollarPrice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteDollarPrice(req, res) {
  try {
    const dollarPrice = await DollarPrice.findByIdAndDelete(req.params.id);
    if (!dollarPrice) {
      return res.status(404).json({ error: 'Dollar price not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  getProductSection,
  getProductSectionById,
  createProductSection,
  updateProductSection,
  deleteProductSection,
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  updateSupplierProducts,
  deleteSupplierProduct,
  updateSupplierCash,
  deleteSupplier,
  getDealers,
  getDealerById,
  createDealer,
  updateDealer,
  deleteDealer,
  getDollarPrice,
  getDollarPriceById,
  createDollarPrice,
  updateDollarPrice,
  deleteDollarPrice,
};