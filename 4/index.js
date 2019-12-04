let fs = require('fs');
let byline = require('byline');

function doDigitsDecrease(number) {
    let digits = number.toString().split('');
    let neverDecrease = false;

    for (let digit = 0; digit < digits.length - 1; digit++) {
        if (digits[digit + 1]  < digits[digit]) {
            neverDecrease = true;
            break;
        }
    }

    return neverDecrease;
}

function hasAdjacentMatchingDigits(number) {
    let digits = number.toString().split('');
    let hasMatchingPair = false;

    for (let digit = 0; digit < digits.length - 1; digit++) {
        if (digits[digit + 1]  === digits[digit]) {
            hasMatchingPair = true;
            break;
        }
    }

    return hasMatchingPair;
}

function hasAdjacentMatchingDigitsWithNoExtraMatches(number) {
    let digits = number.toString().split('');
    let hasMatchingPair = false;

    for (let digit = 0; digit < digits.length - 1; digit++) {
        if ((digits[digit + 1]  === digits[digit]) && (digits[digit + 2] !== digits[digit + 1]) && (digits[digit - 1] !== digits[digit])) {
            hasMatchingPair = true;
        }
    }

    return hasMatchingPair;
}

function getMatchingNumbersInRange(start, stop) {
    let matchingNumbers = [];

    for (let number = start; number <= stop; number++) {
        if (hasAdjacentMatchingDigitsWithNoExtraMatches(number) && !doDigitsDecrease(number)) {
            matchingNumbers.push(number);
        }
    }

    return matchingNumbers;
}

console.log(getMatchingNumbersInRange(367479, 893698).length);
