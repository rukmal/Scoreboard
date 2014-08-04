//==================
// Constants
//==================

var TIME_CUTOFF = 59999; // ms (59.99 seconds)
var TIME_INTERVAL = 100; // ms (time refresh rate)


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
	if (CURRENT_TIME === undefined) {
		CURRENT_TIME = initialConfig.current_time;
	}
	updateClock();
});

// Socket to recieve pause signal from server
socket.on('pause board', function () {
	stopClock();
});

// Socket to recieve start signal from server
socket.on('start board', function () {
	startClock();
});

// Socket to reset the clock
socket.on('reset clock signal', function () {
	CURRENT_TIME = initialConfig.half_length;
	$('#mainclock').css('color', 'white');
	updateClock();
});


//=====================
// Timer stuff
//=====================

var prevCycleTime = new Date().getTime();

var clockInterval;

/**
 * Function to start the game clock
 */
function startClock () {
	if (CURRENT_TIME != 0) {
		var prevCycleTime = new Date().getTime();
		clockInterval = setInterval(function () {
			var currentTime = new Date().getTime();
			if (currentTime - prevCycleTime >= TIME_INTERVAL) {
				CURRENT_TIME = CURRENT_TIME - TIME_INTERVAL;
				updateClock();
				prevCycleTime = currentTime;
			}
		}, 1);
	} else {
		socket.emit('update remote status', 'pause');
	}
}

/**
 * Function to stop the game clock
 */
function stopClock () {
	clearInterval(clockInterval);
}

/**
 * Function to get the hours, minutes, seconds and milliseconds
 * from a time in ms originally
 * @param  {Number} s Time in milliseconds
 * @return {Array}    Formatted time as [h, m, s, ms]
 */
function msToTime(s) {
	function addZ(n) {
		return (n<10? '0':'') + n;
	}
	var ms = s % 1000;
	s = (s - ms) / 1000;
	var secs = s % 60;
	s = (s - secs) / 60;
	var mins = s % 60;
	var hrs = (s - mins) / 60;
	return [addZ(hrs), mins, addZ(secs), addZ(ms)];
}

/**
 * Function to update the clock on the board
 */
function updateClock () {
	var printTime;
	if (CURRENT_TIME === 0) {
		stopClock();
		document.getElementById('buzzer').play();
		socket.emit('update remote status', 'pause');
		$('#mainclock').css('color', 'red');
	}
	var formattedTime = msToTime(CURRENT_TIME);
	if (CURRENT_TIME >= TIME_CUTOFF) {
		// Greater than TIME_CUTOFF
		printTime = formattedTime[1] + ':' + formattedTime[2];
	} else {
		// Less than TIME_CUTOFF
		var ms = formattedTime[3];
		ms = ms / 100;
		printTime = formattedTime[2] + '.' + ms;
	}
	$('#mainclock').text(printTime);
}