const express = require('express');
const router = express.Router();
const building = require('../DB/db')
const dateStorage = require('../services/dateStorage')
// const dateService = require('../services/buildings')

router.get('/', getBuildings);
router.post('/', getDate)

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

// 날짜에 맞는 건물 정보 불러오기 
async function getDate(req, res) {
  try{
    dateStorage.setData(req.body.date);
  }
  catch(err) {
    console.log(err)
  }
}

module.exports = router;