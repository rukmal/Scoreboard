function Game (board_cfg, io, writeToLog) {
	var GAME = board_cfg;
	GAME.current_time = board_cfg.half_length;

	io.on('connection', function (socket) {
		// socket to get type of connection
		socket.on('type', function (type) {
			writeToLog('Connection of type ' + type + ' initiated');
		});

		// socket to send initial game state
		socket.emit('initial game state', GAME);

		// socket to recieve updated time from the board
		socket.on('update time', function (newTime) {
			GAME.current_time = newTime;
		});

		// socket to recieve updated score from the remote
		socket.on('update score', function (newScoreData) {
			var team = newScoreData.team;
			var score = newScoreData.score;
			GAME[team] = score;
			writeToLog('New score ' + score + ' recorded for ' + team);
			updateBoardScore();
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

		/**
		 * Function to update the score on the board
		 */
		function updateBoardScore () {
			var score = {};
			score[team_home] = GAME.team_home;
			score[team_away] = GAME.team_away;
			io.emit('update scores', score);
			writeToLog('New scores sent to board');
		}

		/**
		 * Function to update the time status of the clock
		 * @param  {String} status Either 'start' or 'pause'
		 */
		function updateTimeStatus (status) {
			io.emit('current time status', status);
			writeToLog('Time status changed to ' + status);
		}
	});
}

module.exports = Game;