
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , uaparser = require('ua-parser')
  , buffer    = []
  , chatList     = []
  , chatBuffer = []
  , users = {};
  ;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
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
    title : 'shipit'
  });
});


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server, {log: false});

io.sockets.on('connection', function (socket) {
  console.log('connected');
  socket.emit('connected');
  socket.on('set nickname', function (name) {
    console.log('settings nickname');
    socket.set('nickname', name, function () {
      socket.emit('ready', 'Hello, ' + name);
      users[name] = {};
    });
  socket.on('set location', function (location) {
    socket.get('nickname', function (err, name) {
      users[name].location = location.pos;
    });
  });
  socket.on('uastring', function (uastring) {
    socket.get('nickname', function (err, name) {

      var r = uaparser.parse(uastring);
      // console.log(r.ua.toString());
      users[name].family = r.ua.family || r.ua.toString();
      users[name].device = r.device.family;

      socket.broadcast.emit('userlist', users);
      socket.emit('userlist', users);

      console.log(users);

    });
  });
});

  socket.on('msg', function (data) {
    socket.get('nickname', function (err, name) {
      console.log('Chat message by ', name);
      socket.broadcast.emit('newmsg', data);
    });
  });

  socket.on('disconnect', function () { 
    socket.get('nickname', function(err, name){
      delete users[name];
      socket.broadcast.emit('userlist', users);
    });
  });

});