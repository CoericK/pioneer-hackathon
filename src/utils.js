
export const createPerson = (data) => {
    let out =  Object.assign({
        tracks: {
            video: null,
            audio: null,
        },
        x: 0,
        y: 0,
    }, data);
    console.log('PERSON', out, data);
    return out
}