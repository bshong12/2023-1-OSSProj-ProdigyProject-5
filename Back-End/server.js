const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//
const mysql = require('mysql');
// MySQL 연결
const connection = mysql.createPool({
  host: "127.0.0.1", // 호스트
  user: "root",      // 데이터베이스 계정
  password: "0000",      // 데이터베이스 비밀번호
  database: "DB",  // 사용할 데이터베이스
});
connection.getConnection(function(err, connection) {
  // connected! (unless `err` is set)
});

/*
connection.connect((err) => {
  if (err) {
    console.error('MySQL connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to MySQL database');
});
*/

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000; // process.env라는 객체에 port라는 설정이 있다면 그 속성을 사용하고 없다면 5000을 사용함

app.get('/', (req, res) =>{
  res.send('back-end')
})
//
app.get('/buildings', (req, res) => {
  connection.query('SELECT * FROM DB.Room', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ' + err.stack);
      return res.status(500).json({ error: 'Failed to retrieve data from database' });
    }

    res.json(results);
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// 회원 가입
app.post('/signup', async (req, res) => {
  try {
    const { studentID, password, name, phonenumber } = req.body;

    // 비밀번호를 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 회원 정보 저장(나중에 DB와 연결할 부분)
    users.push({ studentID, password: hashedPassword, name, phonenumber });

    res.status(201).json({ message: '회원 가입이 완료되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 로그인
app.post('/login', async (req, res) => {
  try {
    const { studentID, password } = req.body;

    // 사용자 찾기
    const user = users.find(user => user.studentID === studentID);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 비밀번호 검증
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    // JWT 토큰 생성
    const token = jwt.sign({ studentID: user.studentID }, 'secretKey');

    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

const buildingController = require('./controllers/buildings');
const roomController = require('./controllers/rooms');
const roomReservation = require('./controllers/reservation');

app.use('/api/buildings', buildingController);
app.use('/api/buildings/:date', roomController);
app.use('/api/buildings/:date/:buildingname', roomReservation);