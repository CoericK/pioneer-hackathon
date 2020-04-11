import Vue from 'vue'

import { createPerson } from '../utils'

export default {
	// Update self audio track
	updateAudioTrack(state, track) {
		Vue.set(state.self.tracks, 'audio', track)
	},

	// Update self video track
	updateVideoTrack(state, track) {
		Vue.set(state.self.tracks, 'audio', track)
	},

	// Update or disconnect group ID
	setGroupID(state, groupID) {
		if(groupID != undefined) {
			Vue.set(state, 'groupID', groupID);
			Vue.set(state, 'connected', true);
		} else {
			Vue.set(state, 'groupID', '');
			Vue.set(state, 'connected', false);
		}
	},

	addPeer(state, peer) {
		console.log('ADDPEER', peer.id, peer.data);
		let person = createPerson(peer.data);
		console.log(peer.id, person);
		Vue.set(state.peers, peer.id, person);
	},

	removePeer(state, peer_id) {
		if (peer_id in state.peers) {
			peers[peer_id].connection.close();
			Vue.delete(state.peers, peer_id);
		}
	},

	addTrackToPeer(state, {peer_id, track}) {
		Vue.set(state.peers[peer_id].tracks, track.kind, track);
	},

	setPosition(state, {point, peer_id}) {
		if(peer_id) {
			// update position of peer
			Vue.set(state.peers[peer_id], 'x', point.x);
			Vue.set(state.peers[peer_id], 'y', point.y);
		} else {
			// update position of self
			Vue.set(state.self, 'x', point.x);
			Vue.set(state.self, 'y', point.y);
		}
    },
    
    setDirection(state, {angle, peer_id}) {
        if(peer_id) {
            // update direction of peer
            Vue.set(state.peers[peer_id], 'angle', angle);
        } else {
            // update direction of self
            Vue.set(state.self, 'angle', angle);
        }
    },

    setPointer(state, {pointer, peer_id}) {
        if(peer_id) {
            // update pointer of peer
            Vue.set(state.peers[peer_id], 'pointer', pointer);
        } else {
            // update pointer of self
            Vue.set(state.self, 'pointer', pointer);
        }
    }
}