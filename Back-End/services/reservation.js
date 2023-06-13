
const db = require('../DB/db')

// 예약날짜[{name: "예약명", startTime: "시작시간", endTime: "종료시간"}, {name: "예약명", startTime: "시작시간", endTime: "종료시간"}]
async function reservedTime(date, room) {
  const dateStr = new Date(date);
  const options = { weekday: 'short' };
  const weekday = dateStr.toLocaleString('ko-KR', options); // 선택된 날짜의 요일 계산
  
  // 강의실과 요일로 데이터베이스에서 해당하는 예약 가져옴
  const reservation = await db.getLecturesAndReservationsByWeekdayAndRoom(weekday,room);

  // 예약명, start time, end time만 뽑아서 저장
  const lectures = reservation.lectures.map(item => ({
    name: item.subject,           
    startTime: item.start_time,   
    endTime: item.end_time
  }));

  const reservations = reservation.reservations
  .filter(item => item.approval !== 'F')  // 예약 거절되지 않은 예약만 필터링  
  .map(item => ({
    name: item.event_name,
    startTime: item.start_time,
    endTime: item.end_time
  }));
  const combinedData = [...lectures, ...reservations];    // 수업과 예약 시간 클라이언트로 보내서 예약시간 선택시 선택 불가능하게

  return  combinedData;
}

async function reservationId(req, res) {    // 예약id 지정(마지막 예약id 다음번호로 id지정)
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