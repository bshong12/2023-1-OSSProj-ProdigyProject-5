const express = require('express');
const router = express.Router({mergeParams: true}); // 부모 라우터의 파라미터 사용하기 위해
const buildingModel = require('../models/buildings');
const {reservedTime, reservationId} = require('../services/reservation');
const {verifyToken} = require('../services/auth')
const {saveReservationToDatabase} = require('../DB/db')

router.get('/:room', getTimetable);   // 예약 가능한 시간 불러오기
router.get('/:room/reservation', verifyToken, getReservation);  // 이전 단계에서 선택한 예약에 필요한 정보(강의실, 시간 등) 불러오기
router.post('/:room/reservation', postReservation);  // 선택한 시간 예약 저장

async function getTimetable(req, res) {
  try{
    // 건물, 날짜, 강의실 이름 req.params로 주어짐
    // 건물, 강의실 이름에 맞는 수업&예약 정보 mysql에서 가져옴 -> 한 강의실
    // 날짜로 요일 계산해서 그 요일에 맞는 수업시간 가져옴
    const date = req.params.date;
    const room = req.params.room;
    const time = await reservedTime(date, room)

    res.status(200).send(time);
  }
  catch(err) {
    console.log(err);
  }
}

async function getReservation(req, res) {
  try{
    const user = req.user;
    delete user.iat;
    delete user.exp;

    res.status(200).send(user);
  }
  catch(err) {
    console.log(err);
  }
}

// 예약 정보 저장
async function postReservation(req, res) {
  try{
    const id = await reservationId();
    const data = req.body;
    data.id = id;
    await saveReservationToDatabase(data)
    // {name: “name”, studentID: “id”, phone: “phonenumber”, email: “email@gmail”} 이런 형식의 데이터를 데이터베이스에 저장
    res.status(200).json(data)
  }
  catch(err) {
    console.log(err);
  }
}

module.exports = router;