'use strict';

const _ = require('lodash');
const uuid = require('uuid/v4');
const arraySort = require('array-sort');
const { addDays, format, parseISO } = require('date-fns');

const FlightSearch = require('./FlightSearch');
const configuration = require('../public/configuration');
const dateAlgorithm = require('./dateAlgorithm');

class PotentialTrip {
    constructor() {

    }

    async getPotentialDates() {
        const { dates } = configuration;
        return dateAlgorithm(dates);
    }

    async findFares(origin, destination, dates) {
        const tripId = uuid();
        console.log(`${tripId} -- Searching from ${origin} to ${destination}`)
        return FlightSearch.getFlightInfo(origin, destination, dates);
    }

    async printTopFlights(flights) {
            console.log("------ Cheapest Flights ------")
            const sorted = _.take(arraySort(flights, (a,b) => {
                return a.offerItems[0].price.total - b.offerItems[0].price.total;
            }), 20)

            await Promise.all(_.map(sorted, async (flight) => {
                const from = _.get(flight, 'offerItems[0].services[0].segments[0].flightSegment.departure.iataCode');
                const departDate = format(parseISO(_.get(flight, 'offerItems[0].services[0].segments[0].flightSegment.departure.at')), 'PP');
                const to = _.get(flight, 'offerItems[0].services[0].segments[1].flightSegment.arrival.iataCode');
                const returnDate = format(parseISO(_.get(flight, 'offerItems[0].services[1].segments[1].flightSegment.arrival.at')), 'PP');
                const price = _.get(flight, 'offerItems[0].price.total');
                console.log(`${departDate} -> ${returnDate} // ${from} -> ${to} // ${price}`)
                Promise.resolve();
            })).catch(error => console.log(error))
    }
}

module.exports = new PotentialTrip();