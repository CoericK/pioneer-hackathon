import io from 'socket.io-client';

/** CONFIG **/
var SIGNALING_SERVER = "https://cozyroom-signaling.herokuapp.com/";

var ICE_SERVERS = [
	{url:"stun:stun.l.google.com:19302"}
];

var signaling_socket = null;   /* our socket.io connection to our webserver */
var peers = {};                /* keep track of our peer connections, indexed by peer_id (aka socket.io id) */

// Request audio track and send to peers
export const requestAudioTrack = ({ state, commit }) => {
	navigator.mediaDevices.getUserMedia({"audio": true, "video": true }).then(stream => {
		let track = stream.getAudioTracks()[0]

		for(let peerID in peers) {
			let peer = peers[peerID]

			peer.connection.addTrack(track)
		}

		commit('updateAudioTrack', track)
	})
}

// Request video track and send to peers
export const requestVideoTrack = ({ state, commit }) => {
	navigator.mediaDevices.getUserMedia({"audio": false, "video": true }).then(stream => {
		let track = stream.getVideoTracks()[0]

		for(let peerID in peers) {
			let peer = peers[peerID]

			peer.connection.addTrack(track)
		}

		commit('updateVideoTrack', track)
	})
}

// Connect to group with group ID
export const connectGroup = (context, options) => {
	signaling_socket = io(SIGNALING_SERVER);

	signaling_socket.on('connect', onConnectGroup.bind(null, context, options));
	signaling_socket.on('addPeer', onAddPeer.bind(null, context));
	signaling_socket.on('removePeer', onRemovePeer.bind(null, context));

	/**
	* The offerer will send a number of ICE Candidate blobs to the answerer so they 
	* can begin trying to find the best path to one another on the net.
	*/
	signaling_socket.on('iceCandidate', onIceCandidate.bind(null, context));

	/** 
	* Peers exchange session descriptions which contains information
	* about their audio / video settings and that sort of stuff. First
	* the 'offerer' sends a description to the 'answerer' (with type
	* "offer"), then the answerer sends one back (with type "answer").  
	*/
	signaling_socket.on('sessionDescription', onSessionDescription.bind(null, context));
	
}

function onConnectGroup({ dispatch, commit }, { groupID, name }) {
    console.log("Connected to signaling server");
    
    dispatch('requestAudioTrack');

    // this joins us to the group
    signaling_socket.emit('join', { 'channel': groupID });

    commit('setGroupID', groupID);
    dispatch('updateName', name);
}

function onAddPeer({ dispatch }, config) {
    dispatch('addPeer', config);
}

function onRemovePeer({ commit }, config) {
    console.log('Signaling server said to remove peer:', config);
    var peer_id = config.peer_id;

    //peers[peer_id] = undefined

    commit('removePeer', peer_id);
}

function onIceCandidate({ state }, config) {
    var peer = peers[config.peer_id].connection;
    var ice_candidate = config.ice_candidate;
    peer.addIceCandidate(new RTCIceCandidate(ice_candidate));
}

function onSessionDescription({ dispatch }, config) {
    dispatch('sessionDescription', config);
}

// Disconnect from group
export const disconnectGroup = ({ state, commit }, groupID) => {
	for(peer_id in peers) {
		peers[peer_id].connection.close();
	}
	signaling_socket.emit('part', { 'channel': groupID });
	signaling_socket = null;

	commit('setGroupID', null);
}

