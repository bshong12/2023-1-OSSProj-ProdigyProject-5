const express = require('express');
const router = express.Router();
const building = require('../DB/db')
const dateService = require('../services/buildings')

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

// 날짜에 맞는 건물 정보 불러오기 (나중에 db연동 후 좀 더 구체적으로 변경 예정)
async function getBuildingsByDate(req, res) {
  try{
    // const BuildingsByDate = await dateService.findByDate(req, res)
    const buildingName = await building.getRoomNames();
    res.status(200).send(buildingName);
  }
  catch(err) {
    console.log(err)
  }
}

module.exports = router;