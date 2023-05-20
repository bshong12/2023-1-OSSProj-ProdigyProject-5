const express = require('express');
const router = express.Router();
const db = require('../DB/db')
const dateService = require('../services/buildings')

router.get('/:buildingname', getRooms);
// router.get('/:buildingname?floor={}', getRoomsByFloor)

// 강의실 목록 가져오기
async function getRooms(req, res) {
  try{
    const date = req.params.date;
    // const buildingname = req.params.buildingname;
    // const building = await buildingModel.find(b => b.name === buildingname);
    // const rooms = await building.rooms.map(room => room.name)
    // const rooms = await building.rooms.filter(room => room.floor === floor)   // /:buildingname?floor={} 입력되면 입력된 층에 맞게 강의실 구별
    // const roomsByFloor = rooms.map(r => r.name)

    const buildingname = req.params.buildingname;
    const roomInfo = await db.getRoomInfo();  // 강의실 정보
    const building = await roomInfo.filter(item => item.name == buildingname);  // 강의실 정보중 이름과 같은 항목만 뽑아냄

    res.status(200).send(building);
  }
  catch(err) {
    console.log(err)
  }
}

module.exports = router;