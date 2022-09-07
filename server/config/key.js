//환경변수가 Production일때(배포후)는 prod.js, development일때(local)는 dev.js
if(process.env.NODE_ENV === 'production'){
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
};