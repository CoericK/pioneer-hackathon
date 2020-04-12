<template>
    <div id="emotePanel" style="width: 400px; height: 200px; left: 0; bottom: 0; background-color: gray; position: absolute">
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

