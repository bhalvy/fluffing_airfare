'use strict';

const _ = require('lodash');
const QueueService = require('./QueueService');
const configuration = require('../../public/configuration');

class TaskManager extends QueueService {
    constructor() {
        super();

    }

    async start() {
        console.log("------------------ JOEYS FLUFFING AIRFARE FINDER -----------------------");
        super.initQueue();
    }
}

module.exports = TaskManager;