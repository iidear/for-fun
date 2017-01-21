// 建立客户端请求

const readline = require('readline');
const net = require('net');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const client = net.connect(3000, 'localhost', () => {
	client.setEncoding('utf8');
	console.log('connected to localhost:3000!\n'
			+ 'now you can send a message to the server\n'
			+ 'press `q` to exit.\n');
});

rl.on('line', (line) => {
	if (line.trim() == 'q') {
		client.end('byebye');
	} else {
		client.write(line);
	}
})

client.on('error', (err) => {
	throw err;
})

client.on('data', (data) => {
	console.log('#server:', data);
});

client.on('end', (data) => {
	console.log('server close:', data);
	rl.close();
});