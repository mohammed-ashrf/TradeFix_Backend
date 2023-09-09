const Expense = require('../models/expense.model');

async function getAllExpenses(req, res) {
    try {
      const expenses = await Expense.find();
      res.json(expenses);
    } catch (error) {
      console.error('Failed to get expenses:', error.message);
      res.status(500).json({ message: 'Failed to get expenses' });
    }
  };

async function getExpenses(req, res) {
    try {
        const { startDate, endDate } = req.query;
        let query = {};
        if (startDate && endDate) {
          query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        const expenses = await Expense.find(query);
        res.json(expenses);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

async function createOrUpdateExpense(req,res) {
    try {
        const { name, expenses } = req.body;
        if (!name) {
            res.status(404).json({error: "name is not send"});
        }

        if (!expenses) {
            res.status(404).json({error: 'expense not found'});
        }
        const amount = expenses[0].amount;
        const date = expenses[0].date;
        const existingExpense = await Expense.findOne({ name });
        if (existingExpense) {
          existingExpense.expenses.push({ amount: amount, date: date });
          await existingExpense.save();
          res.status(200).json(existingExpense);
        } else {
          const newExpense = new Expense({ name });
          newExpense.expenses.push({ amount: amount, date: date });
          await newExpense.save();
          res.status(201).json(newExpense);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllExpenses,
    getExpenses,
    createOrUpdateExpense
}