let fs = require('fs');
let byline = require('byline');


let originalMemory = [];

function split(data) {
    originalMemory = data.split(',').map(string => parseInt(string, 10));
}

function initializeNounAndVerb(memory, noun, verb) {
    memory[1] = noun;
    memory[2] = verb;
}

function initializeGravityAssistProgram(memory) {
    initializeNounAndVerb(memory, 12, 2);
}

function compute(memory, instructionPointer = 0) {
    let instruction = memory[instructionPointer];

    if (instruction === 1) {
        let parameter1 = memory[memory[instructionPointer+1]];
        let parameter2 = memory[memory[instructionPointer+2]];
        memory[memory[instructionPointer+3]] = parameter1 + parameter2;
        return compute(memory, instructionPointer + 4);
    } else if (instruction === 2) {
        let parameter1 = memory[memory[instructionPointer+1]];
        let parameter2 = memory[memory[instructionPointer+2]];
        memory[memory[instructionPointer+3]] = parameter1 * parameter2;
        return compute(memory, instructionPointer + 4);
    } else if (instruction === 99) {
        return memory[0];
    }

    throw Error();
}

function findInputThatCreatesExpectedOutput(originalMemory, expectedResult) {
    for (let noun = 0; noun < 100; noun++) {
        for (let verb = 0; verb < 100; verb++) {
            let memory = originalMemory.slice();
            initializeNounAndVerb(memory, noun, verb);
            let result = compute(memory);
            if (result === expectedResult) {
                console.log(`The noun and verb that produce the expected output are: ${memory[1]}, ${memory[2]}`);
                console.log(`100 * noun + verb: ${100 * memory[1] + memory[2]}`);
                return null;
            }
        }
    }
}

let stream = byline(fs.createReadStream('input.txt', { encoding: 'utf8' }));

stream.on('data', split);

stream.on('end', () => {
    // console.log(values);
    findInputThatCreatesExpectedOutput(originalMemory, 19690720);
    // initializeGravityAssistProgram(originalMemory);
    // compute(originalMemory);
    // console.log(originalMemory);
    // console.log(originalMemory[0]);
});
