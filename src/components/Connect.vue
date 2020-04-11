<template>
	<form @submit.prevent="connect">
		<input type="text" v-model="groupID" />

        <button type="submit">connect</button>
	</form>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "Room",
	data: function() {
		return {
			groupID: 'test'
		}
	},
	methods: {
		connect() {
			this.$store.dispatch('connectGroup', this.groupID)
		}
	}
};
</script>
