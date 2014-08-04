//==================
// Constants
//==================

var TIME_CUTOFF = 59999; // ms (59.99 seconds)
var TIME_INTERVAL = 100; // ms (time refresh rate)
var SHOT_CLOCK_TIME_CUTOFF = 5000 // ms (warning range)
var FIRST_CONFIG = true;


//==================
// Game variables
//==================

var initialConfig;
var CURRENT_TIME;
var CURRENT_SHOT_CLOCK_TIME;

//==================
// Socket.io stuff
//==================

var socket = io.connect();

// socket to emit type of connection to server
socket.emit('type', 'board');

// socket to receive initial game configuration
socket.on('initial game state', function (initialState) {
	initialConfig = initialState;
	if (CURRENT_TIME === undefined) {
		CURRENT_TIME = initialConfig.half_length;
		CURRENT_SHOT_CLOCK_TIME = initialConfig.shot_clock_length;
	}
	if (FIRST_CONFIG) {
		$('#tournamentlogo').attr('src', initialConfig.tournament_logo);
		$('#tournamenttitle').text(initialConfig.tournament_title);
		var homehtml = '<h4 class="teamlabel">' + initialConfig.team_home + '</h4><h2 class="scorenumber" id="' + initialConfig.team_home + 'score"></h2>';
		var awayhtml = '<h4 class="teamlabel">' + initialConfig.team_away + '</h4><h2 class="scorenumber" id="' + initialConfig.team_away + 'score"></h2>';
		$('#teamhome').append(homehtml);
		$('#teamaway').append(awayhtml);
		setScore(initialConfig.team_home, initialConfig.team_home_score);
		setScore(initialConfig.team_away, initialConfig.team_away_score);
		FIRST_CONFIG = false;
	}
	updateClock();
	resetShotClock();
});

// socket to recieve pause signal from server
socket.on('pause board', function () {
	stopClock();
});

// socket to recieve start signal from server
socket.on('start board', function () {
	startClock();
	startShotClock();
});

// socket to reset the clock
socket.on('reset clock signal', function () {
	stopClock();
	CURRENT_TIME = initialConfig.half_length;
	$('#mainclock').css('color', 'white');
	updateClock();
});

// socket to reset the shot clock
socket.on('reset shot clock signal', function () {
	resetShotClock();
	startShotClock();
});


//=====================
// Main Timer stuff
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
	resetShotClock();
}

/**
 * Function to get the hours, minutes, seconds and milliseconds
 * from a time in ms originally
 * @param  {Number} s Time in milliseconds
 * @return {Array}    Formatted time as [h, m, s, ms]
 */
function msToTime (s) {
	/**
	 * Internal function to append 0's to
	 * numbers < 10 to make them look pretty
	 * @param {Number} n Number which is to be prettified
	 */
	function addZ (n) {
		return (n < 10? '0' : '') + n;
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

/**
 * Function to update the shot clock on the board
 */
function updateShotClock () {
	var printShotClockTime = '';
	if (CURRENT_SHOT_CLOCK_TIME === 0) {
		// document.getElementById('shotclockbuzzer').play();
		stopClock();
	}
	if (CURRENT_SHOT_CLOCK_TIME < SHOT_CLOCK_TIME_CUTOFF) {
		$('#shotclocktimer').css('color', 'red');
	}
	formattedShotClockTime = msToTime(CURRENT_SHOT_CLOCK_TIME);
	var ms = formattedShotClockTime[3];
	ms = ms / 100;
	printShotClockTime = parseInt(formattedShotClockTime[2]) + '.' + ms;
	$('#shotclocktimer').text(printShotClockTime);
}


//=====================
// Shot Clock stuff
//=====================

var shotClock;

var currentShotClock;

/**
 * Function to start the shot clock
 */
function startShotClock () {
	var prevShotClockCycleTime = new Date().getTime();
	shotClock = setInterval(function () {
		var currentShotClockTime = new Date().getTime();
		if (currentShotClockTime - prevShotClockCycleTime >= TIME_INTERVAL) {
			CURRENT_SHOT_CLOCK_TIME = CURRENT_SHOT_CLOCK_TIME - TIME_INTERVAL;
			updateShotClock();
			prevShotClockCycleTime = currentShotClockTime;
		}
	}, 1);
}

/**
 * Function to reset the shot clock
 */
function resetShotClock () {
	clearInterval(shotClock);
	CURRENT_SHOT_CLOCK_TIME = initialConfig.shot_clock_length;
	$('#shotclocktimer').css('color', 'white');
	updateShotClock();
}


//=====================
// Score stuff
//=====================

/**
 * Function to set the score of a team
 * @param {String} team  Name of the team
 * @param {Number} score Score of the team
 */
function setScore (team, score) {
	$('#' + team + 'score').text(score);
}