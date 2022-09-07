const express = require('express');
const app = express();
const PORT = 5000;

const {User} = require('./models/User');
const {auth} = require('./middleware/auth');
const config = require('./config/key');


// express version 4.x 부터는 body-parser가 내장되어 있음
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log(`MongoDB Connected..`))
  .catch(err => console.log(err));



app.get('/', (req, res) => res.send(`Hello world!`));

app.get('/api/hello', (req, res) => {
  res.send('안녕하세요')
});


app.post('/api/users/register', (req, res) => {
  //정보들을 db에 넣기전에 암호화시켜주어야함.(User.js에서 pre('save', func)로 코딩)
  //회원가입시 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if(err) 
      return res.json({success: false, err});
    return res.json({success: true});
  });
});

app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 찾기
  User.findOne({email: req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    //이메일이 db에 있다면 pw도 일치하는지 확인
    } else {
      //comparePassword를 User.js에서 생성해주어야함.
      user.comparePassword(req.body.password, (err, isMatch) => {
        //isMatch가 있냐없냐 여부로 pw일치확인
        if(!isMatch)
          return res.json({
            loginSuccess: false,
            message: "비밀번호가 틀렸습니다."
          });
        //이메일, pw까지 모두 일치한다면 토큰생성하기
          user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);
            //user안에 토큰이 저장된 상태. 쿠키나 localstorage 등에 user를 저장할 수 있음.
            //일단 쿠키에 저장하겠음. 각기 장단점이 있음
            res.cookie("x_auth", user.token)
            .status(200)
            .json({
              loginSuccess: true,
              userId: user._id
            });
          });
        });
    };
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    name: req.user.name,
    email: req.user.email,
    lastname: req.user.lastname,
    image: req.user.image,
  });
})

app.get('/api/users/logout', auth, (req, res) => {
  //userid를 찾아내서 token 비워내면 알아서 logout됨.
  User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {
    if(err) return res.json({success: false, err});
    return res.status(200).send({
      success: true
    });
  });
});


app.listen(PORT, ()=> console.log(`Application listening on port: ${PORT}!`));