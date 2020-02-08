var Robot;
(function (Robot) {
    class Config {
        constructor(input) {
            this.name = input.name || '';
            this.scanner = input.scanner || 0;
            this.weapon = input.weapon || 0;
            this.armor = input.armor || 0;
            this.engine = input.engine || 0;
            this.heatsinks = input.heatsinks || 0;
            this.shield = input.shield || 0;
            this.mines = input.mines || 0;
            this.program = input.program || [];
            this.robot_time_limit = input.robot_time_limit || 0;
        }
    }
    Robot.Config = Config;
    // TODO - replace with more performant deep copy.
    Robot.clone = (inputRobot) => JSON.parse(JSON.stringify(inputRobot));
})(Robot || (Robot = {}));

const MAX_VAR_LEN = 16;
const MAX_CODE = 1024;
const MAX_VARS = 256;
const MAX_LABELS = 256;

/**
 * Replaces invalid characters with spaces
 */
const replaceInvalidCharacters = (input) => {
    return input
        .split('') // split to character array
        .filter(Boolean)
        .map((char) => {
        const charCode = char.charCodeAt(0); // to ascii number
        return (charCode < 32 ||
            charCode > 127)
            ? ' '
            : char;
    })
        .reduce((acc, curr) => acc + curr, ''); // join array
};

const stringToInt = (input) => {
    let negative = false;
    const unsigned = input.trim().toUpperCase();
    let signed;
    if (unsigned === '') {
        return 0;
    }
    if (unsigned[0] === '-') {
        negative = true;
        signed = unsigned.substr(1);
    }
    else {
        signed = unsigned;
    }
    let result;
    // look for hex suffix
    if (signed.endsWith('H')) {
        result = parseInt(signed.substr(0, signed.length - 1), 16);
    }
    else if (signed.startsWith('0X')) {
        // look for hex prefix
        result = parseInt(signed.substr(2), 16);
    }
    else {
        result = parseInt(signed, 10);
    }
    return negative
        ? -result
        : result;
};

const checkProgramLength = (program) => {
    if (program.length > MAX_CODE) {
        throw new Error(`Program is ${program.length - MAX_CODE} lines too long: maximum program length is ${MAX_CODE} compiled lines`);
    }
};

const filterExtraneousLines = (line) => {
    const trimmed = line.trim();
    return trimmed.length > 0 &&
        trimmed[0] !== ';';
};

