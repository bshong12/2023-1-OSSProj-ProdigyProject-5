const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

router.post('/signup', signUp);

async function signUp(req, res){
  try{
    const { studentID, password, name, phonenumber } = req.body;

    // 사용자 확인
    const users = [] // users는 데이터베이스에서 가져와야함(지금은 임의로 설정)
    const existingUser = users.find(user => user.name === name);  
    if (existingUser) {
      return res.status(409).json({ message: '이미 존재하는 사용자입니다.' });
    }


    // 비밀번호를 해시화
    const saltRounds = 10; // 솔트 라운드 수
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 회원 정보 저장(나중에 DB와 연결할 부분)
    // saveUser({ studentID, password: hashedPassword, name, phonenumber });
    users.push({ studentID, password: hashedPassword, name, phonenumber });
    res.status(201).json({ message: '회원 가입이 완료되었습니다.' });
  }
  catch(err){
    res.status(500).json({ error: err.message });
  }
}


module.exports = router;