const express = require("express"); // npm i express | yarn add express
const cors    = require("cors");    // npm i cors | yarn add cors
const mysql   = require("mysql");   // npm i mysql | yarn add mysql
const { default: build } = require("next/dist/build");
//const { buildings } = require("../utils/buildings");
const app     = express();
const PORT    = 3000; // 포트번호 설정

// MySQL 연결
const db = mysql.createPool({
    host: "127.0.0.1", // 호스트
    user: "root",      // 데이터베이스 계정
    password: "0000",      // 데이터베이스 비밀번호
    database: "DB",  // 사용할 데이터베이스
});

app.use(cors({
    origin: "http://localhost:3000",                // 출처 허용 옵션
    credentials: true,          // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200,  // 응답 상태 200으로 설정
}))

// post 요청 시 값을 객체로 바꿔줌
app.use(express.server()); 

//express, react 프로젝트가 다른 포트에서 작동하는 경우 발생하는 cors 오류 해결
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // React 애플리케이션의 주소로 변경해야 합니다.
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
// 서버 연결 시 발생

app.get("/api/Room", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const sqlQuery = "SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))";
    const sqlQuery2 = "SELECT name, rooms, floor FROM DB.Room GROUP BY name, rooms, floor";

db.query(sqlQuery, (err, result) => {
    if (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    } else {
        db.query(sqlQuery2, (err2, result2) => {
            if (err2) {
                console.error(err2);
                res.status(500).send("Internal server error");
            } else {
                // Process the result2 here
                const buildings = result2.map((row) => ({     
                        name:row.name,
                        room:row.rooms,
                        floor:row.floor
                    }));
                res.setHeader("Content-Type", "application/json"); // JSON 형식으로 응답을 설정
                res.send(JSON.stringify(buildings));
            }
        });
    }
});

});

app.get("/api/Lecture", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    
    const sqlQuery = "SELECT * FROM DB.Lecture";

    db.query(sqlQuery, (err, result) => {
        res.send(result);
    });
});

//module.exports = { buildings };
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
