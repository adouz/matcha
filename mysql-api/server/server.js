const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  http = require('http').Server(app),
  path = require('path'),
  ip = require("ip");
const {
  PORT = 3000
} = process.env

global.appSecret = "matchawebappsecret";
global.host = ip.address();
console.log ( 'host ip:',ip.address());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
/*bodyParser = {
  json: {limit: '50mb', extended: true},
  urlencoded: {limit: '50mb', extended: true}
};*/
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(cors());
app.use((err, req, res, next) => {
  // This check makes sure this is a JSON parsing issue, but it might be
  // coming from any middleware, not just body-parser:
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      //console.error(err);
      return res.sendStatus(400); // Bad request
      //return res.end();
  }
  next();
});
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