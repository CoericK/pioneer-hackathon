<template>
    <g @click="showUI" :class="{ boombox: true, ui:uiView }" :transform="`translate(${x-25}, ${y-80})`">

        <rect :class="{ box:true }" rx="5" fill="#373737" />

        <foreignObject class="interface">
            <div class="container">
                <div class="controls">
                    <!--<button @click="hideUI" class="close">x</button>-->
                    <div>
                        <button class="playpause" @click="togglePlay">
                            <svg v-if="getBoombox.playing==true" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/>
                            </svg>
                        </button>

                        <div id="youtube-audio">
                        </div>
                    </div>
                </div>
                <div class="playlist">
                    <div v-for="item in getBoombox.playlist" :key="item.video_id" :class="{ 'playlist-item':true, playing: item.video_id == getBoombox.current }" >
                        {{ item.title }}
                        <div class="delete-item" @click="deletePlaylistItem(item.video_id)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/>
                            </svg>
                        </div>
                    </div>
                    <!-- playlist -->
                </div>
                <form class="inputForm" @submit.prevent="addToPlaylist">   
                    <input v-model="urlToAdd" placeholder="https://youtu.be/..."/>
                    <button type="submit">+</button>
                </form>
            </div>
        </foreignObject>

        <g class="drivers">
            <circle cx="25" cy="17" r="8" fill="#000000" />
            <circle cx="25" cy="17" r="1" fill="#999999" />

            <circle cx="25" cy="45" r="16" fill="#000000" />
            <circle cx="25" cy="45" r="3" fill="#999999" />
        </g>

        <!--<rect x="10" y="-10" width="30" height="15" rx="3" fill="#EEEEEE" stroke="#373737" stroke-width="2" />
        <text class="key" text-anchor="middle" x="25" y="1">e</text>-->
    </g> 
</template>

<script>
import { mapGetters } from "vuex";
import { angle, distance, getVideoFromPlaylist, initializePlayer } from "@/utils";

import {audioStreamProcessor} from 'audio-stream-meter';

import getJSON from 'get-json';

