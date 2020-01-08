'use strict';
const _ = require('lodash');
const CronJob = require('cron').CronJob;
const config = require('../../public/configuration');

const PotentialTrip = require('../PotentialTrip');

class QueueService extends EventEmitter {
    constructor() {
        super();
        this.queue = [];
        this.polling = [];
        this.results = [];

        this.currentlyProcessing = 0;
        this.createOutput = false;

        this.registerPotentialTrips();
    }

    async registerPotentialTrips() {
        const origin = config.from;
        const destination = config.to;

        const potentialDates = await PotentialTrip.getPotentialDates()
        console.log(` ---- There are ${potentialDates.length} Potential Date Combinations ---- `);

        _.forEach(origin, (org) => {
            _.forEach(destination, (des) => {
                _.forEach(potentialDates, (dates) => {
                        const trip = { origin: org, destination: des, dates };
                        console.log("Create Potential Trip", trip);
                        return this.queue.push(trip);
                })
            })
        })
    }

    initQueue() {
        console.log('Starting Queue');
        const poll = new CronJob("* * * * * *", async() => {
            this.processQueue()
        }, null, true, 'America/Los_Angeles');
        return this.polling.push(poll)
    }

    async processQueue() {
        if(this.queue.length > 0 & this.currentlyProcessing <= 1) {
            this.currentlyProcessing = this.currentlyProcessing + 1;
            console.log(`Current Queue Length ${this.queue.length}, Current Processing: ${this.currentlyProcessing}`);

            const task = _.head(this.queue);
            const results = await PotentialTrip.findFares(task.origin, task.destination, task.dates);

            this.results = this.results.concat(results);

            this.queue = _.drop(this.queue);
            this.createOutput = true;
            this.currentlyProcessing = this.currentlyProcessing - 1;

        } else if (!!this.createOutput && this.queue.length === 0) {
            console.log("Processing at the end of Queue");
            this.createOutput = false;
            await PotentialTrip.printTopFlights(this.results);

        }
    }
}

module.exports = QueueService;

