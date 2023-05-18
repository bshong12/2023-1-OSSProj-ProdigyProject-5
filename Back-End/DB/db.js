const express = require('express');
const app = express();
const mysql = require('mysql');

// MySQL 연결
const connection = mysql.createPool({
  host: "127.0.0.1", // 호스트
  user: "root",      // 데이터베이스 계정
  password: "0000",      // 데이터베이스 비밀번호
  database: "DB",  // 사용할 데이터베이스
});

// 데이터베이스 값을 가져오는 함수
const getDatabaseValues = () => {
    return connection.query("SELECT * FROM DB.Room");
  };
  
  // 데이터베이스 값을 export하는 함수
  const exportDatabaseValues = () => {
    const values = getDatabaseValues();
    return values.map(value => value.name);
  };
  
  // exportDatabaseValues() 함수를 export
  module.exports = exportDatabaseValues;