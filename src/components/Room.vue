<template>
	<div>
		<svg id="room" :viewBox="viewBoxString">
            <!-- room image -->
            <image href="@/../static/room.png" width="800" x="-400" y="-250" style="opacity: 0.5"></image>

			<Boombox :x="-340" :y="-210" />
            
            <!-- people -->
            <Person v-for="peer in getPeers" :metadata="peer" />
			<Person :metadata="getSelf" :isself="true" />
		</svg>
		<div style="position:absolute; top:0;left:0;">
			<!-- debug -->
			{{ JSON.stringify(getSelf) }}
		</div>
	</div>
</template>

<script>
import Person from "@/components/Person";
import Boombox from "@/components/Boombox";
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
		Person,
		Boombox
	}
};
</script>

<style>
    .room > image {
        pointer-events: none;
    }
</style>
