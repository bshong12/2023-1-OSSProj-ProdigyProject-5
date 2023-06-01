const jwt = require('jsonwebtoken');
require('dotenv').config();

async function verifyToken(req, res, next) {
  try {

    // 요청 쿠키에서 액세스 토큰 가져오기
    const accessToken = req.cookies.accessToken;
    // 액세스 토큰이 존재하지 않는 경우
    if (!accessToken) {
      const userInfo = jwt.docode(accessToken)  // accessToken에서 사용자 정보 가져오기

      // 리프레시 토큰 검증 및 액세스 토큰 재발급
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json('인증되지 않은 요청입니다.');
    }
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json('리프레시 토큰이 유효하지 않습니다.');
      }

      const newAccessToken = jwt.sign(
        {
          id: userInfo.id,
          username: userInfo.name,
          phone : userInfo.phonenumber,
          email: userInfo.email
        },
        process.env.ACCESS_SECRET,
        {
          expiresIn: '1m'
        }
      );

      // 쿠키에 새로운 액세스 토큰 저장
      res.cookie('accessToken', newAccessToken, {
        secure: false,
        httpOnly: true
      });

      jwt.verify(newAccessToken,process.env.ACCESS_SECRET, (err, user) =>{
        if(err) {
          return res.status(403).json('엑세스토큰이 유효하지 않습니다');
        }
        req.user = user;

      })

      // 다음 미들웨어로 진행
      next();
    });

    }
    else{
      // 액세스 토큰이 존재하는 경우, 검증 및 다음 미들웨어로 진행
      jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json('액세스 토큰이 유효하지 않습니다.');
        }

        // 검증된 사용자 정보를 요청 객체에 저장
        req.user = user;

        // 다음 미들웨어로 진행
        next();
      });
    }

  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

module.exports = {verifyToken};