const express = require('express');
const router = express.Router();
const building = require('../DB/db')

router.get('/', getBuildings);
router.get('/:date', getBuildingsByDate)

// 건물 이름 가져오기
async function getBuildings(req, res) {
  try{
    const buildingName = await building.getRoomNames();
    res.status(200).send(buildingName)
  }
  catch(err) {
    console.log(err)
  }
}

async function getBuildingsByDate(req, res) {
  try{
    const buildingName = await building.getRoomNames();
    res.status(200).send(buildingName);
  }
  catch(err) {
    console.log(err)
  }
}

module.exports = router;