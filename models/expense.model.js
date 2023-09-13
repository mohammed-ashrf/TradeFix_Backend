const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    expenses: [
      {
        amount: { type: Number, required: true },
        description: {type: String, required: true},
        date: { type: Date, required: true }
      }
    ]
});

module.exports = mongoose.model('Expense', expenseSchema);