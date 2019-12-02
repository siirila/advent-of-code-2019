let fs = require('fs');
let byline = require('byline');


let masses = [];

function addMass(mass) {
    masses.push(mass);
}

function computeFuelForMass(mass) {
    let fuel = Math.floor(mass / 3) - 2;

    if (fuel <= 0) {
        return 0;
    }

    return fuel;
}

function computeFuelForFuel(mass) {
    let fuel = computeFuelForMass(mass);

    if (fuel === 0) {
        return 0;
    } else {
        return fuel + computeFuelForFuel(fuel);
    }
}

function computeTotalFuelRequired(masses) {
    let fuelForModules = masses.reduce((acc, mass) => {
        let fuelForModule = computeFuelForMass(mass);
        return acc + fuelForModule + computeFuelForFuel(fuelForModule);
    }, 0);

    return fuelForModules;
}


let stream = byline(fs.createReadStream('input.txt', { encoding: 'utf8' }));

stream.on('data', addMass);

stream.on('end', () => {
    console.log(computeTotalFuelRequired(masses));
});
