const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('../DB/db');
router.post('/', logIn);

async function logIn(req, res){
  try{
    const {id, password} = req.body;

    // 사용자 찾기
    const users = await db.getUser(); // users는 데이터베이스에서 가져옴
    const user = users.find(user => user.id === id);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 비밀번호 검증
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }
    else{
      
      // access token발급
      const accessToken = jwt.sign({
        id : user.id,
        name: user.name,
        phone : user.phone,
        email : user.email,
        type : user.type
      }, process.env.ACCESS_SECRET,{
        expiresIn : '1m'
      })

      // refresh token발급
      const refreshToken = jwt.sign({}, process.env.REFRESH_SECRET,{
        expiresIn : '24h'
      })

      // token 전송
      res.cookie("accessToken", accessToken, {
        secure : false,
        httpOnly : true
      })
      res.cookie("refreshToken", refreshToken, {
        secure : false,
        httpOnly : true
      })
      if(user.type == 'S'){
        res.status(200).json({type:'학생'})
      }
      else {
        res.status(200).json({type:"관리자"})
      }
      
      
    }

  }
  
  catch(err){
    res.status(500).json({ error: err.message });
  }
}


module.exports = router;