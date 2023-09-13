const Loss = require('../models/loss.model');
const Safe = require('../models/safe.model');

async function createLoss(req, res) {
  try {
    const { name, description, amount, who } = req.body;
    
    const loss = new Loss({
      name,
      description,
      amount,
      who,
    });

    await loss.save();

    let safe = await Safe.findOne();
    if (!safe) {
      return res.status(404).json({ error: 'Safe not found' });
    }

    safe.TotalLossesMoney += amount;
    await safe.save();

    res.status(201).json(loss);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create the loss' });
  }
}


async function getAllLosses(req, res) {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    if (startDate && endDate) {
      query = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }
    const losses = await Loss.find(query);
    res.json(losses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve losses' });
  }
}

module.exports = {
    createLoss,
    getAllLosses
}