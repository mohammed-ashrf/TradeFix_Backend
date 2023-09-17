const Notification = require('../models/notification.model');
const Device = require('../models/device.model');
const Product = require('../models/product.model');

async function getNotifications (req, res) {
  try {
    const notifications = await Notification.find().sort({ timestamp: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Failed to get notifications:', error.message);
    res.status(500).json({ message: 'Failed to get notifications' });
  }
};

async function getProductNotifications(req, res) {
  try {
    const notifications = await Notification.find({ type: 'product' }).sort({ timestamp: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Failed to get product notifications:', error.message);
    res.status(500).json({ message: 'Failed to get product notifications' });
  }
};

async function getRepairNotifications (req, res) {
  try {
    const notifications = await Notification.find({ type: 'repair' }).sort({ timestamp: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Failed to get repair notifications:', error.message);
    res.status(500).json({ message: 'Failed to get repair notifications' });
  }
};

async function deleteNotification(req, res) {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Failed to delete notification:', error.message);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};

async function createNotification (req, res) {
    try {
      const { title, message, type, id } = req.body;
  
      if (!title || !message || !type || id) {
        return res.status(400).json({ message: 'Title, message, and type are required' });
      }
  
      const notification = new Notification({ title, message, type, id });
      const savedNotification = await notification.save();
      res.status(201).json(savedNotification);
    } catch (error) {
      console.error('Failed to create notification:', error.message);
      res.status(500).json({ message: 'Failed to create notification' });
    }
};

async function generateRepairNotifications() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const repairNotifications = await Device.find({ toDeliverdate: tomorrow });
  return repairNotifications;
}

async function generateProductNotifications() {
  const lowQuantityProducts = await Product.find({ quantity: { $lte: 5 } });
  const criticalQuantityProducts = await Product.find({ quantity: { $lte: 1 } });

  const productNotifications = [...lowQuantityProducts, ...criticalQuantityProducts];
  return productNotifications;
}

async function checkAndGenerateNotifications() {
  const repairNotifications = await generateRepairNotifications();
  const productNotifications = await generateProductNotifications();

  // Example function to trigger the notification mechanism
  triggerNotificationMechanism(repairNotifications, productNotifications);
}

async function triggerNotificationMechanism(repairNotifications, productNotifications) {
  // Store repair notifications in the database
  for (const notification of repairNotifications) {
    const existingNotification = await Notification.findOne({ message: `${notification.clientName} is scheduled to be delivered tomorrow.` });
    if (existingNotification) {
      console.log(`Repair notification with ID ${notification.id} already exists. Skipping...`);
      continue;
    }
    const repairNotification = new Notification({
      title: 'Repair Notification',
      message: `${notification.clientName} is scheduled to be delivered tomorrow.`,
      type: 'repair',
      id: `${notification.id}`,
    });
    
    await repairNotification.save();
  }

  // Store product notifications in the database
  for (const notification of productNotifications) {
    const existingNotification = await Notification.findOne({ message:  `${notification.name} has low quantity: ${notification.quantity}.`});
    if (existingNotification) {
      console.log(`Product notification with ID ${notification.id} already exists. Skipping...`);
      continue;
    }

    const productNotification = new Notification({
      title: 'Product Notification',
      message: `${notification.name} has low quantity: ${notification.quantity}.`,
      type: 'product',
      id: `${notification.id}`,
    });
    await productNotification.save();
  }
}

module.exports = {
  getNotifications,
  getProductNotifications,
  getRepairNotifications,
  createNotification,
  deleteNotification,
  checkAndGenerateNotifications,  
}
