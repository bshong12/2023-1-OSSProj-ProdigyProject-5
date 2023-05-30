const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');

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


const buildingController = require('./controllers/buildings');
const roomController = require('./controllers/rooms');
const roomReservation = require('./controllers/reservation');
const signUp = require('./controllers/signup')
const logIn = require('./controllers/login')

app.use('/api/buildings', buildingController);
app.use('/api/buildings/:date', roomController);
app.use('/api/buildings/:date/:buildingname', roomReservation);
app.use('/api/signup', signUp)
app.use('/api/login', logIn)