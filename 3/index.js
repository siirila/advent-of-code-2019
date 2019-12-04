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
    let lineSegments = [];
    let lineSegment;
    let currentPosition = [0, 0];
    let stepCount = 0;

    moves.forEach(move => {
        [lineSegment, currentPosition, stepCount] = getLineSegmentsAndNextPosition(move, currentPosition, stepCount);
        lineSegments.push(lineSegment);
    });
    console.log(lineSegments);
    return lineSegments;
}

function getLineSegmentsAndNextPosition(move, currentPosition, stepCount) {
    let direction = move[0];
    let distance = parseInt(move.slice(1), 10);
    let newPosition = currentPosition;
    let newStepCount = stepCount + distance;
    let lineSegment = [];
    
    switch (direction) {
        case 'U':
            lineSegment = moveUp(distance, newPosition);
            lineSegment.push('v');
            break;
        case 'D':
            lineSegment = moveDown(distance, newPosition);
            lineSegment.push('v');
            break;
        case 'L':
            lineSegment = moveLeft(distance, newPosition);
            lineSegment.push('h');
            break;
        case 'R':
            lineSegment = moveRight(distance, newPosition);
            lineSegment.push('h');
            break;
        default:
            throw Error();
    }
    lineSegment.push(stepCount);
    console.log(lineSegment);

    newPosition = lineSegment[1];
    return [lineSegment, newPosition, newStepCount];
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

function findIntersections(lineSegments1, lineSegments2) {
    let intersections = [];
    let horizontalSegments1 = lineSegments1.filter(segment => segment[2] === 'h');
    let verticalSegments1 = lineSegments1.filter(segment => segment[2] === 'v');
    let horizontalSegments2 = lineSegments2.filter(segment => segment[2] === 'h');
    let verticalSegments2 = lineSegments2.filter(segment => segment[2] === 'v');

    horizontalSegments1.forEach( horizSeg => {
        let xRange = [horizSeg[0][0], horizSeg[1][0]].sort((a, b) => a - b);
        let y = horizSeg[0][1];
        verticalSegments2.forEach(vertSeg => {
            let yRange = [vertSeg[0][1], vertSeg[1][1]].sort((a, b) => a - b);
            let x = vertSeg[0][0];
            if ((yRange[0] <= y) && (y <= yRange[1]) && (xRange[0] <= x ) && (x <= xRange[1])) {
                console.log(`We have an intersection at: ${x}, ${y}`);
                let xStepsToIntersection = horizSeg[3] + (Math.abs(x - horizSeg[0][0]));
                let yStepsToIntersection = vertSeg[3] + (Math.abs(y - vertSeg[0][1]));
                console.log(`The distance to this intersection was 1: ${xStepsToIntersection}, 2: ${yStepsToIntersection}`);
                intersections.push([x, y, xStepsToIntersection + yStepsToIntersection]);
            }
        });
    });
    
    verticalSegments1.forEach( vertSeg => {
        let yRange = [vertSeg[0][1], vertSeg[1][1]].sort((a, b) => a - b);
        let x = vertSeg[0][0];
        horizontalSegments2.forEach(horizSeg => {
            let xRange = [horizSeg[0][0], horizSeg[1][0]].sort((a, b) => a - b);
            let y = horizSeg[0][1];
            if ((yRange[0] <= y) && (y <= yRange[1]) && (xRange[0] <= x ) && (x <= xRange[1])) {
                console.log(`We have an intersection at: ${x}, ${y}`);
                let xStepsToIntersection = horizSeg[3] + (Math.abs(x - horizSeg[0][0]));
                let yStepsToIntersection = vertSeg[3] + (Math.abs(y - vertSeg[0][1]));
                console.log(`The distance to this intersection was 1: ${xStepsToIntersection}, 2: ${yStepsToIntersection}`);
                intersections.push([x, y, xStepsToIntersection + yStepsToIntersection]);
            }
        });
    });

    return intersections;
}

function getDistancesFromCentralPortToIntersections(intersections) {
    let distances = [];

    intersections.forEach(intersection => distances.push(intersection[2]));

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
