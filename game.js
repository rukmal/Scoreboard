function Game (board_cfg, io, writeToLog) {
	var GAME = board_cfg;
	GAME.team_home_score = 0;
	GAME.team_away_score = 0;

	io.on('connection', function (socket) {
		// socket to get type of connection
		socket.on('type', function (type) {
			writeToLog('Connection of type ' + type + ' initiated');
		});

		// socket to send initial game state
		socket.emit('initial game state', GAME);
		writeToLog('Initial game configuration sent');

		// socket to recieve updated time from the board
		socket.on('update time', function (newTime) {
			GAME.current_time = newTime;
		});

		// socket to recieve 'pause' signal from the remote
		socket.on('pause time', function () {
			pauseBoard();
		});

		// socket to recieve 'start' signal from the remote
		socket.on('start time', function () {
			startBoard();
		});

		// socket to receive updated board status to be sent to the remote
		socket.on('update remote status', function (status) {
			updateTimeStatus(status);
		});

		// socket to receive signal to reset the game clock from the remote
		socket.on('reset clock', function () {
			writeToLog('Signal to reset game clock received and sent to board');
			io.emit('reset clock signal', '');
		})

		// socket to receive signal to reset shot clock from the remote
		socket.on('reset shot clock', function () {
			writeToLog('Signal to reset shot clock received and sent to board');
			io.emit('reset shot clock signal', '');
		});

		// socket to receive signal to start a timeout from the remote
		socket.on('start timeout', function () {
			writeToLog('Signal to start a timeout received and sent to board');
			io.emit('start timeout signal', '');
		});

		// socket to receive signal to change score from the remote
		socket.on('update score', function (newScoreInfo) {
			if (newScoreInfo.team === GAME.team_home) {
				GAME.team_home_score = newScoreInfo.score;
			} else {
				GAME.team_away_score = newScoreInfo.score;
			}
			writeToLog(newScoreInfo.team + '\'s score updated to ' + newScoreInfo.score);
			io.emit('update score signal', newScoreInfo);
		});

		/**
		 * Function to pause timer on the board
		 */
		function pauseBoard () {
			io.emit('pause board', '');
			writeToLog('Board timer stopped');
			updateTimeStatus('pause');
		}

		/**
		 * Function to start the timer on the board
		 */
		function startBoard () {
			io.emit('start board', '');
			writeToLog('Board timer started');
			updateTimeStatus('start');
		}
	});
}

module.exports = Game;