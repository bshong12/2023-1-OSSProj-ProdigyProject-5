const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 5000; // process.env라는 객체에 port라는 설정이 있다면 그 속성을 사용하고 없다면 5000을 사용함

app.get('/', (req, res) =>{
  res.send('back-end')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const buildingController = require('./controllers/buildings');

app.use('/buildings', buildingController);