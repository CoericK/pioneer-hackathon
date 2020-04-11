<template>
    <g>
	    <circle :cx="metadata.x" :cy="metadata.y" r="20" fill="#00FF00" stroke="#000000" stroke-width="3"></circle>
        <foreignObject>
            <audio></audio>
        </foreignObject>
    </g> 
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "Person",
    props: ['metadata'],
    /*data: function () {
        return {
            x: this.metadata.x,
            y: this.metadata.y,
        }
    },*/
    watch: {
        metadata: {
            // the callback will be called immediately after the start of the observation
            immediate: true, 
            handler (val, oldVal) {
                console.log('TRACKS', val.tracks);
                console.log(val.tracks.audio)
                if(val.tracks.audio != undefined) {
                    console.log('AUDIOTRACK', val.tracks.audio);
                }
            }
        },
        audio: {
            // the callback will be called immediately after the start of the observation
            immediate: true, 
            handler (val, oldVal) {
                console.log('AUDIO CHANGED', oldVal);
            }
        },
    }
};
</script>
