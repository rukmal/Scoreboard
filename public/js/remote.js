var socket = io();

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

// Socket to recieve current time status from the server
socket.on('current time status', function (status) {
	updatePageTimeStatus(status);
});

socket.on('initial game state', function (state) {
	updatePageTimeStatus(state.time_status);
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