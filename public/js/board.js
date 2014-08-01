var socket = io.connect();

// Socket to emit type of connection to server
socket.emit('type', 'board');

var currentTime = 100000000;

function reduceTime (newTime) {
	$('#testtimer').text(newTime);
}

var interval;

function startInterval () {
	interval = setInterval(function () {
		reduceTime(currentTime--);
	}, 500);
}

startInterval();

// Socket to recieve pause signal from server
socket.on('pause board', function () {
	clearInterval(interval);
});

// Socket to recieve start signal from server
socket.on('start board', function () {
	startInterval();
});