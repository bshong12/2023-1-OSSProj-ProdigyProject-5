const express = require("express");
const app = express();
const data = require('./db.js')

// 코드 추가

app.listen(3000, () => {
  console.log("App is listening on port 3000");
  console.log(data);
});

app.get('/', async (req, res) =>{
    const name = await data.map(a =>a.name);
    res.send(JSON.stringify(name));
})