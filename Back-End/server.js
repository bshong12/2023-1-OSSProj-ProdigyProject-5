const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


app.use(cors({

  origin: 'http://localhost:3000', // 클라이언트의 주소로 변경
  credentials: true, // 쿠키 전송을 허용
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000; // process.env라는 객체에 port라는 설정이 있다면 그 속성을 사용하고 없다면 5000을 사용함

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


const buildingController = require('./controllers/buildings');
const roomController = require('./controllers/rooms');
const roomReservation = require('./controllers/reservation');
const signUp = require('./controllers/signup');
const logIn = require('./controllers/login');
const logOut = require('./controllers/logout');
const mypage = require('./controllers/mypage');

app.use('/api/buildings', buildingController);
app.use('/api/buildings/:date', roomController);
app.use('/api/buildings/:date/:buildingname', roomReservation);
app.use('/api/signup', signUp);
app.use('/api/login', logIn);
app.use('/api/logout', logOut);
app.use('/api', mypage);