
export const createPerson = (data) => {
    let out =  Object.assign({
        name: '',
        color: '#CCCCCC',
        tracks: {
            video: null,
            audio: null,
        },
        angle: 0,
        pointer: null,
        x: 0,
        y: 0,
    }, data);
    console.log('PERSON', out, data);
    return out
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