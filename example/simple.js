io = require('socket.io-client')

socket = io.connect('http://localhost:8080')

socket.on('a nice channel', function (msg) {
	console.log(msg);
})

socket.on('another one', function (msg) {
	console.log(msg);
})

socket.emit('subscribe', 'a nice channel');
socket.emit('subscribe', 'another one');	

socket.emit('publish', 'a nice channel', 'hay dude')
setInterval(function() {
	socket.emit('publish', 'a nice channel', 'hay dude')
}, 1000)
