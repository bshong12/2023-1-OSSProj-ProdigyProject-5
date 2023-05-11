const express = require('express');
const router = express.Router();
const buildingModel = require('../models/buildings')
const dateService = require('../services/buildings')

router.get('/:buildingname', getRooms);
// router.get('/:buildingname?floor={}', getRoomsByFloor)

// 강의실 목록 가져오기
async function getRooms(req, res) {
  try{
    const date = req.params.date;
    const buildingname = req.params.buildingname;
    const floor = req.query.floor;
    const building = await buildingModel.find(b => b.name === buildingname);
    // const rooms = await building.rooms.map(room => room.name)
    if(floor == null)
    res.status(200).send(building.rooms.map(r => r.name)) // 건물 내의 모든 강의실 
    else {
    const rooms = await building.rooms.filter(room => room.floor === floor)   // /:buildingname?floor={} 입력되면 입력된 층에 맞게 강의실 구별
    const roomsByFloor = rooms.map(r => r.name)
    res.status(200).send(roomsByFloor)
    }
  }
  catch(err) {
    console.log(err)
  }
}

module.exports = router;