<template>
    <image></image>
</template>

<script>
import { mapGetters } from "vuex";

import {audioStreamProcessor} from 'audio-stream-meter';

export default {
	name: "Object",
    props: [ 'x', 'y' ],
    data() {
        return {
            
        };
    },
    computed: {
        
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