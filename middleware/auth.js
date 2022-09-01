const res = require('express/lib/response');
const {User} = require('../models/User');

let auth = (req, res, next) => {
  //인증처리를 하는 곳
  //client 쿠키에서 토큰을 가져옴
  let token = req.cookies.x_auth;
  //token을 복호화한다음 유저를 찾음
  User.findByToken(token, (err, user) => {
    if(err) throw err;
    //유저가 없으면 인증no
    if(!user) return res.json({
      isAuth: false,
      err: true
    });
    //유저가 있으면 인증ok 다음 단계진행.
    req.token = token;
    req.user = user;
    next();
  })
}

module.exports = {auth};