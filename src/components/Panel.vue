<template>
    <div id="emotePanel">
        <button @click="handleClick('😍')">😍</button>
        <button @click="handleClick('🙌')">🙌</button>
        <button @click="handleClick('♥️')">♥️</button>
        
        

        <button @click="handleClick('👊')">👊</button>
        <button @click="handleClick('🤚')">🤚</button>
        <button @click="handleClick('✌️')">✌️</button>
    </div>	
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "Panel",
    computed: {},
    watch: {},
    methods: {
        handleEmote(evt) {
            if (evt.target.id != "emotePanel") {
                return;
            }
            console.log('handleEmote', evt)
        },
        handleClick(emoji) {
            var store = this.$store
            store.dispatch('updateEmote', emoji);  
            
            window.setTimeout(function (emoji) {
                store.dispatch('updateEmote', '');
            }, 3000)
        }
    },
    mounted() {
        self.addEventListener('mousedown', this.handleEmote)
    }
};
</script>

<style>
    #emotePanel {
        padding: 5px 20px; left: 0; bottom: 50px; background-color: #F9F9F9; position: absolute;
        border: 1px solid #999999;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    #emotePanel button {
        outline: none;
        border: none;
        background: none;
        font-size: 40px;
        cursor: pointer;
        padding: 10px;
        border-radius: 50px;
    }
    #emotePanel button:hover {
        background: #EEEEEE;
    }
</style>

