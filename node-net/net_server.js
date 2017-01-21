/**
 * 利用node.js的net模块进行套接字编程
 * net: 包含建立服务器和客户端的功能
 * net.Server: 用来创建一个TCP或本地服务器
 */

// 建立服务器端
const net = require('net');
const readline = require('readline');

var clients = {};
var client_id = 0;
var client_cur;
var clients_list = [];

const server = net.createServer((socket) => {
	socket.setEncoding('utf8');

	const _id = client_id++;

	if (client_cur === undefined) {
		client_cur = _id;
	} else {
		clients_list.push(_id);
	}
	clients[_id] = socket;
	console.log(`#${_id} come in!`);

	socket.on('error', (err) => {
		
	});

	socket.on('close', (had_err) => {
		if (had_err) {
			console.log(`#${_id} leave!`);
			delete clients[client_id];
			client_cur = clients_list.shift();
		}
	});

	socket.on('end', () => {
		console.log(`#${_id} leave!`);
		delete clients[client_id];
		client_cur = clients_list.shift();
	});

	socket.on('data', (data) => {
		console.log(`from #${_id}:${data}`);
	})
});

server.on('error', (err) => {
	throw err;
});

server.listen(3000, () => {
	console.log('server listening 3000.');
});

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on('line', (line) => {
	if (client_cur === undefined) {
		return false;
	};
	if (line.trim() == 'q') {
		clients[client_cur].end('byebye');
	} else {
		clients[client_cur].write(line);
	};
});
