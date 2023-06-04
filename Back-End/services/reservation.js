const buildingModel = require('../models/buildings')
const db = require('../DB/db')

// 예약날짜[{name: "예약명", startTime: "시작시간", endTime: "종료시간"}, {name: "예약명", startTime: "시작시간", endTime: "종료시간"}]
async function reservedTime(date, room) {
  console.log(date);
  const dateStr = new Date(date);
  const options = { weekday: 'short' };
  const weekday = dateStr.toLocaleString('ko-KR', options); // 선택된 날짜의 요일 계산
  
  console.log(weekday);  
  console.log(room);


  // 강의실과 요일로 데이터베이스에서 해당하는 예약 가져옴
  const reservation = await db.getLecturesAndReservationsByWeekdayAndRoom(weekday,room);

  // 예약명, start time, end time만 뽑아서 저장
  const lectures = reservation.lectures.map(item => ({
    name: item.subject,
    startTime: item.start_time,
    endTime: item.end_time
  }));

  const reservations = reservation.reservations.map(item => ({
    name: item.event_name,
    startTime: item.start_time,
    endTime: item.end_time
  }));
  const combinedData = [...lectures, ...reservations];

  console.log(combinedData)
  return  combinedData;
}

async function reservationId(req, res) {
  try{
    const reservation = await db.getReservation();
    var maxId = 0;
    reservation.forEach(item => {
      if(item.id >maxId){
        maxId = item.id;
      }
    });

    return (maxId+1);
  }
  catch(err){
    console.log(err)
  }
}


module.exports = {reservedTime, reservationId};