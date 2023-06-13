const express = require('express');
const router = express.Router();
const service_room = require('../services/rooms')

router.get('/:buildingname', getRooms);

// 강의실 목록 가져오기
async function getRooms(req, res) {
  try{
    const rooms = await service_room.findByBuildingname(req, res)   // buildings/:date/:buildingname에서 buildingname으로 전달된 값에 해당하는 강의실만 

    res.status(200).send(rooms);
  }
  catch(err) {
    console.log(err)
  }
}

module.exports = router;