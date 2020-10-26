// ----------------------------- //
// ---------- PACKAGES --------- //
// ----------------------------- //

const axios = require('axios');
const moment = require("moment");

// ------------------------------ //
// ---------- API CALLS --------- //
// ------------------------------ //

/** Gets a list of the availability details in a certain listing between dates.
 * 
 * @param {String} token 
 *      It's the OAuth token.
 * @param {String} id 
 *      Code provided by AirBnB that identifies a property.
 * @param {(Moment | String)} startDate
 *      Start date of the period to consult.
 * @param {(Moment | String)} endDate 
 *      Ending date of the period to consult.
 * 
 * @returns {Object[]} Array with JSON per position with details of the day (free or not, reservation, etc).
 */
function calendar(token, id, startDate = moment().format("YYYY-MM-DD"), endDate) {
    const endpoint = 'https://api.airbnb.com/v2/batch/?locale=en-US&currency=USD';

    const headers = {
        'Content-Type': 'application/json',
        'X-Airbnb-OAuth-Token': token,
        'X-Airbnb-API-Key': '915pw2pnf4h1aiguhph5gc5b2'
    }

    const body = {
        "operations": [{
            "method": "GET",
            "path": "/calendar_days",
            "query": {
                "start_date": startDate,
                "listing_id": id,
                "_format": "host_calendar_detailed",
                "end_date": endDate
            }
        }],
        "_transaction": false
    }

    return axios({
        method: 'post',
        url: endpoint,
        headers: headers,
        data: body
    }).then(function(response) {
        return Promise.resolve(response.data.operations[0].response.calendar_days);
    }).catch(function(error) {
        return Promise.reject(error);
    })
}

/** Gets a list of reservations between an specified period of times.
 * 
 * @param {String} token 
 *      It's the OAuth token.
 * @param {String} listingId 
 *      Code provided by AirBnB that identifies a property.
 * @param {(Moment | String)} startDate
 *      Start date of the period to consult.
 * @param {(Moment | String)} endDate 
 *      Ending date of the period to consult.
 * 
 * @returns {Object[]
 */
function reservationsFilteredByCalendar(token, listingId, startDate, endDate) {
    logger.log('debug', 'called with ' + listingId);
    logger.log('debug', 'from date: ' + startDate.format('YYYY-MM-DD'));
    logger.log('debug', 'to date: ' + endDate.format('YYYY-MM-DD'));

    return new Promise(function(resolve, reject) {
        calendar(token, listingId, startDate, endDate).then(function(calendar) {

            const reservedDays = calendar.filter(function(day){
                return day.reservation !== null;
            });

            var reservations = [];

            reservedDays
                .filter(day => day.reservation.start_date >= startDate.format('YYYY-MM-DD'))
                .forEach(function(day){
                    reservations[day.reservation.confirmation_code] = day.reservation;
                });

            resolve(reservations);

        }).catch(function(error){
           reject(error);
        });
    });
}

/** Gets a list of reservations with minor details from the day of the call onward. The quantity of items is determined by a limit
 * set by the user
 * 
 * @param {String} token
 *      It's the OAuth token.
 * @param {Integer} limit 
 *      The limit of items to be obtained.
 * 
 * @returns {Object[]} Array with JSON per position with reservations minimal info (confirmation_code, dates, listing info, guests details, etc).
 */
function reservationsList(token, limit) {
    const endpoint = 'https://api.airbnb.com/v2/reservations?'
    + '_format=for_remy' + `&_limit=${limit}` + '&_offset=0'
    + '&collection_strategy=for_reservations_list' + '&currency=USD' 
    + `&date_min=${moment().format("YYYY-MM-DD")}` + '&sort_field=start_date' + '&sort_order=asc' + '&status=accepted%2Crequest'

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
        return Promise.resolve(response.data.reservations);
    }).catch( function(error) {
        return Promise.reject(error);
    })
}

/** Gets the full information of an specific reservation by a confirmation_code of it.
 * 
 * @param {String} token
 *      It's the OAuth token.
 * @param {String} confirmationCode
 *      Code provided by AirBnB that identifies a reservation.
 * 
 * @returns {Object} JSON object with all the details regarding a reservation.
 */
function reservationDetails(token, confirmationCode) {
    const endpoint = `https://api.airbnb.com/v2/homes_booking_details/${confirmationCode}?`
    + 'currency=USD'
    + '&_format=for_remy';

    const headers = {
        'Content-Type': 'application/json',
        'X-Airbnb-OAuth-Token': token,
        'X-Airbnb-API-Key': '915pw2pnf4h1aiguhph5gc5b2'
    }

    return axios({
        method: 'get',
        url: endpoint,
        headers: headers,
    }).then( function(response) {
        return Promise.resolve(response.data.homes_booking_detail.reservation);
    }).catch( function(error) {
        return Promise.reject(error);
    })
}

// -------------------------------------- //
// ---------- EXPORTING MODULES --------- //
// -------------------------------------- //

module.exports = {
    calendar: calendar,
    reservationsList: reservationsList,
    reservationDetails: reservationDetails
}