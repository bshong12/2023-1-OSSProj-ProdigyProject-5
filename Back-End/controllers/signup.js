const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const db = require('../DB/db');

router.post('/', signUp);

async function signUp(req, res){
  try{
    const { id, password, name, phone, email, type } = req.body;

    // 사용자 확인
    const users = await db.getUser(); // users는 데이터베이스에서 가져옴
    const existingUser = users.find(user => user.id === id);   
    if (existingUser) {  // 이미 있는 id라면 회원가입안되게 
      return res.status(409).json({ message: '이미 존재하는 사용자입니다.' });
    }


    // 비밀번호를 해시화
    const saltRounds = 10; // 솔트 라운드 수
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 회원 정보 저장
    const user = { id, password: hashedPassword, name, phone, email, type }
    db.saveUserToDatabase(user);
    res.status(201).json({ success: true, message: '회원 가입이 완료되었습니다.' });
  }
  catch(err){
    res.status(500).json({ error: err.message });
  }
}


module.exports = router;