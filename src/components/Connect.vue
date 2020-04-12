<template>
	<div class="connect-container">
		<form @submit.prevent="connect">
			<h1>🏠</h1>
			<h1>Cozy Room</h1>
			<div class="label">Group ID</div>
			<input type="text" v-model="groupID" />

			<div class="label">Display Name</div>
			<input type="text" v-model="name" placeholder="Your Name" /><br>

			<button type="submit">Connect</button>
		</form>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "Room",
	data: function() {
		return {
			groupID: 'hackathon',
			name: ''
		}
	},
	methods: {
		connect() {
			this.$store.dispatch('connectGroup', {
				groupID: this.groupID,
				name: this.name
			})
		}
	}
};
</script>

<style>
	.connect-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
	}
	.connect-container form {
		display: block;
		margin: auto;
	}

	.connect-container h1 {
		text-align: center;
		font-family: Georgia, 'Times New Roman', Times, serif;
	}

	.connect-container .label {
		font: bold 12px sans-serif;
	}

	.connect-container input {
		border-radius: 5px;
		padding: 6px 11px;
		font-size: 16px;
		font-family: sans-serif;
		border: 1px solid #999999;
		background: #F9F9F9;
		margin-bottom: 20px;
		margin-top: 4px;
		outline: none;
	}
	.connect-container input:focus {
		border-color: #0099FF;
	}

	.connect-container button {
		border: none;
		outline: none;
		background: #0099FF;
		width: 100%;
		font: 16px sans-serif;
		color: #FFFFFF;
		padding: 10px 0px;
		border-radius: 10px;
		margin-top: 20px;
	}
</style>
