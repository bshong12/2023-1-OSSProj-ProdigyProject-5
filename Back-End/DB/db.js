const express = require('express');
const app = express();
const mysql = require('mysql');
const { default: axios } = require('axios');

//const axios = require(axios);

// MySQL 연결-------------------------------------------------
const connection = mysql.createPool({
  host: "127.0.0.1", // 호스트
  user: "root",      // 데이터베이스 계정
  password: "0000",   // 데이터베이스 비밀번호
  database: "DB",    // 사용할 데이터베이스
});


// 데이터베이스 >> 프론트엔드------------------------------------------

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
        const values = results.map(row => ({ id:row.id, password:row.password,  name:row.name, email:row.email, phone:row.phone, type: row.type }));
        resolve(values);
      }
    });
  });
};

// 예약내역 가져오는 함수
const getReservation = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM DB.Reservation", (error, results) => {
      if (error) {
        reject(error);
      } else {
        const values = results.map(row => ({ id: row.id, room:row.room_id, date:row.date, reason:row.reason, event_name:row.event_name, people: row.people, group_name:row.group_name, approval:row.approval, event_content:row.event_content, user_id:row.user_id, start_time:row.start_time, end_time:row.end_time, repuse_reason:row.repuse_reason }));
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

//예약내역
const exportgetReservation = async () => {
  const values = await getReservation();
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


//프론트엔드 >> 데이터베이스--------------------------------------------------------------------------------------
// reservation 데이터를 MySQL 데이터베이스에 저장하는 함수
async function saveReservationToDatabase(Reservation) {
  try {
    // Extract weekday from date
    const dateStr = new Date(Reservation.date);
    const options = { weekday: 'short' };
    const weekday = dateStr.toLocaleString('ko-KR', options); // 선택된 날짜의 요일 계산

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


// 예약 승인여부 변경하는 함수

async function updateApprovalToDatabase(Reservation) {
  try {
    let query;

    if (Reservation.approval === 'F') {
      // MySQL에 데이터 업데이트하는 쿼리 (approval이 'F'인 경우)
      query = 'UPDATE DB.Reservation SET approval = ? WHERE id = ?';
    } else {
      // MySQL에 데이터 업데이트하는 쿼리 (approval이 'F'가 아닌 경우)
      query = 'UPDATE DB.Reservation SET approval = ?, repuse_reason = ? WHERE id = ?';
    }

    // 쿼리 실행
    await connection.query(query, [Reservation.approval, Reservation.repuse_reason, Reservation.id]);
    console.log('데이터가 MySQL 데이터베이스에 저장되었습니다.');
  } catch (error) {
    console.error('데이터 저장 오류:', error);
    throw error;
  }
}


//회원정보 저장 함수
async function saveUserToDatabase(user) {
  try {
    // MySQL에 데이터 삽입하는 쿼리
    const query = 'INSERT INTO DB.User (id, password, email, name, phone, type) VALUES (?, ?, ?, ?, ?, ?)';

    // 쿼리 실행
    await connection.query(query, [user.id, user.password, user.email, user.name, user.phone, user.type]);
    console.log('데이터가 MySQL 데이터베이스에 저장되었습니다.');
  } catch (error) {
    console.error('데이터 저장 오류:', error);
    throw error;
  }
}


module.exports = {
  saveReservationToDatabase,
  saveUserToDatabase,
  updateApprovalToDatabase,
  getLecturesAndReservationsByWeekdayAndRoom,
  getRoomNames: exportgetRoomNames,
  getRoomInfo: exportgetRoomInfo,
  getUser: exportgetUser,
  getReservation: exportgetReservation
};
