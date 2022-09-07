//배포후 환경에서는 prod.js, heroku 사이트에서 관리가능
module.exports = {
  mongoURI: process.env.MONGO_URI
}
//MONGO_URI는 heroku사이트에서 설정한 키 그대로 가져와야함