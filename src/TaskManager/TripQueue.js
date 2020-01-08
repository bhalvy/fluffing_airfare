'use strict';

class TripQueue {
    constructor() {
        this.queue = []
    }

    add(trip) {
        this.queue.push(trip)
        console.log(this.queue);
    }
}

module.exports = TripQueue;