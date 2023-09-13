const Expense = require('../models/expense.model');
const Safe = require('../models/safe.model');

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
      query = {
        'expenses.date': {
          $gte: new Date(startDate + 'T00:00:00.000Z'),
          $lte: new Date(endDate + 'T23:59:59.999Z')
        }
      };
    }
    const expenses = await Expense.find(query);
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
// async function getExpenses(req, res) {
//   try {
//     const { startDate, endDate } = req.query;
//     console.log(startDate, endDate);
//     let query = {};
//     if (startDate && endDate) {
//       query = {
//         expenses: {
//           $elemMatch: {
//             date: {
//               $gte: new Date(startDate + 'T00:00:00.000Z'),
//               $lte: new Date(endDate + 'T23:59:59.999Z')
//             }
//           }
//         }
//       };
//     }
//     console.log(query);
//     const expense = await Expense.findOne(query, { expenses: { $elemMatch: { date: { $exists: true } } } });
//     console.log(expense);
//     res.status(200).json(expense);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }

// async function getExpenses(req, res) {
//   try {
//     const { startDate, endDate } = req.query;
//     console.log(startDate, endDate);
//     let query = {};
//     if (startDate && endDate) {
//       query = {
//         expenses: {
//           $elemMatch: {
//             date: {
//               $gte: new Date(startDate + 'T00:00:00.000Z'),
//               $lte: new Date(endDate + 'T23:59:59.999Z')
//             }
//           }
//         }
//       };
//     }
//     console.log(query);
//     const expense = await Expense.findOne(query);
//     console.log(expense);
//     res.status(200).json(expense);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }

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
        const expenseDescription = expenses[0].description;
        const date = expenses[0].date;
        const existingExpense = await Expense.findOne({ name });
        let safe = await Safe.findOne();
        if(safe.cashBalance >= amount ) {
          if (existingExpense) {
            existingExpense.expenses.push({ amount: amount, description: expenseDescription, date: date });
            await existingExpense.save();
            safe.cashBalance -= amount;
            await safe.save();
            res.status(200).json(existingExpense);
          } else {
            const newExpense = new Expense({ name });
            newExpense.expenses.push({ amount: amount, description: expenseDescription, date: date });
            await newExpense.save();
            safe.cashBalance -= amount;
            await safe.save();
            res.status(201).json(newExpense);
          }
        }else {
          res.status(404).json({error: "Not enough Cash Balance in the safe"});
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