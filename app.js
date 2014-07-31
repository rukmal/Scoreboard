/**
 * Scoreboard server logic
 *
 * @author Rukmal Weerawarana
 */

var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');
var port = process.env.PORT || 3000;


// Starting server
server.listen(port, function () {
	console.log('Scoreboard running on port ' + port);
});


// Express middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);


// Loading board configuration from config file
var board_cfg = JSON.parse(fs.readFileSync('config.json'));


// Handling routing
app.get('/', function (req, res) {
	res.render('index');
});

app.get('/board', function (req, res) {
	res.render('board');
});

app.get('/remote', function (req, res) {
	res.render('remote');
});


// 
io.on('connection', function (socket) {
	socket.on('test', function (data) {
		console.log(data);
	});
});