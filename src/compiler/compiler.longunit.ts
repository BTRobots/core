import * as fs from 'fs';
import * as path from 'path';
import { compile } from './compile';

const sourceFileExtention = '.at2';
const machineCodeFileExtention = '.mch';

const dirContents = fs.readdirSync(path.join(__dirname, 'unlocked'));
const testCases: [string, string, string[]][] = dirContents
  .filter(fileName => fileName.endsWith(sourceFileExtention))
  .map((fileName) => {
    const prefix = fileName.split('.')[0];
    const test: [string, string, string[]] = [
      prefix,
      fs.readFileSync(path.join(__dirname, 'unlocked', fileName), 'utf-8'),
      fs.readFileSync(path.join(__dirname, 'unlocked', `${prefix}${machineCodeFileExtention}`), 'utf-8').split(/\r?\n/),
    ];
    return test;
  });

describe('compiler', () => {
  for (const [robotName, source, machine] of testCases) {
    let error: string | null = null;
    try {
      const compiledProgram = compile(source);
      compiledProgram.program.forEach((programLine, index) => {
        it('should equal the known output', () => {
          expect(programLine.join(' ')).toEqual(machine[index]);
        });
      });
    } catch (err) {
      error = err.message;
    }
    it('should not error', () => {
      expect(error).toBeNull();
    });
  }
});
