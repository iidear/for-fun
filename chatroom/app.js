var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

var users = [];
var user_id = 1;

io.on('connection', function(socket){

	socket.on('new user', function (user) {
		console.log(user, 'come in');

		socket._userId = user_id++;

		users.push({
			name: user,
			id: socket._userId
		})
		// fn(users);
		io.emit('update users', users);
	})


	console.log('a user connected');

	socket.on('disconnect', function(){
		console.log('a user disconnect');
		for (let i = 0, len = users.length; i < len; i++) {
			if (users[i].id == socket._userId) {
				users.splice(i, 1);
				break;
			}
		}
		io.emit('update users', users);
		// io.emit('del user', {
		// 	id: socket._userId
		// });
	})

	socket.on('chat message', function(msg){
		console.log('message: ', msg);
		io.emit('chat message', msg);
	});

});

http.listen(9001, function(){
	console.log('server start on 9001');
})