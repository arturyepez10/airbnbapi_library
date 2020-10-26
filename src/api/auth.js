// ----------------------------- //
// ---------- PACKAGES --------- //
// ----------------------------- //

const axios = require('axios');

// ------------------------------ //
// ---------- API CALLS --------- //
// ------------------------------ //

function login(username, password) {
    const loginEndpoint = 'https://api.airbnb.com/v1/authorize';

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-airbnb-api-key': '915pw2pnf4h1aiguhph5gc5b2',
        'X-AIRBNB-RECAPTCHA-TOKEN': '03AERD8XocmgqMe8lpFXpr0XteZt7kCacADIiEceVFPByLYQ33QkBABjcVsIBXA9fRhRxed-TuHJo7pho7sleHinSvAYERNenGthyRMDDnrhtQjUQCfJqLPVEWCq5Y2eaCeQj2R8CqSQMc2YYN-AcKBQohhvAWNgwh8KChGXsHj687r-fyRjEP1mRpt2KPDjZm023KfxYkCTckeGACqfwaBDmOMRu62MBS-5zQqLvaenunEVqU51tvlctcl-33FPQEdphnCGzRRwJvc41aWOHIhM5t0h2mycMlaeq3YmiSJu62zOfaqN5h4nBikcaj86bbeanh74wimAokjyJBhJqxkmjTQcC4Ctt8x2G3GgFEq86AwgMCBzIJQURR-zVADmaCIbhL7VbggarhalzeEnB5VYtNAaL3Xj9A2Q',
    };

    return new Promise((resolve, reject) => {
        unirest.post(loginEndpoint)
            .headers(headers)
            .field("grant_type", "password")
            .field("username", username)
            .field("password", password)
            .end(function(response) {
                if (response.body.error_code) {
                   reject(response.body);
                }
                resolve(response.body.access_token);
            });
    });
};

function auth(token, hostId) {
    const endpoint = 'https://api.airbnb.com/v2/reservations/?'
        + 'host_id=' + hostId;

    const headers = {
        'Content-Type': 'application/json',
        'X-Airbnb-OAuth-Token': token,
        'X-Airbnb-API-Key': '915pw2pnf4h1aiguhph5gc5b2'
    }

    return new Promise((resolve, reject) => {
        unirest.get(endpoint)
            .headers(headers)
            .end(function(response) {
                if (response.body.error_code) {
                    reject(response.code);
                }
                resolve(response.code);
            })
    })
}

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
    auth: auth,
    auth_verification: auth_verification
}