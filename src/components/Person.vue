<template>
    <g>
	    <circle :cx="metadata.x" :cy="metadata.y" r="20" fill="#00FF00" stroke="#000000" stroke-width="3"></circle>
    </g> 
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "Person",
    props: ['metadata', 'notrack'],
    computed: {
		...mapGetters(['audioContext'])
	},
    /*data: function () {
        return {
            x: this.metadata.x,
            y: this.metadata.y,
        }
    },*/
    watch: {
        "metadata.tracks.audio": {
            // the callback will be called immediately after the start of the observation
            immediate: true, 
            handler (track, oldVal) {
                //console.log(val);
                if(track != undefined && track.constructor == MediaStreamTrack) {
                    this.connectAudioSource(track);
                }
            }
        },
    },
    methods: {
        connectAudioSource(track) {
            if(!this.notrack) {
                let stream = new MediaStream();
                stream.addTrack(track);

                var source = this.audioContext.createMediaStreamSource(stream);

                source.connect(this.audioContext.destination);
            }
        }
    }
};
</script>
