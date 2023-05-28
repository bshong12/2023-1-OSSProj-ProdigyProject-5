const express = require('express');
const router = express.Router();
const buildingModel = require('../models/buildings');
const {reservedTime, classTime} = require('../services/reservation');
const {verifyToken} = require('../services/auth')

router.get('/:room', getTimetable);   // 예약 가능한 시간 불러오기
router.post('/:room', postReservTime);  // 선택한 시간 예약 저장
router.post('/:room/reservation', verifyToken, getReservation);  // 선택한 시간 예약 저장
router.post('/:room/reservation', postReservation);  // 선택한 시간 예약 저장

async function getTimetable(req, res) {
  try{
    // 건물, 날짜, 강의실 이름 req.params로 주어짐
    // 건물, 강의실 이름에 맞는 수업&예약 정보 mysql에서 가져옴 -> 한 강의실
    // 날짜로 요일 계산해서 그 요일에 맞는 수업시간 가져옴
    const date = req.params.date;
    const room = req.params.room;
    const time1 = reservedTime(date, room)
    const time2 = classTime(date, room)

    // time = time1.concat(time2) // 예약과 수업으로 인해 사용되는 시간(시작, 끝시간 주어짐)

    res.status(200).send(time);
  }
  catch(err) {
    console.log(err);
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

async function getReservation(req, res) {
  try{
    const user = req.user;
    res.status(200).json(user);
  }
  catch(err) {

  }
}

async function postReservation(req, res) {
  try{
    
  }
  catch(err) {

  }
}

module.exports = router;