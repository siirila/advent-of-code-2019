let fs = require('fs');
let byline = require('byline');
let _ = require('lodash');


let wireMoves = [];
let wirePositions = [];

function getMoves(data) {
    let moves = data.split(',');
    wireMoves.push(moves);
}

function getAllLineSegmentsFromMoves(moves) {
    let verticalLineSegments = [];
    let horizontalLineSegments = [];
    let currentPosition = [0, 0];

    moves.forEach(move => {
        currentPosition = getLineSegmentsAndNextPosition(move, currentPosition, verticalLineSegments, horizontalLineSegments);
    });

    // console.log(verticalLineSegments);
    // console.log(horizontalLineSegments);
    return [horizontalLineSegments, verticalLineSegments];
}

function getLineSegmentsAndNextPosition(move, currentPosition, verticalLineSegments, horizontalLineSegments) {
    let direction = move[0];
    let distance = parseInt(move.slice(1), 10);
    let newPosition = currentPosition;
    let lineSegment = [];
    
    switch (direction) {
        case 'U':
            lineSegment = moveUp(distance, newPosition);
            verticalLineSegments.push(lineSegment);
            break;
        case 'D':
            lineSegment = moveDown(distance, newPosition);
            verticalLineSegments.push(lineSegment);
            break;
        case 'L':
            lineSegment = moveLeft(distance, newPosition);
            horizontalLineSegments.push(lineSegment);
            break;
        case 'R':
            lineSegment = moveRight(distance, newPosition);
            horizontalLineSegments.push(lineSegment);
            break;
        default:
            throw Error();
    }

    newPosition = lineSegment[1];
    return newPosition;
}

function moveUp(distance, startingPosition) {
    let newPosition = [startingPosition[0], startingPosition[1] + distance];
    let lineSegment = [startingPosition, newPosition];

    return lineSegment;
}

function moveDown(distance, startingPosition) {
    let newPosition = [startingPosition[0], startingPosition[1] - distance];
    let lineSegment = [startingPosition, newPosition];

    return lineSegment;
}

function moveLeft(distance, startingPosition) {
    let newPosition = [startingPosition[0] - distance, startingPosition[1]];
    let lineSegment = [startingPosition, newPosition];

    return lineSegment;
}

function moveRight(distance, startingPosition) {
    let newPosition = [startingPosition[0] + distance, startingPosition[1]];
    let lineSegment = [startingPosition, newPosition];

    return lineSegment;
}

function findIntersections([verticalSegments1, horizontalSegments1], [verticalSegments2, horizontalSegments2]) {
    let intersections = [];

    horizontalSegments1.forEach( horizSeg => {
        let yRange = [horizSeg[0][1], horizSeg[1][1]].sort((a, b) => a - b);
        let x = horizSeg[0][0];
        console.log(horizSeg);
        console.log(`Checking for intersections between: ${yRange[0]} and ${yRange[1]}`);
        verticalSegments2.forEach(vertSeg => {
            let xRange = [vertSeg[0][0], vertSeg[1][0]].sort((a, b) => a - b);
            let y = vertSeg[0][1];
            if ((yRange[0] <= y) && (y <= yRange[1]) && (xRange[0] <= x ) && (x <= xRange[1])) {
                console.log(`We have an intersection at: ${x}, ${y}`);
                intersections.push([x, y]);
            }
        });
    });
    
    verticalSegments1.forEach( vertSeg => {
        let xRange = [vertSeg[0][0], vertSeg[1][0]].sort((a, b) => a - b);
        let y = vertSeg[0][1];
        horizontalSegments2.forEach(horizSeg => {
            let yRange = [horizSeg[0][1], horizSeg[1][1]].sort((a, b) => a - b);
            let x = horizSeg[0][0];
            if ((yRange[0] <= y) && (y <= yRange[1]) && (xRange[0] <= x ) && (x <= xRange[1])) {
                console.log(`We have an intersection at: ${x}, ${y}`);
                intersections.push([x, y]);
            }
        });
    });

    return intersections;
}

function getDistancesFromCentralPortToIntersections(intersections) {
    let distances = [];

    intersections.forEach(intersection => distances.push(getDistance([0, 0], intersection)));

    return distances.sort((a, b) => a - b);
}

function getDistance(point1, point2) {
    let distance = 0;

    distance += Math.abs(point1[0] + point2[0]);
    distance += Math.abs(point1[1] + point2[1]);

    return distance;
}

let stream = byline(fs.createReadStream('input.txt', { encoding: 'utf8' }));

stream.on('data', getMoves);

stream.on('end', () => {
    // console.log(wireMoves);
    wirePositions[0] = getAllLineSegmentsFromMoves(wireMoves[0]);
    wirePositions[1] = getAllLineSegmentsFromMoves(wireMoves[1]);
    console.log(wirePositions[0]);
    let intersections = findIntersections(wirePositions[0], wirePositions[1]);
    console.log(`Intersecting points:`);
    console.log(intersections);
    console.log(getDistancesFromCentralPortToIntersections(intersections));
});
