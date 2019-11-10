const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  http = require('http').Server(app),
  path = require('path');
const {
  PORT = 3000
} = process.env

global.appSecret = "matchawebappsecret";

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
/*bodyParser = {
  json: {limit: '50mb', extended: true},
  urlencoded: {limit: '50mb', extended: true}
};*/
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(cors());

var server = app.listen(PORT, () => {
  console.log('API server started on: ' + PORT);
});
require('./sockets').listen(server);

const dir = path.join(__dirname , '../uploads');
app.use('/uploads', express.static(dir));

var routes = require('./routes/routes');
app.use('/', routes);
/*
var routes = require('./routes');
routes(app);
*/