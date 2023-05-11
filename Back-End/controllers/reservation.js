const express = require('express');
const router = express.Router();
const buildingModel = require('../models/buildings')
// const dateService = require('../services/buildings')

// router.get('/:room', getRoomInfo);
router.get('/:room', renderForm);
router.post('/:room', postReservTime);
// router.get('/:room/reservation', getRoomsByFloor)

// 강의실 정보 가져오기
// async function getRoomInfo(req, res) {
//   try{
//       res.status(200).send()
//     }
//   catch(err) {
//     console.log(err)
//   }
// }

async function renderForm(req, res) {
  try{
    const path = req.baseUrl + req.path;
    res.send(`
    <h1>Checkbox Example</h1>
    <form action="${path}" method="post">
      <label for="time1">10:00</label>
      <input type="checkbox" id="time1" name="time" value="1000"><br>

      <label for="time2">11:00</label>
      <input type="checkbox" id="time2" name="time" value="1100"><br>

      <label for="time3">12:00</label>
      <input type="checkbox" id="time3" name="time" value="1200"><br>

      <label for="time4">1:00</label>
      <input type="checkbox" id="time4" name="time" value="1300"><br>

      <button type="submit">Submit</button>
    </form>
  `);
  }
  catch(err){
    console.log(err)
  }
}

async function postReservTime(req, res) {
  try{
    const selectedTimes = req.body.time;
    if (selectedTimes) {
      res.status(200).send('Selected times: ' + selectedTimes);
    } else {
      res.status(400).send('No times selected');
    }
  }
  catch(err) {
    console.log(err)
  }
}

module.exports = router;