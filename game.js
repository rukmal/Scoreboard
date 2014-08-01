function Game (board_cfg, io, writeToLog) {
	var GAME = {
		current_time: 0,
		start_time: 0,
		half_number: 0,
		team_home: 0,
		team_away: 0
	}

	io.on('connection', function (socket) {
		socket.on('type', function (type) {
			writeToLog('Connection of type ' + type + ' initiated');
		});
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

		// Socket to recieve 'pause' signal from the remote
		socket.on('pause time', function () {
			pauseBoard();
		});

		// Socket to recieve 'start' signal from the remote
		socket.on('start time', function () {
			startBoard();
		});

		/**
		 * Function to pause timer on the board
		 */
		function pauseBoard () {
			io.sockets.emit('pause board', '');
			writeToLog('Board timer stopped');
		}

		/**
		 * Function to start the timer on the board
		 */
		function startBoard () {
			io.sockets.emit('start board', '');
			writeToLog('Board timer started');
		}

		/**
		 * Function to update the score on the board
		 */
		function updateBoardScore () {
			var score = {};
			score[team_home] = GAME.team_home;
			score[team_away] = GAME.team_away;
			io.sockets.emit('update scores', score);
			writeToLog('New scores sent to board');
		}
	});
}

module.exports = Game;