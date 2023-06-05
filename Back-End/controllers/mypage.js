const express = require('express');
const router = express.Router();
const db = require('../DB/db');
const {verifyToken} = require('../services/auth')

router.get('/mypage',verifyToken, myReservation);
router.get('/admin',verifyToken, getReservation);
router.post('/admin',verifyToken, approveReservation);

// mypage에 나올 예약 불러오기(본인 아이디에 따라)
async function myReservation(req, res) {
  try{
    if(req.user.type === 'S'){
    const id = req.user.id; // 토큰에서 id 가져옴
    const reservation = await db.getReservation();
    const myReserv = await reservation.filter(reserv => reserv.user_id === id);
    console.log(myReserv);
    res.status(200).json(myReserv);
    }
    else{
      res.status(401).json({ message: '학생이 아닙니다' });
    }
  }
  catch(err) {
    console.log(err)
  }
}

// 관리자 모드에 필요한 처리되지 않은 예약 가져오기
async function getReservation(req, res) {
  try{
    if(req.user.type === 'M') {
    const reservation = await db.getReservation();
    const waitingReservation = await reservation.filter(reserv => reserv.approval === 'W');
    res.status(200).json(waitingReservation);
    }
    else{
      res.status(401).json({ message: '관리자가 아닙니다' });
    }
  }
  catch(err) {
    console.log(err)
  }
}

// 관리자 모드에서 승인결과 데이터베이스에 저장
async function approveReservation(req, res) {
  try{
    if(req.user.type === 'M') {
    await db.updateApprovalToDatabase(req.body);    //req.body로 approval, id 보내야함 ex){"id":"3", "approval":"T"}
    res.status(200).send('save success')
    }
    else {
      res.status(401).json({ message: '관리자가 아닙니다' });
    }
  }
  catch(err){
    console.log(err)
  }
}

module.exports = router;