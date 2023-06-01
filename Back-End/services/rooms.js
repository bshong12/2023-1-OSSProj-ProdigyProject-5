const db = require('../DB/db')

async function findByBuildingname(req, res) {
  const buildingname = req.params.buildingname;
  console.log(buildingname)
  const roomInfo = await db.getRoomInfo();  // 강의실 정보
  const roomsWtihBuilding = await roomInfo.filter(item => item.name == buildingname);  // 강의실 정보중 이름과 같은 항목만 뽑아냄

  rooms = roomsWtihBuilding[0].rooms; // 건물이름과 강의실 정보가 같이 있는 데이터에서 강의실 정보만 뽑아냄
  return rooms
}

module.exports = {findByBuildingname};