//==================
// Constants
//==================

var TIME_CUTOFF = 599900; // ms (59.99 seconds)
var TIME_INTERVAL = 10; // ms


//==================
// Game variables
//==================

var initialConfig;
var CURRENT_TIME;


//==================
// Socket.io stuff
//==================

var socket = io.connect();

// Socket to emit type of connection to server
socket.emit('type', 'board');

// Socket to receive initial game configuration
socket.on('initial game state', function (initialState) {
	initialConfig = initialState;
	CURRENT_TIME = initialConfig.current_time;
});

// Socket to recieve pause signal from server
socket.on('pause board', function () {
	stopClock();
});

// Socket to recieve start signal from server
socket.on('start board', function () {
	startClock();
});


//=====================
// Timer stuff
//=====================

var prevCycleTime = new Date().getTime();

var clockInterval;

function startClock () {
	var prevCycleTime = new Date().getTime();
	clockInterval = setInterval(function () {
		var currentTime = new Date().getTime();
		if (currentTime - prevCycleTime >= TIME_INTERVAL) {
			CURRENT_TIME = CURRENT_TIME - TIME_INTERVAL;
			updateClock();
			prevCycleTime = currentTime;
		}
	}, 1);
}

function stopClock () {
	clearInterval(clockInterval);
}

function updateClock () {
	var printTime;
	currentTempTime = CURRENT_TIME / 100;
	if (currentTempTime >= TIME_CUTOFF) {
		printTime = currentTempTime % 10 + ':' + currentTempTime;
	} else {
		printTime = currentTempTime % 600 + ':' + currentTempTime % 10;
	}
	console.log(currentTempTime + '   ' + printTime);
	$('#testtimer').text(printTime);
}