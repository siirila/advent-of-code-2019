let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');

let orbits = {};

function loadOrbit(data) {
    let [orbited, orbiting] = data.split(')');

    if (!orbits[orbited]) {
        orbits[orbited] = null;
    }

    orbits[orbiting] = orbited;
}

function getIndirectOrbits(orbits, orbiting, count = 0) {
    let orbited = orbits[orbiting];
    if (orbited === null) {
        return count;
    }

    return getIndirectOrbits(orbits, orbited, ++count);
}

function getDirectAndIndirectOrbitCount(orbits) {
    let directOrbits = 0;
    let indirectOrbits = 0;

    for (let orbiting in orbits) {
        let orbited = orbits[orbiting];
        if (orbited !== null) {
            directOrbits++;
            indirectOrbits += getIndirectOrbits(orbits, orbited);
        }
    }

    console.log(`The number of direct orbits is: ${directOrbits}`);
    console.log(`The number of indirect orbits is: ${indirectOrbits}`);
    console.log(`The total orbits are: ${directOrbits + indirectOrbits}`);
}

function getPathToOrigin(orbits, orbit, path = []) {
    if (orbits[orbit] === null) {
        return path;
    }

    return getPathToOrigin(orbits, orbits[orbit], path.concat([orbits[orbit]]));
}

function getShortestTranferBetweenOrbits(path1, path2) {
    let intersections = _.intersection(path1, path2);
    let shortestPath;

    for (let intersection of intersections) {
        let path = path1.indexOf(intersection) + path2.indexOf(intersection);

        if (!shortestPath || (path < shortestPath)) {
            shortestPath = path;
        }
    }

    return shortestPath;
}

// let stream = byline(fs.createReadStream('test-input.txt', { encoding: 'utf8' }));
let stream = byline(fs.createReadStream('input.txt', { encoding: 'utf8' }));

stream.on('data', loadOrbit);

stream.on('end', () => {
    // console.log(orbits);
    getDirectAndIndirectOrbitCount(orbits);
    let yourOrbitPath = getPathToOrigin(orbits, 'YOU');
    let santasOrbitPath = getPathToOrigin(orbits, 'SAN');

    console.log(getShortestTranferBetweenOrbits(yourOrbitPath, santasOrbitPath));
});
