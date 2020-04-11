<template>
    <g :class="{ self: isself }">
        <text class="name" text-anchor="middle" :x="metadata.x" :y="metadata.y+34">{{ metadata.name }}</text>

        <g class="pointer" v-if="pointer != undefined" :transform="`translate(${metadata.x}, ${metadata.y})`">
            <g :transform="`rotate(${pointer.angle*180/Math.PI+90})`">
                <path v-if="metadata.pointer != undefined" :d="`M0 0 l0 ${-pointer.distance}`" stroke="#000000" stroke-width="3" stroke-dasharray="7 7"></path>
                <g :transform="`translate(-10, ${-pointer.distance})`">
                    <svg @mousedown="startDragPointer" width="20" height="20" viewBox="0 0 70 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28.6695 4.41465L1.41385 62.1706C-1.39872 68.1306 5.0533 74.7979 11.3108 72.7302C18.9427 70.2082 27.7074 68 35 68C42.2926 68 51.0573 70.2082 58.6892 72.7302C64.9467 74.7979 71.3987 68.1306 68.5861 62.1706L41.3305 4.41464C38.8057 -0.935455 31.1943 -0.935448 28.6695 4.41465Z" fill="black"/>
                    </svg>
                </g>
            </g>
        </g>

        <g class="player" @mousedown="startDrag">
            <circle  :cx="metadata.x" :cy="metadata.y" r="20" fill="#00FF00" stroke="#000000" stroke-width="3"></circle>
            <!--<circle :cx="facePosition.x" :cy="facePosition.y" r="10" fill="rgba(0,0,0,0.3)"></circle>-->
            
            <g class="face">
                <circle :cx="facePosition.x-4" :cy="facePosition.y-2" r="2" fill="#000000"></circle>
                <circle :cx="facePosition.x+4" :cy="facePosition.y-2" r="2" fill="#000000"></circle>
                <path :d="`M ${facePosition.x-4} ${facePosition.y+4} l 8 0`" stroke="#000000" stroke-width="2"></path>
            </g>
        </g>
    </g> 
</template>

<script>
import { mapGetters } from "vuex";
import { angle, distance } from "@/utils";

export default {
	name: "Person",
    props: ['metadata', 'isself'],
    data() {
        return { dragging: false, localPointer: null, draggingPointer: false };
    },
    computed: {
        pointer() {
            return this.metadata.pointer || this.localPointer;
        },
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

            let dist = distance(this.metadata, cursorpt);
            if(dist < 140 && dist > 21) {
                this.localPointer = {
                    //x: this.metadata.x + Math.cos(lookingAngle) * 30,
                    //y: this.metadata.y + Math.sin(lookingAngle) * 30,
                    distance: 43,
                    angle: lookingAngle
                }
            } else {
                this.localPointer = null;
            }
            
            // drag player
            if(leftMouseButtonOnlyDown && this.dragging) {
                this.$store.dispatch('updatePosition', {
                    x: cursorpt.x,
                    y: cursorpt.y
                });
            } else {
                this.dragging = false;
            }

            // drag pointer
            if(leftMouseButtonOnlyDown && this.draggingPointer) {
                this.$store.dispatch('updatePointer', {
                    distance: dist,
                    angle: lookingAngle
                });
            } else if(this.draggingPointer) {
                this.draggingPointer = false;

                this.$store.dispatch('updatePointer', null);
            }
        },
        startDrag() {
            if(this.isself) {
                this.dragging = true;
            }
        },
        startDragPointer() {
            if(this.isself) {
                this.draggingPointer = true;
            }
        }
    }
};
</script>

<style>
    .self .player { cursor: move }
    .self .pointer { cursor: move }

    .name {
        font: 12px sans-serif;
        user-select:none;
        text-align: center;
    }
</style>