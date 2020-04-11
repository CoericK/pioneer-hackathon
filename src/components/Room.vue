<template>
	<div>
		<svg id="room" :viewBox="viewBoxString">
			<!-- each user will be displayed as a circle on screen -->
			<!-- this is just an example circle in the center -->
			<!--<circle cx="0" cy="0" r="20" fill="#00FF00" stroke="#000000" stroke-width="3"></circle>-->
			<Person :metadata="getSelf" />

			<Person v-for="peer in getPeers" :metadata="peer" />
		</svg>
		<div style="position:absolute; top:0;left:0;">
			<!-- debug -->
			{{ JSON.stringify(getSelf) }}
		</div>
	</div>
</template>

<script>
import Person from "@/components/Person";
import { mapGetters } from "vuex";

export default {
	name: "Room",
	computed: {
		viewBoxString () {
			// center svg on [0, 0]
			return `${-this.width/2} ${-this.height/2} ${this.width} ${this.height}`
		},
		...mapGetters(["getSelf", "getPeers"])
	},
	data: function() {
		return {
			width: 0,
			height: 0,
		}
	},
	mounted() {
		window.addEventListener('resize', this.getWindowSize);

		this.getWindowSize();
	},
	methods: {
		getWindowSize() {
			this.width = document.documentElement.clientWidth;
			this.height = document.documentElement.clientHeight;
		},
	},
	components: {
		Person
	}
};
</script>
