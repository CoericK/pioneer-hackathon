
import YTPlayer from 'yt-player';


export const createPerson = (data) => {
    return Object.assign({
        name: '',
        color: '#CCCCCC',
        order: Date.now(),
        tracks: {
            video: null,
            audio: null,
        },
        angle: 0,
        pointer: null,
        x: 0,
        y: 0,
        emote: ""
    }, data);
}

export const createObject = (data) => {
    return Object.assign({
        image: '',
        x: 0,
        y: 0
    }, data);
}

export const angle = (p1, p2) => {
    var dy = p2.y - p1.y;
    var dx = p2.x - p1.x;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    //theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}

export const distance = (p1, p2) => {
    return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
}

/*export const isVideoInPlaylist = (video_id, playlist) => {
    return getVideoFromPlaylist(video_id, playlist) != undefined;
}*/

export const getVideoFromPlaylist = (video_id, playlist) => {
    let data;
    for(let i = 0; i < playlist.length; i++) {
        if(playlist[i].video_id == video_id) {
            data = playlist[i]
        }
    }

    return data;
}

export const initializePlayer = (element_id, video_id) => {
    const player = new YTPlayer(element_id, {
        width: '0',
        height: '0',
        playerVars: {
            autoplay: true,
        }
        
    });

    player.load(video_id, true);
    player.setPlaybackQuality('small');

    /*console.log(YT);
    let player = new YT.player(element_id, {
        height: '0',
        width: '0',
        videoId: video_id,
        playerVars: {
            autoplay: true,
        },
        events: {
            onReady() {
                player.setPlaybackQuality('small');
            },
            onStateChange(e) {
                if(e.data == YT.PlayerState.ENDED) {
                    if(events && 'ended' in events) {
                        events['ended']()
                    }
                }
            }
        }
    });*/

    return player;
}