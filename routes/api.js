const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const deviceController = require('../controllers/device.controller');
const repairController = require('../controllers/repair.controller');
const inventoryController = require('../controllers/inventory.controller');
const productController = require('../controllers/product.controller');
const informationController = require('../controllers/information.controller');
const cartController = require('../controllers/sell.controller');
const buyerController = require('../controllers/buyer.controller');
const expensesController = require('../controllers/expenses.controller');
const notificationController = require('../controllers/notification.controller');
const safeController = require('../controllers/safe.controller');
const lossesController = require('../controllers/losses.controller');
const companyController = require('../controllers/company.controller');


router.get('/devices', deviceController.getDevices);
router.get('/devices/bypage', deviceController.getDevicesByPage);
router.get('/devices/:id', deviceController.getDeviceById);
router.delete('/devices/:id', deviceController.deleteDeviceById);
router.put('/devices/:id', deviceController.updateDeviceById);
router.post('/devices', deviceController.createDevice);
// Move a delivered device to the "delivered devices" collection
router.put('/devices/:id/move-to-delivered', deviceController.moveDeviceToDelivered);
// Get all delivered devices
router.get('/devices-delivered', deviceController.getAllDeliveredDevices);
router.get('/devices-delivered/bypage', deviceController.getDeliveredDevicesByPage);
router.get('/devices-delivered/:id', deviceController.getDeliveredDeviceById);
// Delete a specific delivered device
router.delete('/devices-delivered/:id', deviceController.deleteDeliveredDevice);
// Update a delivered device
router.put('/devices-delivered/:id', deviceController.updateDeliveredDevice);
// Return a delivered device to the "devices" collection
router.put('/devices-delivered/:id/return-to-devices', deviceController.returnDeviceToDevices);
router.get('/devices-lastdevice', deviceController.getLastDevice);

router.get('/repairs', repairController.getRepairs);
router.post('/repairs', repairController.createRepair);


router.get('/inventory', inventoryController.getInventory);
router.post('/inventory', inventoryController.addInventory);
router.put('/inventory/:id', inventoryController.updateInventory);
router.delete('/inventory/:id', inventoryController.removeInventory);

router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProductById);
router.delete('/products/:id', productController.deleteProductById);
router.post('/products/purchase', productController.purchaseProducts);
router.get('/products/search', productController.searchProducts);

// Sections API
router.get('/sections', informationController.getSections);
router.get('/sections/:id', informationController.getSectionById);
router.post('/sections', informationController.createSection);
router.put('/sections/:id', informationController.updateSection);
router.delete('/sections/:id', informationController.deleteSection);

// Product Sections API
router.get('/product-sections', informationController.getProductSection);
router.get('/product-sections/:id', informationController.getProductSectionById);
router.post('/product-sections', informationController.createProductSection);
router.put('/product-sections/:id', informationController.updateProductSection);
router.delete('/product-sections/:id', informationController.deleteProductSection);

// Suppliers API
router.get('/suppliers', informationController.getSuppliers);
router.get('/suppliers/:id', informationController.getSupplierById);
router.post('/suppliers', informationController.createSupplier);
router.put('/suppliers/:id', informationController.updateSupplier);
router.put('/suppliers/:id/products', informationController.updateSupplierProducts);
router.put('/suppliers-addcash/:id', informationController.updateSupplierCash);
router.delete('/suppliers/:supplierId/products/:productId/informations/:informationId', informationController.deleteSupplierProduct);
router.delete('/suppliers/:id', informationController.deleteSupplier);
// Dealers API
router.get('/dealers', informationController.getDealers);
router.get('/dealers/:id', informationController.getDealerById);
router.post('/dealers', informationController.createDealer);
router.put('/dealers/:id', informationController.updateDealer);
router.delete('/dealers/:id', informationController.deleteDealer);

// Dollar prices API
router.get('/dollar-price', informationController.getDollarPrice);
router.get('/dollar-price/:id', informationController.getDollarPriceById);
router.post('/dollar-price', informationController.createDollarPrice);
router.put('/dollar-price/:id', informationController.updateDollarPrice);
router.delete('/dollar-price/:id', informationController.deleteDollarPrice);

// Sold Carts API
router.get('/sold-carts', cartController.getSoldCarts);
router.get('/sold-carts/:id', cartController.getSoldCartById);
router.delete('/sold-carts/:id', cartController.deleteSoldCartById);
router.put('/sold-carts/:id', cartController.updateSoldCartById);
router.post('/sold-carts', cartController.sellCart);

// Buyer API
router.get('/buyers', buyerController.getbuyers);
router.get('/buyers/:id', buyerController.getbuyerById);
router.delete('/buyers/:id',  buyerController.deletebuyerById);
router.put('/buyers/:id', buyerController.updatebuyerById);
router.post('/buyers', buyerController.sellCart);

// expenses API
router.get('/expenses', expensesController.getAllExpenses);
router.get('/expenses/filter', expensesController.getExpenses);
router.post('/expenses', expensesController.createOrUpdateExpense);

// safe api
router.post('/safe/add', safeController.addMoney);
router.post('/safe/deduct', safeController.deductMoney);
router.get('/safe/balance', safeController.getSafeBalance);
router.get('/safe/transactions', safeController.getTransactionHistory);
router.put('/safe/initialBalance', safeController.updateInitialBalance);
router.get('/safe/resetTodayMoney', safeController.resetTodayMoney);

// losses api
router.get('/losses', lossesController.getAllLosses);
router.post('/losses', lossesController.createLoss);

//notification API
router.get('/notifications', notificationController.getNotifications);
router.get('/notifications-product', notificationController.getProductNotifications);
router.get('/notifications-repair', notificationController.getRepairNotifications);
router.post('/notifications', notificationController.createNotification);
router.delete('/notifications/:id', notificationController.deleteNotification);

// Company details API
router.post('/create', upload.single('photo'), companyController.createCompany);

module.exports = router;