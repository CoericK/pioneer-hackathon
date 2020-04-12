
export const getSelf = state => {
	return state.self;
}

export const getPeers = state => {
	return state.peers;
}

export const isConnected = state => {
	return state.connected;
}

export const audioContext = state => {
    return state.audioContext;
}

export const getBoombox = state => {
	return state.boombox;
}

// get person who has been in room the longest
export const getVIP = state => {
	let people = Object.values(state.peers).concat(state.self);
	people.sort((a, b) => a.order - b.order);

	return people[0];
}