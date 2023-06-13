const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
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
      throw new Error('아이디 또는 비밀번호를 잘못 입력하였습니다.');
    }

    // 비밀번호 검증
    const passwordMatch = await bcrypt.compare(password, user.password);  // 회원가입 때 bcrypt로 해싱하여 저장하였으므로 로그인 할떄도 bcrypt사용
    if (!passwordMatch) {
      throw new Error('아이디 또는 비밀번호를 잘못 입력하였습니다.');
    }
    else{
      
      // access token발급 
      const accessToken = jwt.sign({
        id : user.id,
        name: user.name,
        phone : user.phone,
        email : user.email,
        type : user.type
      }, process.env.ACCESS_SECRET,{  //.env파일에 토큰 서명을 위한 비밀키 작성되어 있음
        expiresIn : '15m'  // access 토큰의 유효기간 15분으로 설정
      })

      // refresh token발급(refresh token에는 사용자 정보 없음)
      const refreshToken = jwt.sign({}, process.env.REFRESH_SECRET,{    //.env파일에 토큰 서명을 위한 비밀키 작성되어 있음
        expiresIn : '24h'   // refresh 토큰의 유효기간 24시간으로 설정
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
      if(user.type == 'S'){ // 로그인한 사람이 학생인 경우
        res.status(200).json({type:'학생'})
      }
      else { // 로그인한 사람이 관리자인 경우
        res.status(200).json({type:"관리자"})
      }
      
      
    }

  }
  
  catch(err){
    res.status(500).json({ error: err.message });
  }
}


module.exports = router;