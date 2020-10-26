// ----------------------------- //
// ---------- PACKAGES --------- //
// ----------------------------- //

const axios = require('axios');

// ------------------------------ //
// ---------- API CALLS --------- //
// ------------------------------ //

/** Gets a list of Listing that are handle by an specified user.
 * 
 * @param {String} userId 
 *      The id of the user we want to know their properties.
 * 
 * @returns {Object[]} Array with JSON per position with details of the properties (address, description, pictures, users in charge, etc).
 */
function getListing(userId) {
    const endpoint = 'https://api.airbnb.com/v2/listings/?client_id=3092nxybyb0otqw18e8nh5nty'
        + '&user_id=' + userId;

    return axios({
        method: 'get',
        url: endpoint
    }).then( function(response) {
        return Promise.resolve(response.data.listings);
    }).catch( function(error) {
        return Promise.reject(error);
    })
};

/** Gets a list of the threads open/available to message.
 * 
 * @param {String} token 
 *      It's the OAuth token.
 * @param {Integer} limit 
 *      The maximum quantity of threads to return
 * 
 * @returns {Object[]} Array with JSON per position with the threads_id.
 */
function getThreads(token, limit) {
    const endpoint = 'https://api.airbnb.com/v2/threads?'
        + '_limit=' + limit;

    const headers = {
        'Content-Type': 'application/json',
        'x-airbnb-api-key': '915pw2pnf4h1aiguhph5gc5b2',
        'X-Airbnb-OAuth-Token': token
    };

    return axios({
        method: 'get',
        url: endpoint,
        headers: headers,
    }).then( function(response) {
        return Promise.resolve(response.data.threads);
    }).catch( function(error) {
        return Promise.reject(error);
    })
}

/** Gets all the information of an specific thread.
 * 
 * @param {String} token 
 *      It's the OAuth token.
 * @param {String} threadId
 *      Code provided by AirBnB that identifies a thread.
 * 
 * @returns {Object} JSON object with all the details regarding a thread.
 */
function getFullThreadInfo(token, threadId) {
    const endpoint = `https://api.airbnb.com/v1/threads/${threadId}`;

    const headers = {
        'Content-Type': 'application/json',
        'X-Airbnb-OAuth-Token': token,
        'X-Airbnb-API-Key': '915pw2pnf4h1aiguhph5gc5b2'
    }

    return axios({
        method: 'get',
        url: endpoint,
        headers: headers
    }).then( function(response) {
        return Promise.resolve(response.data.thread);
    }).catch( function(error) {
        return Promise.reject(error);
    })
}

/** Send a message to an specific thread
 * 
 * @param {String} token 
 *      It's the OAuth token.
 * @param {String} threadId
 *      Code provided by AirBnB that identifies a thread. 
 * @param {String} message
 *      Message to be sent.
 * 
 * @returns {String} The message sent by the user.
 */
function sendMessage(token,threadId, message) {
    const endpoint = 'https://api.airbnb.com/v2/messages';

    const headers = {
        'Content-Type': 'application/json',
        'X-Airbnb-OAuth-Token': token,
        'X-Airbnb-API-Key': '915pw2pnf4h1aiguhph5gc5b2'
    }
    
    const body = {
	    "message": message,
	    "thread_id": threadId
    }

    return axios({
        method: 'post',
        url: endpoint,
        headers: headers,
        data: body
    }).then( function(response) {
        return Promise.resolve(response.data.message);
    }).catch( function(error) {
        return Promise.reject(error);
    })
}

// -------------------------------------- //
// ---------- EXPORTING MODULES --------- //
// -------------------------------------- //

module.exports = {
    getListing: getListing,
    getThreads: getThreads,
    getFullThreadInfo: getFullThreadInfo,
    sendMessage: sendMessage
}