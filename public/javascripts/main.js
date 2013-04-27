var socket = io.connect('http://10.20.0.118:3000')
	, news = io.connect('http://10.20.0.118:3000/news')
	, output = document.querySelector('#output')
	, width = document.width
	, img
	;

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
	img.src = msg;
}

function sendMsg (msg) {
	socket.emit('msg', msg);
}

var doc = document.documentElement;
doc.ondragover = function () { this.className = 'hover'; return false; };
doc.ondragend = function () { this.className = ''; return false; };
doc.ondrop = function (event) {
  event.preventDefault && event.preventDefault();
  this.className = '';

  // now do something with:
  var files = event.dataTransfer.files;
  console.log(files);

  if (acceptedTypes[files[0].type] === true) {
  var reader = new FileReader();
  reader.onload = function (event) {
    var image = new Image();
    image.src = event.target.result;
    image.width = 500;
    document.body.appendChild(image);

    img = image;
	img.addEventListener('dragstart', function (e) { e.preventDefault(); return false; });
	document.body.addEventListener('mousemove', moveImg, false);

  };

  reader.readAsDataURL(files[0]);
}

  return false;
};

var dndSupported = function () {
  var div = document.createElement('div');
  return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
};

if (!dndSupported()) {
	alert('drag n drop not supported');
}

var acceptedTypes = {
  'image/png': true,
  'image/jpeg': true,
  'image/gif': true
};