const express = require('express');
const router = express.Router();
const db = require('../DB/db');
const {verifyToken} = require('../services/auth')   // 토큰 인증하는 미들웨어 

// mypage와 관리자 모드 등에서는 토큰인증이 된 경우에만 실행됨
router.get('/mypage',verifyToken, myReservation); 
router.get('/admin',verifyToken, getReservation);
router.post('/admin',verifyToken, approveReservation);

// mypage에 나올 예약 불러오기(본인 아이디에 따라)
async function myReservation(req, res) {
  try{
    if(req.user.type === 'S'){  // 학생일 경우
    const id = req.user.id; // 토큰에서 id 가져옴
    const reservation = await db.getReservation();    // 모든 예약 가져옴
    const myReserv = await reservation.filter(reserv => reserv.user_id === id);   // 그 중 로그인한 id에 맞는 예약만 골라냄
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
    if(req.user.type === 'M') { // 관리자일 경우
    const reservation = await db.getReservation();
    const waitingReservation = await reservation.filter(reserv => reserv.approval === 'W'); // 처리되지 않은 예약(W)만 골라냄
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
    if(req.user.type === 'M') { // 관리자일 경우
    await db.updateApprovalToDatabase(req.body);    //db에 저장하는 함수 req.body로 예약id,승인결과,거절사유 보내야함
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