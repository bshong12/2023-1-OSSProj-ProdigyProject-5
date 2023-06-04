const express = require('express');
const router = express.Router();

router.post('/', logOut);

function logOut(req, res){
  try{
    // token 삭제
    res.cookie("accessToken", '');
    res.status(200).json('Logout Success')
  }
  catch(err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = router;