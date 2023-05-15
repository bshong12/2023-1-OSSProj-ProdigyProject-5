const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');


app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000; // process.env라는 객체에 port라는 설정이 있다면 그 속성을 사용하고 없다면 5000을 사용함

app.get('/', (req, res) =>{
  res.send('back-end')
})

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

const buildingController = require('./controllers/buildings');
const roomController = require('./controllers/rooms');
const roomReservation = require('./controllers/reservation');

app.use('/buildings', buildingController);
app.use('/buildings/:date', roomController);
app.use('/buildings/:date/:buildingname', roomReservation);