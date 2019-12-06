let fs = require('fs');
let byline = require('byline');


let programMemory = [];

function loadMemory(data) {
    programMemory = data.split(',').map(string => parseInt(string, 10));
}

function getParameters(memory, pointer, numberOfParameters, parameterModes, parameters = []) {
    if (parameters.length === numberOfParameters) {
        return parameters;
    }

    let mode = parameterModes % 10;
    let parameter = getParameter(memory, pointer, mode);
    return getParameters(memory, pointer + 1, numberOfParameters, Math.floor(parameterModes / 10), parameters.concat([parameter]));
}

function getParameter(memory, pointer, mode = 0) {
    if (mode === 1) {
        // console.log(`Getting immediate mode value at ${pointer}: ${memory[pointer]}`)
        return memory[pointer];
    }
    // console.log(`Getting position mode value at ${pointer}: ${memory[memory[pointer]]}`)

    return memory[memory[pointer]];
}

function runProgram(memory, instructionPointer = 0, input = 1) {
    let instruction = memory[instructionPointer];
    let opcode = instruction % 100;
    let parameterModes = Math.floor(instruction / 100);

    if (opcode === 1) {
        let parameters = getParameters(memory, instructionPointer + 1, 2, parameterModes);
        // console.log(`running add opcode`);
        memory[memory[instructionPointer + 3]] = parameters[0] + parameters[1];
        return runProgram(memory, instructionPointer + 4);
    } else if (opcode === 2) {
        let parameters = getParameters(memory, instructionPointer + 1, 2, parameterModes);
        // console.log(`running multiply opcode with parameters`);
        // console.log(parameters);
        memory[memory[instructionPointer + 3]] = parameters[0] * parameters[1];
        return runProgram(memory, instructionPointer + 4);
    } else if (opcode === 3) {
        let parameter = memory[instructionPointer + 1];
        // console.log(`Running input opcode`);
        memory[parameter] = input;
        return runProgram(memory, instructionPointer + 2);
    } else if (opcode === 4) {
        let parameter = memory[instructionPointer + 1];
        console.log(`Output value at ${parameter}: ${memory[parameter]}`);
        return runProgram(memory, instructionPointer + 2);
    } else if (instruction === 99) {
        return memory[0];
    }

    console.log(`Computing opcode ${opcode} at pointer ${instructionPointer} with memory`);
    console.log(memory.slice(0, instructionPointer + 4));
    throw Error("Encountered invalid opcode");
}

// let stream = byline(fs.createReadStream('test-input1.txt', { encoding: 'utf8' }));
let stream = byline(fs.createReadStream('input.txt', { encoding: 'utf8' }));

stream.on('data', loadMemory);

stream.on('end', () => {
    // console.log(programMemory);
    runProgram(programMemory);
    // console.log(programMemory);
});
