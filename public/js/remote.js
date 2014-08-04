var socket = io();

var initialConfig;

// Socket to emit type of connection to server
socket.emit('type', 'remote');

// Button handler to send signal to server to pause time
$('#start').click(function () {
	socket.emit('start time', '');
});

// Button handler to send signal to server to start time
$('#stop').click(function () {
	socket.emit('pause time', '');
});

// Button handler to send signal to server to reset clock
$('#resetclock').click(function () {
	socket.emit('reset clock', '');
});

// Button handler to send signal to server to reset shot clock
$('#shotclock').click(function () {
	socket.emit('reset shot clock', '');
});

// Button handler to send signal to server to start a timeout
$('#timeout').click(function () {
	socket.emit('start timeout', '');
});

// Functions to give functionality to plus and minus buttons

$('#teamhomeplus').click(function () {
	var val = parseInt($('#teamhomescore').attr('value'));
	val++;
	$('#teamhomescore').attr('value', val);
	changeScore(initialConfig.team_home, val);
});

$('#teamawayplus').click(function () {
	var val = parseInt($('#teamawayscore').attr('value'));
	val++;
	$('#teamawayscore').attr('value', val);
	changeScore(initialConfig.team_away, val);
});

$('#teamhomeminus').click(function () {
	var val = parseInt($('#teamhomescore').attr('value'));
	val--;
	$('#teamhomescore').attr('value', val);
	changeScore(initialConfig.team_home, val);
});

$('#teamawayminus').click(function () {
	var val = parseInt($('#teamawayscore').attr('value'));
	val--;
	$('#teamawayscore').attr('value', val);
	changeScore(initialConfig.team_away, val);
});

/**
 * Function to change the score of a team
 * @param  {Strong} scoreTeam Name of the team that scored
 * @param  {Number} newScore  New score of the team
 */
function changeScore (scoreTeam, newScore) {
	var out = {
		score: newScore,
		team: scoreTeam
	}
	socket.emit('update score', out);
}

socket.on('initial game state', function (state) {
	initialConfig = state;
	$('#teamhometitle').text(initialConfig.team_home);
	$('#teamawaytitle').text(initialConfig.team_away);
	$('#teamhomescore').attr('value', initialConfig.team_home_score);
	$('#teamawayscore').attr('value', initialConfig.team_away_score);
});

function updatePageTimeStatus (status) {
	var status;
	if (status === 'start') {
		status = 'Clock Running';
	} else {
		status = 'Clock Stopped';
	}
	$('#timerstatus').text(status);
}