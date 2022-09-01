const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { json } = require('express/lib/response');
//salt를 이용해서 비밀번호를 암호화해야함. 그렇다면 salt를 먼저 생성해줘야함.
//saltRounds는 salt가 몇글자인지를 나타냄.
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
})

userSchema.pre('save', function(next){
  var user = this;
  //비밀번호를 암호화시킴
  if(user.isModified('password')){
    bcrypt.genSalt(saltRounds, function(err, salt){
      if(err) return next(err);
      //hash는 암호화된 비밀번호임.
      bcrypt.hash(user.password, salt, function(err, hash){
          //store hash in your password DB.
          if(err) return next(err);
          user.password = hash;
          next();
      });
    });
    //비밀번호가 아닌 다른 데이터가 변경됐을때는 그냥 next로 넘어가게
  } else {
    next();
  };
});

//index.js에서 인자를 두개 받았으므로 여기서도 파라미터 2개로 해줘야함. 
userSchema.methods.comparePassword = function(plainPassword, cb){
  //유저가 로그인시 입력한 패스워드와 db에 저장된 암호화된 비밀번호를 비교해야함.
  bcrypt.compare(plainPassword, this.password, function(err, isMatch){
    //plainPassword와 this.password(암호화된db 패스워드) 비교후 match여부 err/ true로. 매치안될시 (err, null) 매치될시 (null, isMatch) 
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function(cb){
  var user = this;
  //jsonwebToken 이용해서 token 생성하기
  //_id는 db에 보면 _id가 있음.
  var token = jwt.sign(user._id.toHexString(), 'secretToken');
  user.token = token;
  user.save(function(err, user){
    if(err) return cb(err);
    cb(null, user);
  });ß
};

userSchema.statics.findByToken = function(token, cb){
  var user = this;
  //토큰을 decode
  jwt.verify(token, 'secretToken', function(err, decoded){
    user.findOne({"_id": decoded, "token": token}, function(err, user){
      if(err) return cb(err);
      cb(null, user);
    });
    //유저아이디를 이용해서 유저를 찾은 후 client에서 가져온 토큰과 db에 보관된 토큰이 일치하는지 확인.
  });
}


const User = mongoose.model('User', userSchema);

module.exports = {User};