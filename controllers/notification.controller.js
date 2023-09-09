const Notification = require('../models/notification.model');
const Device = require('../models/device.model');
const Product = require('../models/product.model');
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN, { polling: false });
bot.start((ctx)=> {
  const chatId = ctx.chat.id;
  ctx.reply('Hello, welcome to the app notifications!');
  console.log(chatId);
});
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
  const { notificationId } = req.params.id;

  try {
    const deletedNotification = await Notification.findByIdAndDelete(notificationId);
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
      bot.telegram.sendMessage(process.env.CHATID, notification.message);
      bot.launch();
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
    // Send Telegram notification
    bot.telegram.sendMessage(process.env.CHATID, `Repair ID ${notification.clientName} is scheduled to be delivered tomorrow.`);
    bot.launch();
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
    // Send Telegram notification
    bot.telegram.sendMessage(process.env.CHATID, `${notification.name} has low quantity: ${notification.quantity}.`);
    bot.launch();
  }
}
// bot reminder command
// bot.command('reminder', (ctx) => {
//   ctx.reply('Please enter the title of the reminder:');
//   // Set a new state to handle the next user input
//   ctx.session.reminder = { step: 'title' };
// });

// bot.on('text', (ctx) => {
//   const { text } = ctx.message;
//   const { reminder } = ctx.session;

//   if (reminder && reminder.step === 'title') {
//     reminder.title = text;
//     reminder.step = 'date';
//     ctx.reply('Please enter the date of the reminder (YYYY-MM-DD):');
//   } else if (reminder && reminder.step === 'date') {
//     const date = new Date(text);
//     if (isNaN(date)) {
//       ctx.reply('Invalid date format. Please enter the date of the reminder (YYYY-MM-DD):');
//     } else {
//       reminder.date = date;
//       // Save the reminder or perform anyadditional actions with the reminder, such as storing it in the database or sending it to the user.
//       // For example, you can send a message with the contents of the reminder to the user on the specified date.
//       const formattedDate = reminder.date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//       });
//       ctx.reply(`Your reminder "${reminder.title}" is set for ${formattedDate}.`);
//       // Reset the reminder state
//       ctx.session.reminder = null;
//     }
//   }
// });

// Add this line to enable the session middleware

module.exports = {
  getNotifications,
  getProductNotifications,
  getRepairNotifications,
  createNotification,
  deleteNotification,
  checkAndGenerateNotifications,  
}