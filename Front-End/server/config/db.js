var mysql = require('mysql');

const db = mysql.createPool({
    host: "127.0.0.1", // 호스트
    user: "root",      // 데이터베이스 계정
    password: "0000",      // 데이터베이스 비밀번호
    database: "DB",  // 사용할 데이터베이스
});

module.exports = db;
