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

socket.on('initial game state', function (state) {
	initialConfig = state;
	$('#teamhometitle').text(initialConfig.team_home);
	$('#teamawaytitle').text(initialConfig.team_away);
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