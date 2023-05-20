const express = require('express');
const app = express();
const mysql = require('mysql');

// MySQL 연결
const connection = mysql.createPool({
  host: "127.0.0.1", // 호스트
  user: "root",      // 데이터베이스 계정
  password: "0000",  // 데이터베이스 비밀번호
  database: "DB",    // 사용할 데이터베이스
});

// 데이터베이스 값 가져오는 함수
// 1. 건물명, 이미지링크 가져오기
const getRoomNames = () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT name, image FROM DB.Building", (error, results) => {
        if (error) {
          reject(error);
        } else {
          const values = results.map(row => ({ name: row.name, image: row.image }));
          resolve(values);
        }
      });
    });
  };
  
// 2. 건물별 강의실 목록과 강의실 정보
const getRoomInfo = () => {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM DB.Room", (error, results) => {
        if (error) {
          reject(error);
        } else {
          const groupedValues = results.reduce((acc, value) => {
            if (!acc[value.name]) {
              acc[value.name] = {
                name: value.name,
                rooms: []
              };
            }
            acc[value.name].rooms.push({
              room: value.rooms,
              capacity: value.capacity,
              equip_info: value.equip_info,
              facility_info: value.facility_info,
              floor: value.floor
            });
            return acc;
          }, {});
  
          const output = Object.values(groupedValues).map(value => ({
            name: value.name,
            rooms: value.rooms.sort((a, b) => a.room.localeCompare(b.room))
          }));
  
          resolve(output);
        }
      });
    });
  };
  

// 데이터베이스 값 export하는 함수
// 1. 건물명 [{'name':건물1, 'image':'이미지바이너리형태'},{'name':건물2, 'image':'이미지바이너리형태'}...] 형태
// image 컬럼의 내용은 BLOB(Binary Large Object) 데이터 타입
const exportgetRoomNames = async () => {
  const values = await getRoomNames();
  return values; //map(value => value.name)
};

// 2. 건물별 강의실 목록과 강의실 정보 
// 형태 [{'name':'명진관',{'room':'302','info':'건물설명','floor':4},{'room':'302','info':'건물설명','floor':4},{'room':'302','info':'건물설명','floor':4}}...]
const exportgetRoomInfo = async () => {
  const values = await getRoomInfo();
  return values;
};

// export 함수를 export
module.exports = {
  getRoomNames: exportgetRoomNames,
  getRoomInfo: exportgetRoomInfo
};
