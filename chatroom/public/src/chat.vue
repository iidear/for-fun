<template>
	<div id="app">
		<h1>Welcome~ {{name}}</h1>

		<div id="user-list" class="user-list-wrap">
			<div class="user-list">
				<p v-for="user in users" v-text="user.name"></p>
			</div>
		</div>

		<div id="chat-area" class="chat-area">
			<p class="notice">Now you can say Hi to others</p>
			<div class="messages">
				<p class="records" v-for="record in records">
					<span class="name" v-text="record.name"></span>:
					<span class="msg" v-text="record.msg"></span>
				</p>
			</div>
			<div class="input-box">
				<form>
					<input type="text" class="input-msg" v-model="message" >
					<input type="submit" class="btn" value="Send" @click="sendMsg">
				</form>
			</div>
		</div>

	</div>
</template>

<script>
	import VueSocketIo from 'vue-socket.io';
	import Vue from 'vue';
	Vue.use(VueSocketIo, 'http://100.77.42.232:9001');
	export default {
		data() {
			return {
				name: localStorage.getItem('name') || 'anony',
				records: [{
					name: 'iidear',
					msg: 'hi, everyone!'
				}],
				users: [],
				message: ''
			}
		},
		methods: {
			sendMsg: function(msg) {
				this.$socket.emit('chat message', {
					name: this.name,
					msg: this.message
				});
				this.message = '';
				return false;
			}
		},
		sockets: {
			connect: function() {
				console.log('connect')
				
			},
			'chat message': function (msg) {
				this.records.push(msg);
			},
			// 直接update整个列表，性能貌似不好
			// 'add user': function (user) {
			// 	this.users.push(user);
			// },
			// 'del user': function (id) {
			// 	this.users = this.users.filter(function(user) {
			// 		return user.id != id;
			// 	})
			// },
			'update users': function (users) {
				this.users = users;
			}
		},
		created: function() {
			this.name = localStorage.getItem('name');
			if (!this.name) {
				this.$router.push('/login');
				return false;
			}
			this.$socket.emit('new user', this.name);
		}
	}
</script>

<style>
html,body,div,p,h1{
	margin: 0;
	padding: 0;
}
body{
	background-color: rgb(62, 62, 62);
}
h1{
	height: 68px;
	line-height: 68px;
	color: #111;
	font-size: 26px;
}
#app{
	width: 900px;
	margin: auto;
}

.user-list-wrap{
	float: left;
	width: 200px;
	height: 520px;
	border-right: 1px solid #e8eaea;
	background-color: #e9eaea;
	box-sizing: border-box;
}

.user-list{
	position: relative;
	padding: 20px 28px;
	overflow-x: hidden;
	overflow-y: auto;
}
.user-list p{
	line-height: 24px;
	color: #333;
}
.user-list-wrap::before{
	content: '>';
	display: block;
	position: absolute;
	left: -24px;
	top: 0;
	font-size: 20px;
	background: #fff;
	border: 1px solid #999;
	width: 22px;
	text-align: center;
}


.chat-area{
	height: 520px;
	margin-left: 210px;
	background-color: #fff;
}

.chat-area .notice{
    background: rgba(62,62,62,0.5);
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
}

.chat-area .messages {
	box-sizing: border-box;
	height: 440px;
	padding: 6px 20px 0px;
	border-bottom: 1px solid #ededed;
	overflow-y: auto;
}

.records .name{
	display: inline-block;
	width: 50px;
	text-overflow: ellipsis;

}
.input-box{
	margin-top: 10px;
	height: 40px;

}
.input-box .input-msg{
	height: 28px;
	line-height: 28px;
	width: 480px;
	margin: 0 20px;
	padding-left: 12px;
	box-sizing: border-box;

}
.input-box .btn{
	width: 86px;
	height: 36px;
	line-height: 36px;
	text-align: center;
}
</style>