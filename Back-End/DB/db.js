const { default: axios } = require('axios');
const express = require('express');
const app = express();
const mysql = require('mysql');

//const axios = require(axios);

// MySQL 연결
const connection = mysql.createPool({
  host: "127.0.0.1", // 호스트
  user: "root",      // 데이터베이스 계정
  password: "0000",  // 데이터베이스 비밀번호
  database: "DB",    // 사용할 데이터베이스
});


// 데이터베이스 >> 프론트엔드

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

// 회원정보 가져오는 함수
const getUser = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM DB.User", (error, results) => {
      if (error) {
        reject(error);
      } else {
        const values = results.map(row => ({ id:row.id, password:row.password,  name:row.name, phone:row.phone, type: row.type }));
        resolve(values);
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

// 회원정보
const exportgetUser = async () => {
  const values = await getUser();
  return values;
};


// 날짜를 "YYYY-MM-DD" 형식으로 변환하는 함수
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 요일, 강의실이름에 대하여 해당하는 예약, 수업 가져오는 함수
function getLecturesAndReservationsByWeekdayAndRoom(weekday, room) {
  return new Promise((resolve, reject) => {
    const lectureQuery = 'SELECT * FROM DB.Lecture WHERE weekday = ? AND room = ?';
    connection.query(lectureQuery, [weekday, room], (lectureErr, lectureResults) => {
      if (lectureErr) {
        console.error('강의 조회 오류:', lectureErr);
        reject(lectureErr);
      } else {
        const reservationQuery = 'SELECT * FROM DB.Reservation WHERE weekday = ? AND room_id = ?';
        connection.query(reservationQuery, [weekday, room], (reservationErr, reservationResults) => {
          if (reservationErr) {
            console.error('예약 조회 오류:', reservationErr);
            reject(reservationErr);
          } else {
            resolve({ lectures: lectureResults, reservations: reservationResults });
          }
        });
      }
    });
  });
}


//프론트엔드 >> 데이터베이스
// reservation 데이터를 MySQL 데이터베이스에 저장하는 함수
async function saveReservationToDatabase(Reservation) {
  try {
    // Extract weekday from date
    const dateObj = new Date(Reservation.date);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = weekdays[dateObj.getDay()];

    // MySQL에 데이터 삽입하는 쿼리
    const query = 'INSERT INTO DB.Reservation (id, room_id, date, reason, event_name, people, group_name, event_content, user_id, approval, start_time, end_time, weekday) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // 쿼리 실행
    await connection.query(query, [Reservation.id, Reservation.room_id, Reservation.date, Reservation.reason, Reservation.event_name, Reservation.people, Reservation.group_name, Reservation.event_content, Reservation.user_id, Reservation.approval, Reservation.start_time, Reservation.end_time, weekday]);
    console.log('데이터가 MySQL 데이터베이스에 저장되었습니다.');
  } catch (error) {
    console.error('데이터 저장 오류:', error);
    throw error;
  }
}


// 예약 승인여부 전달하는 함수

async function updateApprovalToDatabase(user) {
  try {
    // MySQL에 데이터 삽입하는 쿼리
    const query = 'UPDATE DB.Reservation SET approval = ? WHERE id = ?';

    // 쿼리 실행
    await connection.query(query, [Reservation.approval, Reservation.id]);
    console.log('데이터가 MySQL 데이터베이스에 저장되었습니다.');
  } catch (error) {
    console.error('데이터 저장 오류:', error);
    throw error;
  }
}

module.exports = {
  saveReservationToDatabase,
  updateApprovalToDatabase,
  getLecturesAndReservationsByWeekdayAndRoom,
  getRoomNames: exportgetRoomNames,
  getRoomInfo: exportgetRoomInfo,
  getUser: exportgetUser
};

/*
// 프론트엔드의 user 데이터
const user = {
  username: 'JohnDoe',
  email: 'johndoe@example.com',
};

// user 데이터를 MySQL 데이터베이스에 저장하는 함수 호출
saveUserToDatabase(user)
  .then(() => {
    console.log('데이터 저장이 완료되었습니다.');
    // 추가적인 처리 또는 UI 업데이트 등을 수행할 수 있습니다.
  })
  .catch((error) => {
    console.error('데이터 저장 오류:', error);
    // 오류 처리를 수행할 수 있습니다.
  });

*/