var socket = io.connect('http://localhost:3000')
	, news = io.connect('http://localhost:3000/news')
	, room = "";

socket.on('connected', function () {
	console.log('connected');
	socket.emit('set nickname', 'andrei');
	navigator.geolocation.getCurrentPosition(function (pos) {
		socket.emit('set location', {
			pos : {
				lat : pos.coords.latitude,
				lng : pos.coords.longitude
			}
		});
	});
});

socket.on('ready', function (data) {
	console.log(data);
});

socket.on('newmsg', handleMsg);

function handleMsg (msg) {
	console.log(msg);
}

function sendMsg (msg) {
	socket.emit('msg', msg);
}