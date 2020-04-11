<template>
    <g>
	    <circle @mousedown="startDrag" :cx="metadata.x" :cy="metadata.y" r="20" fill="#00FF00" stroke="#000000" stroke-width="3"></circle>
    </g> 
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "Person",
    props: ['metadata', 'isself'],
    data() {
        return {dragging: false};
    },
    computed: {
		...mapGetters(['audioContext'])
    },
    mounted() {
        if(this.isself) {
            window.addEventListener('mousemove', this.mouseMove);
        }
    },
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
            if(!this.isself) {
                let stream = new MediaStream();
                stream.addTrack(track);

                var source = this.audioContext.createMediaStreamSource(stream);

                source.connect(this.audioContext.destination);
            }
        },
        mouseMove(e) {
            let svg = document.querySelector('#room');

            let leftMouseButtonOnlyDown = e.buttons === undefined 
                    ? e.which === 1 
                    : e.buttons === 1;
            
            var pt = svg.createSVGPoint();
			pt.x = e.clientX;
            pt.y = e.clientY;
            
            var cursorpt =  pt.matrixTransform(svg.getScreenCTM().inverse());
            
            if(leftMouseButtonOnlyDown && this.dragging == true) {
                this.$store.dispatch('updatePosition', {
                    x: cursorpt.x,
                    y: cursorpt.y
                });
            } else {
                this.dragging = false;
            }
        },
        startDrag() {
            if(this.isself) {
                this.dragging = true;
            }
        }
    }
};
</script>
