<template>
	<div id="app">
		<!-- connection screen -->
		<Connect v-if="!isConnected"/>

		<!-- show once connected -->
		<Room v-if="isConnected"/>
	</div>
</template>

<script>
import Room from "@/components/Room";
import Connect from "@/components/Connect";

import { mapGetters } from "vuex";

export default {
	name: "App",
	computed: {
		...mapGetters(['isConnected'])
	},
	components: {
		Room,
		Connect
	}
};
</script>

<style>
	#app {
		width: 100%;
		height: 100%;
	}
</style>
