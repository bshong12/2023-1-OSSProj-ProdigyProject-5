const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: false }));
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/', logIn);

const users = [{"id":"1", "name":"qwe", "email":"asd" },{"id":"2", "name":"asd", "email":"qwe" }]

async function logIn(req, res){
  try{
    const {id, password} = req.body;

    // 사용자 찾기
    //users -> db에서 가져오기
    const user = users.find(user => user.id === id);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 비밀번호 검증
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }
    else{
      
      // access token발급
      const accessToken = jwt.sign({
        id : user.id,
        username: user.name,
        phone : user.phonenumber,
        email : user.email
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

      res.status(200).json('login success')
      
    }

  }
  
  catch(err){
    res.status(500).json({ error: err.message });
  }
}


module.exports = router;