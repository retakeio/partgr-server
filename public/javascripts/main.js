var socket = io.connect('http://10.20.0.118:3000')
	, news = io.connect('http://10.20.0.118:3000/news')
	, img = document.querySelector('img')
	, output = document.querySelector('#output')
	, width = document.width;

img.addEventListener('dragstart', function (e) { e.preventDefault(); return false; });

document.body.addEventListener('mousemove', moveImg, false);

// img.addEventListener('mousedown', function () {
// 	console.log('mousedown');
// 	document.body.addEventListener('mousemove', moveImg, false);
// }, false);

// img.addEventListener('mouseup', function () {
// 	console.log('mouseup');
// 	document.body.removeEventListener('mousemove', moveImg, false);
// }, false);

function moveImg (e) {
	img.style['top'] = e.pageY + 'px'; 
	img.style['left'] = e.pageX + 'px';
	output.innerHTML = e.pageY + ' ' + (width - e.pageX - img.width);
	var offset = (width - e.pageX - img.width);
	if (offset < 0) {

	}
}

function drawImage () {

	var c = document.getElementById("canvas");
	c.width = img.width;
	c.height = img.height;
	var ctx = c.getContext("2d");
	ctx.drawImage(img,10,10);
	var data = canvas.toDataURL();
	sendMsg(data);

}

function receiving (img) {
	console.log(img);
}

socket.on('connected', function () {
	console.log('connected');
	socket.emit('set nickname', 'andrei');
	// navigator.geolocation.getCurrentPosition(function (pos) {
	// 	socket.emit('set location', {
	// 		pos : {
	// 			lat : pos.coords.latitude,
	// 			lng : pos.coords.longitude
	// 		}
	// 	});
	// });
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