const compile = (robot_file, debug = false) => {
    var _a;
    const variables = new Map();
    // Map<label name, program line number>
    const labels = new Map();
    const configInput = {};
    const program = [];
    const fileLines = robot_file
        // .toUpperCase()    // treat enitre file as uppercase
        .split(/\r?\n/g)
        .map(replaceInvalidCharacters)
        .map(line => line.trim())
        .filter(filterExtraneousLines);
    if (fileLines.length === 0) {
        throw new Error('You must supply executable code!');
    }
    for (const line of fileLines) {
        checkProgramLength(program);
        switch (line.charAt(0)) {
            case '#': {
                // Comiler Directives
                const directive = line.toUpperCase().substr(1, line.indexOf(' ') - 1);
                if (directive === 'DEF') {
                    const variableName = line.substr(5);
                    // Variable Validation
                    if (variableName.length > MAX_VAR_LEN) {
                        throw new Error(`Variable name "${variableName}" is too long!`);
                    }
                    if (variables.get(variableName) !== undefined) {
                        throw new Error(`Cannot redeclare variable ${variableName}`);
                    }
                    if (variables.size >= MAX_VARS) {
                        throw new Error('Too many variables delcared!');
                    }
                    variables.set(variableName, null);
                    break;
                }
                if (directive === 'LOCK') {
                    // skip
                    break;
                }
                if (directive === 'MSG') {
                    configInput.name = line.substr(line.indexOf(' ') + 1);
                    break;
                }
                if (directive === 'TIME') {
                    const parsedTime = parseInt(line.substr(line.indexOf(' ') + 1), 10);
                    configInput.robot_time_limit = !isNaN(parsedTime) && parsedTime > 0
                        ? parsedTime
                        : 0;
                    break;
                }
                if (directive === 'CONFIG') {
                    const [configKey, value] = line.substr(8).toUpperCase().split('=');
                    const parsedValue = parseInt(value, 10);
                    // values muse be between 0 and 5 inclusive
                    const validatedValue = (isNaN(parsedValue) || parsedValue < 0)
                        ? 0
                        : parsedValue > 5
                            ? 5
                            : parsedValue;
                    switch (configKey) {
                        case 'SCANNER':
                            configInput.scanner = validatedValue;
                            break;
                        case 'SHIELD':
                            configInput.shield = validatedValue;
                            break;
                        case 'WEAPON':
                            configInput.weapon = validatedValue;
                            break;
                        case 'ARMOR':
                            configInput.armor = validatedValue;
                            break;
                        case 'ENGINE':
                            configInput.engine = validatedValue;
                            break;
                        case 'HEATSINKS':
                            configInput.heatsinks = validatedValue;
                            break;
                        case 'MINES':
                            configInput.mines = validatedValue;
                            break;
                        default:
                            throw new Error(`Unknown config setting ${configKey}`);
                    }
                }
                break;
            } // end Compiler Directives
            case '*': {
                const codeLine = line.substr(1).trim();
                // Inline Pre-Compiled Machine Code
                if (codeLine.includes('*')) {
                    throw new Error('Too many asterisks!');
                }
                if (line.length <= 2) {
                    throw new Error(`Insufficient data in data satement: ${line}`);
                }
                const codeChunks = codeLine.split(' ').filter(Boolean);
                const programLine = [0, 0, 0, 0].map((num, index) => {
                    return codeChunks[index]
                        ? stringToInt(codeChunks[index])
                        : 0;
                });
                program.push(programLine);
                break;
            } // end Inline Pre-Compiled Machine Code
            case ':': {
                // :labels
                const codeLine = line.substr(1);
                // :labels can only be 0-9
                if (!/\b\d+\b/.test(codeLine)) {
                    throw new Error(`Invalid label '${codeLine}': only digits allowed`);
                }
                program.push([stringToInt(codeLine), 0, 0, 2]);
                break; // end :labels
            }
            case '!': {
                // !labels
                const codeLine = line.substr(1);
                // find first occurance of special character (semi-colon, comma, or space)
                const firstSpecialCharacterIndex = (_a = codeLine.match(/[;, ]/)) === null || _a === void 0 ? void 0 : _a.index;
                const labelName = firstSpecialCharacterIndex
                    ? codeLine.slice(0, firstSpecialCharacterIndex)
                    : codeLine;
                if (labels.get(labelName) !== undefined) {
                    // no redelcaring labels
                    throw new Error(`Label '${labelName}' already defined!`);
                }
                if (labels.size === MAX_LABELS) {
                    // already at maximum number of labels
                    throw new Error('Too many !labels');
                }
                /*********
                 *  TODO - make sure labels work correctly this way
                 */
                labels.set(labelName, program.length);
                break; // end !labels
            }
            default: {
                // instructions/numbers
                // remove comments
                const codeLine = (line.includes(';')
                    ? line.slice(0, line.indexOf(';'))
                    : line).trim();
                // map instructions to tuple in a TypeScript-friendly way
                const tokens = codeLine.toUpperCase().split(' ');
                const instructions = [
                    tokens[0] || '',
                    tokens[1] || '',
                    tokens[2] || '',
                    tokens[3] || '',
                ];
                /*
                  Microcode:
                      0 = instruction, number, constant
                      1 = variable, memory access
                      2 = :label
                      3 = !label (unresolved)
                      4 = !label (resolved)
                    8h mask = inderect addressing (enclosed in [])
                */
                // parse Instructions
                const machineCodeTuple = instructions.map((instruction) => {
                    let modifiedInstruction = '';
                    if (instruction.startsWith('[') && instruction.endsWith('[')) {
                        modifiedInstruction = instruction.replace(/\[|\]/g, '');
                    }
                    else {
                        modifiedInstruction = instruction;
                    }
                    return 0;
                });
                program.push(machineCodeTuple);
            }
        }
    }
    return new Robot.Config({
        ...configInput,
        program,
    });
};
/*
const parseInstructions = (lineTuple: string[]) => {
  let found = false;
  let opcode = 0;
  let microcode = 0;

  const tuple = lineTuple
    .map(l => l.toUpperCase())

}
*/

export { compile };
