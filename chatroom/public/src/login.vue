<template>
<div class="login">
	<h1>Welcome~</h1>
	<p>Your Name:</p>
	<p><input type="text" v-model="name"></input></p>
	<p><input type="submit" value="Enter" @click="login"></p>
</div>
</template>

<script>
	export default {
		data() {
			return {
				name: name
			}
		},
		methods:{
			login () {
				if (this.name == '') {
					return false;
				}
				localStorage.setItem('name', this.name);
				this.$router.push('/')
			}
		}
	}
</script>

<style>
.login p{
	text-align: center;
	line-height: 80px;
	font-size: 32px;
	color: #fff;
}
</style>