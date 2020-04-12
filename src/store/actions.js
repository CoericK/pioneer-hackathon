
// Called WebRTC recieves a message from peer
// Not a great idea but simply dispatches message along
export const recieveMessage = ({ dispatch }, { message, peer_id }) => {
	dispatch(message.type, { message, peer_id });
}

export const sendMessage = ({ state }, { message, peer_id }) => {
	if(peer_id) {
		state.peers[peer_id].data.send(JSON.stringify(message));
	} else {
		for(let peer_id in state.peers) {
			state.peers[peer_id].data.send(JSON.stringify(message));
		}
	}
}


export const initPeer = ({ state, dispatch }, peer_id) => {
	dispatch('sendMessage', { message: { type: 'recieveName', name: state.self.name }, peer_id });
	dispatch('sendMessage', { message: { type: 'recieveColor', color: state.self.color }, peer_id });
	dispatch('sendMessage', { message: { type: 'recievePosition', x: state.self.x, y: state.self.y }, peer_id });
	dispatch('sendMessage', { message: { type: 'recieveDirection', angle: state.self.angle }, peer_id });

	dispatch('sendMessage', { message: { type: 'recieveOrder', order: state.self.order }, peer_id });
}


export const updateName = ({ commit, dispatch }, name) => {
	dispatch('sendMessage', { message: { type: 'recieveName', name }});

	commit('setName', { name });
}

export const recieveName = ({ commit }, { message, peer_id }) => {
	commit('setName', { name: message.name, peer_id });
}

export const updatePosition = ({ commit, dispatch }, point) => {
	dispatch('sendMessage', { message: { type: 'recievePosition', ...point } } );

	commit('setPosition', {point});
}

export const recievePosition = ({ commit }, { message, peer_id }) => {
	commit('setPosition', {point: message, peer_id});
}



export const updateDirection = ({ commit, dispatch }, angle) => {
	dispatch('sendMessage', { message: { type: 'recieveDirection', angle }});
	commit('setDirection', {angle});
}

export const recieveDirection = ({ commit }, { message, peer_id }) => {
	commit('setDirection', {angle: message.angle, peer_id});
}



export const updatePointer = ({ commit, dispatch }, pointer) => {
	dispatch('sendMessage', { message: { type: 'recievePointer', pointer }});
	commit('setPointer', { pointer });
}

export const recievePointer = ({ commit }, {message, peer_id }) => {
	commit('setPointer', { pointer: message.pointer, peer_id });
}


export const updateColor = ({ commit, dispatch }, color) => {
	dispatch('sendMessage', { message: { type: 'recieveColor', color }});
	commit('setColor', { color });
}

export const recieveColor = ({ commit }, { message, peer_id }) => {
	commit('setColor', { color: message.color, peer_id });
}


export const updateOrder = ({ commit, dispatch }, order) => {
	dispatch('sendMessage', { message: { type: 'recieveOrder', order }});
	commit('setOrder', { order });
}
export const recieveOrder = ({ state, commit }, { message, peer_id }) => {
	commit('setOrder', { order: message.order, peer_id });
}