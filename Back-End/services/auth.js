const jwt = require('jsonwebtoken');
require('dotenv').config();

async function verifyToken(req, res, next) {
  try{
    // 요청 쿠키에서 액세스 토큰 가져오기
    const accessToken = req.cookies.accessToken;

    // 액세스 토큰이 존재하지 않는 경우
    if(!accessToken){
      return res.status(401).json({ error: 'Access token not found' });
    }
    // 액세스 토큰이 존재하는 경우
    else {
      const userInfo = jwt.decode(accessToken, { complete: false })  // accessToken에서 사용자 정보 가져오기

      jwt.verify(accessToken,process.env.ACCESS_SECRET, (err, user) => {  // access token 검증
        if(err) {
          //access token 유효하지 않다면
          const refreshToken = req.cookies.refreshToken;
          if (!refreshToken) {
            return res.status(401).json('인증되지 않은 요청입니다.');
          } 

          // 리프레시 토큰 검증 
          jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, docode) => {
            if(err) {
              return res.status(403).json('리프레시 토큰이 유효하지 않습니다.');
            }
            //리프레시 토큰 유효한 경우 액세스 토큰 재발급
            const newAccessToken = jwt.sign(
              {
                id: userInfo.id,
                name: userInfo.name,
                phone : userInfo.phone,
                email: userInfo.email,
                type: userInfo.type,
              },
              process.env.ACCESS_SECRET,
              {
                expiresIn: '15m'
              }
            );
            
            // 쿠키에 새로운 액세스 토큰 저장
            res.cookie('accessToken', newAccessToken, {
              secure: false,
              httpOnly: true,
            });

            jwt.verify(newAccessToken,process.env.ACCESS_SECRET, (err, user2) =>{
              if(err) {
                return res.status(403).json('엑세스토큰이 유효하지 않습니다');
              }
              req.user = user2;
      
            })
      
            // 다음 미들웨어로 진행
            next();
          })

        }
        else{
          // access token 유효한 경우
          // 검증된 사용자 정보를 요청 객체에 저장
          req.user = user;
  
          // 다음 미들웨어로 진행
          next();
        }

      })

    }

  }
  catch(err) {
    console.log(err)
  }
}

module.exports = {verifyToken};