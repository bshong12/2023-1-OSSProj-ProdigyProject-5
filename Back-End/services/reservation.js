const buildingModel = require('../models/buildings')

const week = ['일', '월', '화', '수', '목', '금', '토'];

// 예약날짜[{name: "예약명", startTime: "시작시간", endTime: "종료시간"}, {name: "예약명", startTime: "시작시간", endTime: "종료시간"}]
async function reservedTime(date, room) {
  weekday = week[date.getDay()]   //getDay이용하여 선택된 날짜의 요일 계산
  // 강의실과 요일로 데이터베이스에서 해당하는 예약 가져옴
  // const reservation = 

  // 예약명, start time, end time만 뽑아서 저장
  result=[];
  for (let i = 0; i < reservation.length; i++) {
    let item = reservation[i];
    let name = item.event_name;
    let startTime = item.startTime;
    let endTime = item.endTime;
    result.push({name: event_name, startTime: startTime, endTime:endTime});
  }
  return result;
}

async function classTime(date, room) {
  weekday = week[date.getDay()]   //getDay이용하여 선택된 날짜의 요일 계산
  // 강의실과 요일로 데이터베이스에서 해당하는 수업 가져옴
  // const lecture=

  // 과목명, start time, end time만 뽑아서 저장
  result=[];
  for (let i = 0; i < lecture.length; i++) {
    let item = lecture[i];
    let name = item.name;
    let startTime = item.startTime;
    let endTime = item.endTime;
    result.push({name: name, startTime: startTime, endTime:endTime});
  }

  return result;
}

module.exports = {reservedTime, classTime};