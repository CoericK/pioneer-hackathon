<template>
    <g @mousedown="startDrag">
	    <circle  :cx="metadata.x" :cy="metadata.y" r="20" fill="#00FF00" stroke="#000000" stroke-width="3"></circle>
        <!--<circle :cx="facePosition.x" :cy="facePosition.y" r="10" fill="rgba(0,0,0,0.3)"></circle>-->
        <circle :cx="facePosition.x-4" :cy="facePosition.y-2" r="2" fill="#000000"></circle>
        <circle :cx="facePosition.x+4" :cy="facePosition.y-2" r="2" fill="#000000"></circle>
        <path :d="`M ${facePosition.x-4} ${facePosition.y+4} l 8 0`" stroke="#000000" stroke-width="2"></path>
    </g> 
</template>

<script>
import { mapGetters } from "vuex";
import { angle, distance } from "@/utils";

export default {
	name: "Person",
    props: ['metadata', 'isself'],
    data() {
        return { dragging: false };
    },
    computed: {
        facePosition() {
            return {
                x: this.metadata.x + Math.cos(this.metadata.angle) * 10,
                y: this.metadata.y + Math.sin(this.metadata.angle) * 10
            }
        },
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
                //TODO: Spatialize the audio
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

            let lookingAngle = angle(this.metadata, cursorpt);
            if(this.angle != Math.round(lookingAngle*10)/10) {
                this.$store.dispatch('updateDirection', Math.round(lookingAngle*10)/10);
            }
            
            
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
