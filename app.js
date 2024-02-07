require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./config/database');
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const config = require('./config/config');
const cron = require('node-cron');
const path = require('path');
const safeController = require('./controllers/safe.controller');
const notificationController = require('./controllers/notification.controller');
const app = express();

// Middleware
// app.use(cors({
//   origin: 'http://localhost',
//   credentials: true
// }));
// app.use(cors({
//   origin: '*',
//   credentials: true
// }));
const allowedOrigins = process.env.ORIGINS;
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});
// Schedule the task to add money to the safe at 12 AM daily
cron.schedule('0 0 * * *', safeController.resetTodayMoney);

// Schedule the task to run periodically (e.g., every day at midnight)
setInterval(notificationController.checkAndGenerateNotifications, 24 * 60 * 60 * 1000);


// Start server
connectToDatabase().then(() => {
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}...`);
  });
});