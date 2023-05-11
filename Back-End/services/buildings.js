const buildingModel = require('../models/buildings')

async function findByDate(req, res) {
  const date = req.params.date;
  const buildingBydate = await buildingModel.find(b => b.date === date);
  return buildingBydate
}

module.exports = {findByDate};