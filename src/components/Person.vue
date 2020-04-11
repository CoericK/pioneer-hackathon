<template>
	<circle :cx="metadata.x" :cy="metadata.y" r="20" fill="#00FF00" stroke="#000000" stroke-width="3"></circle>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "Person",
    props: ['metadata'],
    data: function () {
        return {
            x: this.metadata.x,
            y: this.metadata.y
        }
    },
};
</script>
