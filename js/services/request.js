const request = require('request');

function requestCallback(resolve, reject) {
    return (error, response, body) => {
        if (error) {
            reject('error occurs ', error);
        } else if (body.status === 'ZERO_RESULTS') {
            reject('ZERO_RESULTS ');
        } else if (body) {
            resolve(body);
        } else {
            reject(`error ${error}`);
        }
    };
}

function defaultPromiseThen(res) {
    return {success: (success) => {
        res.send(success);
      }, err: (error) => {
        res.status(400);
        res.send(error);
      }};
}

function getRequestInsta(query) {
    return new Promise((resolve, reject) => {
        request({
            url: `https://api.ninja-miners.com/instagram?query=${encodeURIComponent(query)}`,
            json: true
        }, requestCallback(resolve, reject));
    });
}

function loadMore(currentUserId, endCursor) {
    return new Promise((resolve, reject) => {
        request({
            url: `https://api.ninja-miners.com/instagram/profile-photos?profile_id=${currentUserId}&cursor=${endCursor}`,
            json: true
        }, requestCallback(resolve, reject));
    });
}

function getProfileVideo(videoCode) {
    return new Promise((resolve, reject) => {
        request({
            url: `https://api.ninja-miners.com/instagram/${videoCode}`,
            json: true
        }, requestCallback(resolve, reject));
    });
}

module.exports = {
    getRequestInsta,
    loadMore,
    defaultPromiseThen,
    getProfileVideo
};