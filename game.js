function Game (board_cfg, socket) {
	var GAME = {
		current_time: 0,
		start_time: 0,
		half_number: 0,
		team_home_score: 0,
		team_away_score: 0
	}

	/**
	 * Function to start a new half
	 */
	function startHalf () {

	}

	/**
	 * Function to start a new timeout
	 */
	function startTimeout () {

	}

	/**
	 * Function to stop a timeout
	 */
	function stopTimeout () {

	}

	/**
	 * Function to stop a half (i.e. restart)
	 */
	function stopHalf () {

	}

	/**
	 * Function to pause the timer
	 */
	function pauseTimer () {

	}

	/**
	 * Function to change the score of a team
	 * @param  {String} team  Team (i.e. either 'team_home' or 'team_away')
	 * @param  {int}    score New score of the team
	 */
	function changeScore (team, score) {

	}

	/**
	 * Function to get the formatted time
	 * @return {String} Formatted time
	 */
	function getFormattedTime() {

	}

	socket.on('update time', function (data) {
		CURRENT_TIME = data;
	});
}

module.exports = Game;