export default {
	name: "Boombox",
    props: [ 'x', 'y' ],
    data() {
        return {
            uiView: false,
            urlToAdd: '',
            player: null,
        }
    },
    computed: {
        ...mapGetters([ 'getBoombox', 'getSelf', 'getVIP' ])
    },
    mounted() {
        window.addEventListener('mousedown', this.mousedown);
    },
    watch: {
        'getBoombox.playing': {
            immediate: true,
            handler(value) {
                if(value) {
                    if(this.player == undefined && this.getBoombox.playlist.length > 0) {
                        this.player = initializePlayer('#youtube-audio', '');

                        this.player.on('ended', function(){
                            console.log('ENDED', this.getVIP, this.getSelf);
                            if(this.getVIP == this.getSelf) {
                                console.log('NEXTVIDEO');
                                this.$store.dispatch('nextVideo')
                            }
                        }.bind(this))

                        this.$store.dispatch('recieveCurrent', {message: {current: this.getBoombox.playlist[0].video_id}});
                    } else {
                        this.player.play();
                    }
                } else {
                    if(this.player) {
                        this.player.pause();
                    }
                }
            }
        },
        'getBoombox.current': {
            immediate: true,
            handler: function(video_id) {
                if(this.player != undefined) {
                    this.player.load(video_id, true);
                }
            }
        }
    },
    methods: {
        showUI() {
            this.uiView = true;
        },
        hideUI() {
            this.uiView = false;
        },
        processURL(url) {
            if(url.length == 11) { return url }

            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                return match[2];
            } else {
                //error
            }
        },
        addToPlaylist() {
            let video_id = this.processURL(this.urlToAdd);

            this.urlToAdd = '';

            if(video_id != undefined && getVideoFromPlaylist(video_id, this.getBoombox.playlist) == undefined) {
                getJSON(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${video_id}&format=json`, function(error, response){

                    console.log(error);
                    // undefined

                    this.$store.dispatch('addPlaylistItem', {
                        video_id,
                        title: response.title,
                        thumbnail: response.thumbnail_url
                    });
                }.bind(this));
                
            }
        },
        deletePlaylistItem(video_id) {
            this.$store.dispatch('removePlaylistItem', video_id);
        },
        togglePlay() {
            this.$store.dispatch('togglePlay');
        },
        mousedown(e) {
            let container = document.querySelector('.interface');

            // check if click was on an element within interface
            let p = e.target;
            let clickWithinInterface;

            while(clickWithinInterface == undefined) {
                p = p.parentElement;

                if(p == container) {
                    clickWithinInterface = true;
                } else if(p == document.body) {
                    clickWithinInterface = false;
                }
            }

            // if mouse outside of interface, hide
            if(!clickWithinInterface) {
                this.uiView = false;
            }
        },
        
    }
};

</script>

<style>
    .boombox:not(.ui) {
        cursor: pointer;
    }
    .boombox:not(.ui):hover .box {
        stroke: #44AAFF;
        stroke-width: 3px;
    }

    .boombox .box, .boombox .interface {
        transition: all .2s ease-out;

        width: 50px;
        height: 80px;
    }

    .boombox.ui .box, .boombox.ui .interface {
        /*transition: all .2s linear;*/

        width: 200px;
        height: 240px;
        transform: translate(-75px, -80px);
    }

    .boombox .interface { opacity: 0; pointer-events: none; }
    .boombox.ui .interface { opacity: 1; pointer-events: all; }

    .boombox .drivers {
        transition: all .2s linear;
    }

    .boombox.ui .drivers { opacity: 0 }

    text.key {
        font: bold 12px sans-serif;
    }


    .interface .container {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        overflow: hidden;

        border-radius: 5px;
    }

    .interface button, .interface input, .interface button:focus {
        background: none;
        outline: none;
        border: none;
        padding: 0;
        margin: 0;
    }

    .interface .controls {
        flex: 1 0 1;
        height: 40px;

        background: #222222;
        
        position: relative;
        display: flex;
        align-items: center;

        border-bottom: 2px solid #222222;
    }
    .interface .controls .close {
        position: absolute;
        width: 20px; height: 20px;
        top: 5px; left: 5px;
        padding: 3px;
        border-radius: 20px;
        font: bold 10px sans-serif;
        color: #FFFFFF;
        background: #222222;
        cursor: pointer;
    }

    .interface .controls > div {
        margin: auto;
    }

    .interface .controls button {
        cursor: pointer;
    }
    .interface .controls button svg {
        fill: #FFFFFF;
    }

    .interface .playlist {
        flex: 1;
        overflow-y: auto;
    }
    .interface .playlist .playlist-item {
        padding: 7px 10px 7px 15px;
        color: #FFFFFF;
        font: 12px sans-serif;
        border-bottom: 1px solid #222222;
    }
    .interface .playlist .playlist-item.playing {
        background: #555555;
    }
    .interface .playlist .playlist-item .delete-item {
        float: right;
        width: 20px;
        height: 20px;
        box-sizing: border-box;
        padding: 3px;
        margin-top: -2px;
        cursor: pointer;
    }
    .interface .playlist .playlist-item .delete-item:hover {
        background: #222222;
        border-radius: 10px;
    }
    .interface .playlist .playlist-item .delete-item svg {
        fill: #FFFFFF;
    }

    .interface .inputForm {
        flex: 1 0 1;
        height: 30px;

        

        display: flex;
    }
    .interface .inputForm input {
        flex: 1;
        color: #FFFFFF;
        padding: 0px 10px;
        border-top: 2px solid #222222;
    }
    .interface .inputForm button {
        width: 30px;
        font: bold 20px sans-serif;
        color: #FFFFFF;
        background: #222222;
        cursor: pointer;
    }
    .interface .inputForm button:hover {
        background: #0A0A0A;
    }
</style>