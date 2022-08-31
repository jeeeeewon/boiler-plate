const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://jiji:ec4162bc6@cluster0.dpwva3o.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log(`MongoDB Connected....`))
  .catch(err => console.log(err));



app.get('/', (req, res) => res.send(`Hello world!`));

app.listen(port, ()=> console.log(`Listening on port: {PORT}!`));