
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