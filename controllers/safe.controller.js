const Safe = require('../models/safe.model');
const Transaction = require('../models/transaction.model');

// Add money to the safe
exports.addMoney = async (req, res) => {
  try {
    const { amount, date, fromWhere, whichUser } = req.body;

    // Create a new transaction
    const transaction = new Transaction({
      amount: amount,
      type: 'addition',
      fromWhere: fromWhere,
      whichUser: whichUser,
      date: date
    });

    // Save the transaction
    await transaction.save();

    // Update the current balance in the safe
    let safe = await Safe.findOne();
    if (!safe) {
      safe = new Safe({
        cashBalance: 0,
        productsMoney: 0,
        initialBalance: 0,
        productsMoneyAfterSelling: 0,
        TotalLossesMoney: 0,
        todayBalance: 0,
        transactions: []
      });
    }
    
    safe.cashBalance += amount;
    safe.todayBalance += amount;
    if (fromWhere === "sell" || fromWhere === "repairProducts") {
      safe.productsMoneyAfterSelling += amount;
    }
    safe.transactions.push(transaction);
    await safe.save();

    res.status(200).json({ message: 'Money added to the safe successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Deduct money from the safe
exports.deductMoney = async (req, res) => {
  try {
    const { amount, date, fromWhere, whichUser } = req.body;

    // Create a new transaction
    const transaction = new Transaction({
      amount: amount,
      type: 'deduction',
      fromWhere: fromWhere,
      whichUser: whichUser,
      date: date || new Date()
    });

    // Save the transaction
    await transaction.save();

    // Update the current balance in the safe
    let safe = await Safe.findOne();
    if (!safe) {
      safe = new Safe({
        cashBalance: 0,
        productsMoney: 0,
        initialBalance: 0,
        productsMoneyAfterSelling: 0,
        TotalLossesMoney: 0,
        todayBalance: 0,
        transactions: []
      });
    }
    
    safe.cashBalance -= amount;
    if (fromWhere === "buyingProducts") {
      safe.productsMoney += amount;
    }
    safe.transactions.push(transaction);
    await safe.save();

    res.status(200).json({ message: 'Money deducted from the safe successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get the safe balance
exports.getSafeBalance = async (req, res) => {
  try {
    let safe = await Safe.findOne();
    if (!safe) {
      safe = new Safe({
        cashBalance: 0,
        productsMoney: 0,
        initialBalance: 0,
        productsMoneyAfterSelling: 0,
        TotalLossesMoney: 0,
        todayBalance: 0,
        transactions: []
      });
      await safe.save();
    }

    res.status(200).json({ balance: safe.cashBalance, productsMoney: safe.productsMoney, initialBalance: safe.initialBalance, productsMoneyAfterSelling: safe.productsMoneyAfterSelling, todayBalance: safe.todayBalance,totalLosses: safe.TotalLossesMoney });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get the transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
    const safe = await Safe.findOne().populate('transactions');
    res.status(200).json({ transactions: safe.transactions });
  } catch (error){
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateInitialBalance = async (req,res) => {
  try {
    const initialBalance = req.body;
    let safe = await Safe.findOne();
    if (!safe) {
      safe = new Safe({
        cashBalance: 0,
        productsMoney: 0,
        initialBalance: 0,
        productsMoneyAfterSelling: 0,
        TotalLossesMoney: 0,
        todayBalance: 0,
        transactions: []
      });
    }
    
    safe.cashBalance -= safe.initialBalance;
    safe.initialBalance = initialBalance;
    safe.cashBalance += initialBalance;
    await safe.save();
  } catch (error) {
    console.error(error);
    console.error('Failed to add initial balance:', error);
  }
};

exports.resetTodayMoney = async () => {
  try {
    let safe = await Safe.findOne();
    if (!safe) {
      safe = new Safe({
        cashBalance: 0,
        productsMoney: 0,
        initialBalance: 0,
        productsMoneyAfterSelling: 0,
        transactions: []
      });
    }
    
    safe.todayBalance = 0;
    await safe.save();
  } catch(error) {
    console.error('Failed to reset today money:', error);
  }
}