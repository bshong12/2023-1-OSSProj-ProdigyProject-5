const express = require('express');
const router = express.Router({mergeParams: true}); // 부모 라우터의 파라미터 사용하기 위해
const buildingModel = require('../models/buildings');
const {reservedTime, classTime} = require('../services/reservation');
const {verifyToken} = require('../services/auth')
const {saveReservationToDatabase} = require('../DB/db')

router.get('/:room', getTimetable);   // 예약 가능한 시간 불러오기
router.post('/:room', postReservTime);  // 선택한 시간 예약 저장
router.get('/:room/reservation', verifyToken, getReservation);  // 이전 단계에서 선택한 예약에 필요한 정보(강의실, 시간 등) 불러오기
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

    time = time1.concat(time2) // 예약과 수업으로 인해 사용되는 시간(시작, 끝시간 주어짐)

    res.status(200).send(time);
  }
  catch(err) {
    console.log(err);
  }
}

async function postReservTime(req, res) {
  try{
    window.selectedTimes = req.body.time;
    if (window.selectedTimes) {
      res.status(200).send({selectedTimes: selectedTimes});
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
    //[user: {name: “name”, studentID: “id”, phone: “phonenumber”, email: “email@gmail”}, reservation: {building: “building”, room: “room”, date: “2021-10-10”, startTime: “10:00", endTime: “11:00”}]
    const user = req.user;
    const reservation = req.params;
    reservation.time = window.selectedTimes;    
    
    const result = {
      user: user,
      reservation: reservation
    }

    res.status(200).send(result);
  }
  catch(err) {

  }
}

// 예약 정보 저장
async function postReservation(req, res) {
  try{
    const data = req.body;
    saveReservationToDatabase(data)
    // {name: “name”, studentID: “id”, phone: “phonenumber”, email: “email@gmail”} 이런 형식의 데이터를 데이터베이스에 저장
    res.status(200).send(data)
  }
  catch(err) {

  }
}

module.exports = router;