export const addPeer = ({ state, commit, dispatch }, config) => {
	console.log('Signaling server said to add peer:', config);
	var peer_id = config.peer_id;

	if (peer_id in peers) {
		/* This could happen if the user joins multiple channels where the other peer is also in. */
		console.log("Already connected to peer ", peer_id);
		return;
	}

	var peer_connection = new RTCPeerConnection(
		{"iceServers": ICE_SERVERS},

		/* this will no longer be needed by chrome
		* eventually (supposedly), but is necessary 
		* for now to get firefox to talk to chrome */
		{"optional": [{"DtlsSrtpKeyAgreement": true}]} 
	);

	// create data channel for non-media messages
	// the name is required but doesn't matter
	let dataChannel = peer_connection.createDataChannel('general');
	
	let peerData = {
		'connection': peer_connection,
		'data': dataChannel
	};
	commit('addPeer', {
		id: peer_id,
		data: peerData
    });

	peers[peer_id] = peerData;

	peer_connection.onicecandidate = function(event) {
		if (event.candidate) {
			signaling_socket.emit('relayICECandidate', {
				'peer_id': peer_id, 
				'ice_candidate': {
					'sdpMLineIndex': event.candidate.sdpMLineIndex,
					'candidate': event.candidate.candidate
				}
			});
		}
	}

	peer_connection.ontrack = function(event) {
		console.log(`Adding ${event.track.kind} track with label ${event.track.label}`);

		commit('addTrackToPeer', {
			peer_id: peer_id,
			track: event.track,
		});
	}
	
	/*peer_connection.onaddstream = function(event) {
		console.log("onAddStream", event);

		peers[peer_id].stream = event.stream
		/*var remote_media = USE_VIDEO ? $("<video>") : $("<audio>");
		remote_media.attr("autoplay", "autoplay");
		if (MUTE_AUDIO_BY_DEFAULT) {
			remote_media.attr("muted", "true");
		}
		remote_media.attr("controls", "");
		peer_media_elements[peer_id] = remote_media;
		$('body').append(remote_media);
		attachMediaStream(remote_media[0], event.stream);
	}*/

	/* Add our local stream */
	//peer_connection.addStream(local_media_stream);

    //console.log('SELF AUDIO', state.self.tracks.audio);
	if(state.self.tracks.audio != undefined) {
        console.log('SENDING AUDIO TRACK')
		peer_connection.addTrack(state.self.tracks.audio);
	}

	if(state.self.tracks.video != undefined) {
		peer_connection.addTrack(state.self.tracks.video);
	}

	peer_connection.ondatachannel = function(event) {
		var channel = event.channel;
		channel.onopen = function(event) {
            dispatch('initPeer', peer_id);
		}
		channel.onmessage = function(event) {
			let message = JSON.parse(event.data);

			dispatch('recieveMessage', { message, peer_id });

			//dispatch(message.type, message);
		}
	}

	/* Only one side of the peer connection should create the
	* offer, the signaling server picks one to be the offerer. 
	* The other user will get a 'sessionDescription' event and will
	* create an offer, then send back an answer 'sessionDescription' to us
	*/
	if (config.should_create_offer) {
		console.log("Creating RTC offer to ", peer_id);
		peer_connection.createOffer(
			function (local_description) { 
				console.log("Local offer description is: ", local_description);
				peer_connection.setLocalDescription(local_description,
					function() { 
						signaling_socket.emit('relaySessionDescription', 
							{'peer_id': peer_id, 'session_description': local_description});
						console.log("Offer setLocalDescription succeeded"); 
					},
					function() { Alert("Offer setLocalDescription failed!"); }
				);
			},
			function (error) {
				console.log("Error sending offer: ", error);
			});
	}
}


export const sessionDescription = ({ state }, config) => {
	console.log('Remote description received: ', config);
	var peer_id = config.peer_id;
	var peer = peers[peer_id].connection;
	var remote_description = config.session_description;
	console.log(config.session_description);

	var desc = new RTCSessionDescription(remote_description);
	var stuff = peer.setRemoteDescription(desc, 
		function() {
			console.log("setRemoteDescription succeeded");
			if (remote_description.type == "offer") {
				console.log("Creating answer");
				peer.createAnswer(
					function(local_description) {
						console.log("Answer description is: ", local_description);
						peer.setLocalDescription(local_description,
							function() { 
								signaling_socket.emit('relaySessionDescription', 
									{'peer_id': peer_id, 'session_description': local_description});
								console.log("Answer setLocalDescription succeeded");
							},
							function() { Alert("Answer setLocalDescription failed!"); }
						);
					},
					function(error) {
						console.log("Error creating answer: ", error);
						console.log(peer);
					});
			}
		},
		function(error) {
			console.log("setRemoteDescription error: ", error);
		}
	);
	console.log("Description Object: ", desc);
}