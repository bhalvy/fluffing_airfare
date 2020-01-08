'use strict';
const Amadeus = require('amadeus');
const { formatISO, addDays } = require('date-fns');
const config = require('../public/configuration');

class FlightSearch extends Amadeus{
    constructor() {
        super({
            clientId: config.amadeus.clientId,
            clientSecret: config.amadeus.clientSecret,
        })
    }

    async getFlightInfo(origin, destination, dates) {
        let flights;
        const { start, end } = dates;

        try {
            flights = await this.shopping.flightOffers.get({
                origin: origin,
                destination: destination,
                departureDate: start,
                returnDate : end,
            });
        } catch (error) {
            console.log(error);
            throw error;
        }

        return flights.result.data;
    }
}

module.exports = new FlightSearch();