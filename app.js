
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , buffer    = []
  , chatList     = []
  , chatBuffer = []
  , users = {}
  ;

var app = express();

app.configure(function(){
  app.set('port', process.env.VCAP_APP_PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function (req, res) {
  res.render('index', {
    title : 'parteger'
  });
});


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  socket.emit('connected');
  socket.on('set nickname', function (name) {
    socket.set('nickname', name, function () {
      socket.emit('ready', 'Hello, ' + name);
    });
  socket.on('set location', function (location) {
    socket.get('nickname', function (err, name) {
      console.log('location of ' + name, location);
    });
  });
  });

  socket.on('msg', function (data) {
    socket.get('nickname', function (err, name) {
      console.log('Chat message by ', name);
      socket.broadcast.emit('newmsg', data);
    });
  });

});
