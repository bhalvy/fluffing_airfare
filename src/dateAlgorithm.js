'use strict';
const _ = require('lodash');
const uuid = require('uuid/v4');
const { addDays, subDays, differenceInDays, parseISO, formatISO } = require('date-fns');

const getRangesForStartDate = async (currentDate, end, min, max) => {
    const dates = [];
    let i = 1;
    let tripEnd = addDays(currentDate, min);

    do {
        dates.push({
            start: formatISO(currentDate, { representation: 'date' }),
            end: formatISO(tripEnd, { representation: 'date' }),
            length: differenceInDays(tripEnd, currentDate)
        })
        tripEnd = addDays(currentDate, min + i);
        i++

    } while (differenceInDays(tripEnd, currentDate) < max + 1);

    return dates;
}

module.exports = async (dates) => {
    let allPossibleDates = [];
    await Promise.all(_.map(dates, async (date) => {
        const { start, end, minLength, maxLength } = date;
        let currentDate = parseISO(start);

        const lastPossibleDepartureDate = subDays(parseISO(end), minLength);

        do {
            const ranges = await getRangesForStartDate(currentDate, end, minLength, maxLength);
            allPossibleDates.push(...ranges);
            currentDate = addDays(currentDate, 1);
           } while (currentDate < lastPossibleDepartureDate)
    }));

    return allPossibleDates

}