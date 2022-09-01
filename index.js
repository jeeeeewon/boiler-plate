const express = require('express');
const app = express();
const PORT = 3000;
const {User} = require('./models/User');
const config = require('./config/key');

// express version 4.x 부터는 body-parser가 내장되어 있음
const bodyParser = require('body-parser');
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
//application/json
app.use(bodyParser.json());


const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log(`MongoDB Connected..`))
  .catch(err => console.log(err));



app.get('/', (req, res) => res.send(`Hello world!`));

app.post('/register', (req, res) => {
  //회원가입시 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if(err) 
      return res.json({success: false, err});
    return res.json({success: true});
  });
});


app.listen(PORT, ()=> console.log(`Application listening on port: ${PORT}!`));