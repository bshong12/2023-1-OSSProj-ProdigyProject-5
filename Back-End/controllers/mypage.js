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
    id = req.user.id; // 토큰에서 id 가져옴
    const reservation = await db.getReservation();
    const myReservation = await reservation.find(reserv => reserv.user_id === id);
    res.status(200).send(myReservation);
  }
  catch(err) {
    console.log(err)
  }
}

async function getReservation(req, res) {
  try{

  }
  catch(err) {
    console.log(err)
  }
}

async function approveReservation(req, res) {
  try{

  }
  catch(err){
    console.log(err)
  }
}

module.exports = router;