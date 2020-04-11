import Vue from "vue";
import Vuex from "vuex";

import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

import * as actionsWebRTC from './actions-webrtc'

import { createPerson } from '@/utils.js'

Vue.use(Vuex)

const state = {
	connected: false,
	groupID: '',

	self: createPerson(),

	peers: {}
}

export default new Vuex.Store({
	state,
	getters,
	actions: Object.assign({}, actions, actionsWebRTC),
	mutations,
})