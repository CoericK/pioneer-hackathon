import Vue from "vue";
import Vuex from "vuex";

import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

import * as actionsWebRTC from './actions-webrtc'

import { createPerson, createObject } from '@/utils.js'

import { randomColor } from 'randomcolor'

Vue.use(Vuex)

const state = {
    audioContext: new AudioContext(),

	connected: false,
	groupID: '',

	self: createPerson({ color: randomColor() }),

	boombox: createObject({
		playing: false,
		playlist: [],
		current: null
	}),

	peers: {}
}

export default new Vuex.Store({
	state,
	getters,
	actions: Object.assign({}, actions, actionsWebRTC),
	mutations,
})