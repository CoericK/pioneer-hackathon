<template>
    <g :transform="`translate(${x}, ${y})`">
        <rect width="50" height="80" rx="5" fill="#373737" />

        <circle cx="25" cy="17" r="8" fill="#000000" />
        <circle cx="25" cy="17" r="1" fill="#999999" />

        <circle cx="25" cy="45" r="16" fill="#000000" />
        <circle cx="25" cy="45" r="3" fill="#999999" />
    </g> 
</template>

<script>
import { mapGetters } from "vuex";
import { angle, distance } from "@/utils";

import {audioStreamProcessor} from 'audio-stream-meter';

export default {
	name: "Boombox",
    props: [ 'x', 'y' ],
    computed: {
        ...mapGetters([ 'getBoombox' ])
    },
    mounted() {
        if(this.isself) {
            window.addEventListener('mousemove', this.mouseMove);
        }
    },
    watch: {
        
    },
    methods: {
       
    }
};
</script>

<style>
    
</style>