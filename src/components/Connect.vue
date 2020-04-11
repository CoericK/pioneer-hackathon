<template>
	<form @submit.prevent="connect">
		<input type="text" v-model="groupID" />
		<input type="text" v-model="name" />

        <button type="submit">connect</button>
	</form>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "Room",
	data: function() {
		return {
			groupID: 'test',
			name: 'Talfa Ester'
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
