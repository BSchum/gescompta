const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


require('./config.js');
app.set('view engine','ejs');
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use('/', require('./controllers'));
app.listen(process.env.PORT, function() {
  console.log('Server is responding on: '+ process.env.PORT);
});
