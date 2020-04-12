<template>
    <g :class="{ self: isself }">
        
        <text class="name" text-anchor="middle" :x="metadata.x" :y="metadata.y+34">{{ metadata.name }}</text>

        <g class="pointer" v-if="pointer != undefined" :transform="`translate(${metadata.x}, ${metadata.y})`">
            <g :transform="`rotate(${pointer.angle*180/Math.PI+90})`">
                <path v-if="metadata.pointer != undefined" :d="`M0 0 l0 ${-pointer.distance}`" stroke="#000000" stroke-width="3" stroke-dasharray="7 7"></path>
                <g :transform="`translate(-10, ${-pointer.distance})`">
                    <svg @mousedown="startDragPointer" width="20" height="20" viewBox="0 0 70 74" fill="#000000" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28.6695 4.41465L1.41385 62.1706C-1.39872 68.1306 5.0533 74.7979 11.3108 72.7302C18.9427 70.2082 27.7074 68 35 68C42.2926 68 51.0573 70.2082 58.6892 72.7302C64.9467 74.7979 71.3987 68.1306 68.5861 62.1706L41.3305 4.41464C38.8057 -0.935455 31.1943 -0.935448 28.6695 4.41465Z"/>
                    </svg>
                </g>
            </g>
        </g>

        <g class="player" @mousedown="startDrag">
            <circle  :cx="metadata.x" :cy="metadata.y" r="20" :fill="metadata.color" stroke="#000000" stroke-width="3"></circle>
            <!--<circle :cx="facePosition.x" :cy="facePosition.y" r="10" fill="rgba(0,0,0,0.3)"></circle>-->
            
            <text v-if="this.isVIP" class="vip" text-anchor="middle" :x="metadata.x" :y="metadata.y+5">VIP</text>

            <g class="face">
                <text text-anchor="middle" :x="metadata.x" :y="metadata.y-30" font-family="Verdana" font-size="25" fill="blue">{{ emote }}</text>

                <circle :cx="facePosition.x-4" :cy="facePosition.y-2" r="2" fill="#000000"></circle>
                <circle :cx="facePosition.x+4" :cy="facePosition.y-2" r="2" fill="#000000"></circle>
                <path :d="`M ${facePosition.x-4} ${facePosition.y+4} l 8 0`" stroke="#000000" stroke-width="2"></path>
                
                <ellipse :cx="facePosition.x" :cy="facePosition.y+4" rx="5" :ry="1.3 + audioMeter * 50"></ellipse>
            </g>
        </g>
    </g> 
</template>

<script>
import { mapGetters } from "vuex";
import { angle, distance, emote } from "@/utils";

import {audioStreamProcessor} from 'audio-stream-meter';

export default {
	name: "Person",
    props: ['metadata', 'isself'],
    data() {
        return {
            dragging: false,
            localPointer: null,
            draggingPointer: false,

            gainNode: null,
            pannerNode: null,
            audioMeter: 0,
        };
    },
    computed: {
        ...mapGetters(['audioContext', 'getSelf', 'getVIP']),
        pointer() {
            return this.metadata.pointer || this.localPointer;
        },
        facePosition() {
            return {
                x: this.metadata.x + Math.cos(this.metadata.angle) * 10,
                y: this.metadata.y + Math.sin(this.metadata.angle) * 10
            }
        },
		volume() {
            return Math.max(Math.min((340 - distance(this.getSelf, this.metadata))/250, 1), 0);
        },
        isVIP() {
            return this.metadata == this.getVIP;
        },
        pannerPosition() {
            return {
                x: this.metadata.x/5,
                y: 0,
                z: this.metadata.y/5
            }
        },
        listenerPositionOrientation() {
            let rad = this.metadata.angle;

            return {
                x: this.metadata.x/5,
                y: 0,
                z: this.metadata.y/5,
                v1: Math.cos(rad),
                v2: 0,
                v3: Math.sin(rad),
                v4: 0,
                v5: 1,
                v6: 0
            }
        },
        emote() {
            return this.metadata.emote["emote"]
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
        /*"volume": {
            immediate: true,
            handler (val, oldVal) {
                if(this.gainNode != undefined) {
                    this.gainNode.gain.value = val;
                }
            }
        },*/
        "pannerPosition": {
            immediate: true,
            handler(pos) {
                if(!this.isself && this.pannerNode) {
                    this.pannerNode.setPosition(pos.x, pos.y, pos.z);
                }
            }
        },
        "listenerPositionOrientation": {
            immediate: true,
            handler(p) {
                if(this.isself) {
                    this.audioContext.listener.setPosition(p.x, p.y, p.z);
                    this.audioContext.listener.setOrientation(p.v1, p.v2, p.v3, p.v4, p.v5, p.v6);
                }
            }
        }
    },
    methods: {
        connectAudioSource(track) {
            let stream = new MediaStream();
            stream.addTrack(track);

            var source = this.audioContext.createMediaStreamSource(stream);

            var meter = audioStreamProcessor(this.audioContext, function() {
                this.audioMeter = meter.volume;
            }.bind(this), { bufferSize: 256, volumeFall: 0.97 });

            source.connect(meter);
            
            /*if(!this.isself) {
                //var panner = audioContext.createPanner()
                //panner.panningModel = "HRTF"
                
                // Set the 3D position (x, y, z).
                //panner.setPosition(this.metadata.x, 0, this.metadata.y)
                var gainNode = this.audioContext.createGain();
                this.gainNode = gainNode;

                source.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
            }*/

            if(!this.isself) {
                this.pannerNode = this.audioContext.createPanner()
                this.pannerNode.panningModel = "HRTF"

                this.pannerNode.distanceModel = 'inverse';
                this.pannerNode.refDistance = 1;
                this.pannerNode.maxDistance = 10000;
                this.pannerNode.rolloffFactor = 1;
                this.pannerNode.coneInnerAngle = 360;
                this.pannerNode.coneOuterAngle = 0;
                this.pannerNode.coneOuterGain = 0;
                
                // Set the 3D position (x, y, z).
                this.pannerNode.setPosition(this.pannerPosition.x, 0, this.pannerPosition.y);
                //var gainNode = this.audioContext.createGain();
                //this.gainNode = gainNode;

                source.connect(this.pannerNode);
                this.pannerNode.connect(this.audioContext.destination);
            } else {
                let p = this.listenerPositionOrientation;
                this.audioContext.listener.setPosition(p.x, p.y, p.z);
                this.audioContext.listener.setOrientation(p.v1, p.v2, p.v3, p.v4, p.v5, p.v6);
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

    text.name {
        font: 12px sans-serif;
        user-select:none;
        text-align: center;
    }

    text.vip {
        font: bold 12px sans-serif;
        user-select:none;
        text-align: center;
        opacity: 0.1;
    }
</style>