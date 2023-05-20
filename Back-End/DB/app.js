const express = require('express');
const app = express();
const db = require('./db'); // db.js 파일을 임포트합니다.

// 미들웨어 설정 등 필요한 코드 작성

// 데이터베이스 값 사용 예시
app.get('/room-names', async (req, res) => {
  try {
    const roomNames = await db.getRoomNames();
    console.log(roomNames); // 콘솔에 출력
    res.json(roomNames); // 클라이언트에 JSON 형태로 응답
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/room-info', async (req, res) => {
  try {
    const roomInfo = await db.getRoomInfo();
    console.log(roomInfo); // 콘솔에 출력
    res.json(roomInfo); // 클라이언트에 JSON 형태로 응답
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 기타 라우트 및 서버 설정 등 필요한 코드 작성

// 서버 시작
app.listen(3000, () => {
  console.log('서버가 3000번 포트에서 실행 중입니다.');
});
