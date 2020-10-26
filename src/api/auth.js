// ----------------------------- //
// ---------- PACKAGES --------- //
// ----------------------------- //

const axios = require('axios');

// ------------------------------ //
// ---------- API CALLS --------- //
// ------------------------------ //

/** Logs the user into the system and returns the JSON Web Token.
 * 
 * @param {String} username 
 *      The email of the user
 * @param {String} password
 *      The password the user uses for its profile.
 * 
 * @returns {String} JSON Web Token.
 */
function login(username, password) {
    const endpoint = 'https://api.airbnb.com/v1/authorize';

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-airbnb-api-key': '915pw2pnf4h1aiguhph5gc5b2',
        'X-AIRBNB-RECAPTCHA-TOKEN': '03AERD8XocmgqMe8lpFXpr0XteZt7kCacADIiEceVFPByLYQ33QkBABjcVsIBXA9fRhRxed-TuHJo7pho7sleHinSvAYERNenGthyRMDDnrhtQjUQCfJqLPVEWCq5Y2eaCeQj2R8CqSQMc2YYN-AcKBQohhvAWNgwh8KChGXsHj687r-fyRjEP1mRpt2KPDjZm023KfxYkCTckeGACqfwaBDmOMRu62MBS-5zQqLvaenunEVqU51tvlctcl-33FPQEdphnCGzRRwJvc41aWOHIhM5t0h2mycMlaeq3YmiSJu62zOfaqN5h4nBikcaj86bbeanh74wimAokjyJBhJqxkmjTQcC4Ctt8x2G3GgFEq86AwgMCBzIJQURR-zVADmaCIbhL7VbggarhalzeEnB5VYtNAaL3Xj9A2Q',
    };

    const body = {
        "grant_type": "password",
        "username": username,
        "password": password
    }

    return axios({
        method: 'post',
        url: endpoint,
        headers: headers,
        data: body
    }).then( function(response) {
        return Promise.resolve(response.data)
    }).catch( function(error) {
        return Promise.reject(error)
    });
};

/** Gives the code of the response to AirBnB servers 
 * 
 * @param {String} token 
 *      JSON Web Token of the user.
 * @param {String} hostId
 *      ID of the user in AirBnB.
 * 
 * @returns {number} Code of the response.
 */
function auth(token, hostId) {
    const endpoint = 'https://api.airbnb.com/v2/reservations/?'
        + 'host_id=' + hostId;

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
        return Promise.resolve(response.status)
    }).catch( function(error) {
        return Promise.reject(error.response.status)
    });
}

/** Tells if the token is still usable for requests.
 * 
 * @param {String} token 
 *      JSON Web Token of the user.
 * @param {String} hostId
 *      ID of the user in AirBnB.
 * 
 * @returns {Boolean}
 */
async function auth_verification(token, hostId) {
    let status_response = await auth(token, hostId);
    
    if (status_response == 200) {
        return true;
    } else if (status_response == 401) {
        return false;
    } else {
        console.log("There was a problem with the verification, please try again.");
    }
}

// -------------------------------------- //
// ---------- EXPORTING MODULES --------- //
// -------------------------------------- //

module.exports = {
    login: login,
    auth_verification: auth_verification
}