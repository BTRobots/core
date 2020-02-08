import { compile } from './compile';
import { createEmptyCompiledProgram } from '../testUtils/createEmptyProgram';
import { MAX_VAR_LEN, MAX_VARS, MAX_LABELS } from '../constants';
import { Robot, ProgramLine } from '../types';

describe('compiler', () => {
  describe('comment lines', () => {
    const testCase = `
    ;
    ; This is a test header!
    ;
    ; This should comile to zero lines!
    ;
    `;
    // const expected = createEmptyCompiledProgram();
    it('should throw with just comment lines', () => {
      expect(() => compile(testCase)).toThrow();
    });
  });
  describe('directives', () => {
    describe('DEF', () => {
      it('should throw if the variable name is too long', () => {
        const testCase = `
        #def thisnameistoolong
        `;
        expect(() => compile(testCase, true)).toThrow();
      });
      it('should throw if too many variables have been declared', () => {
        const testCase = Array(MAX_VARS + 1).map((value, index) => `#def a${index}`).join('\n');
        expect(() => compile(testCase)).toThrow();
      });
      it('should throw if a variable is being redeclared', () => {
        const testCase = `
        #def test
        #def test
        `;
        expect(() => compile(testCase)).toThrow();
      });
      it('should compile lowercase defs', () => {
        const testCase = `
        #def lowercasename
        `;
        expect(() => compile(testCase)).not.toThrow();
      });
      it('should compile uppercase defs', () => {
        const testCase = `
        #DEF UPPERCASENAME
        `;
        expect(() => compile(testCase)).not.toThrow();
      });
      it('should not throw when the maximum number variables have been declared', () => {
        const testCase = (new Array(MAX_VARS)).fill('').map((val, index) => `#def variable${index}`).join('\n');
        expect(() => compile(testCase)).not.toThrow();
      });
      it('should throw when too many variables have been declared', () => {
        const testCase = (new Array(MAX_VARS + 1)).fill('').map((val, index) => `#def variable${index}`).join('\n');
        expect(() => compile(testCase)).toThrow();
      });
    });
    describe('LOCK', () => {
      it('should not throw when passed uppercase LOCK', () => {
        const testCase = `
        #LOCK
        `;
        expect(() => compile(testCase)).not.toThrow();
      });
      it('should not throw when passed lowercase LOCK', () => {
        const testCase = `
        #lock
        `;
        expect(() => compile(testCase)).not.toThrow();
      });
    });
    describe('MSG', () => {
      it('should not throw when passed lowercase msg', () => {
        const expected = "Here's the message";
        const testCase = `
        #msg ${expected}
        `;
        expect(() => compile(testCase)).not.toThrow();
      });
      it('should not throw when passed lowercase msg', () => {
        const expected = "Here's the message";
        const testCase = `
        #MSG ${expected}
        `;
        expect(() => compile(testCase)).not.toThrow();
      });
      it('should set the robot.name parameter', () => {
        const expected = "Here's the message";
        const testCase = `
        #msg ${expected}
        `;
        expect(compile(testCase).name).toEqual(expected);
      });
    });
    describe('TIME', () => {
      it('should set the robot.robot_time_limit parameter', () => {
        const expected = 25;
        const testCase = `
        #time ${expected}
        `;
        expect(compile(testCase).robot_time_limit).toEqual(expected);
      });
      it('should set the robot.robot_time_limit parameter to a minimum of zero', () => {
        const expected = -25;
        const testCase = `
        #time ${expected}
        `;
        expect(compile(testCase).robot_time_limit).toEqual(0);
      });
    });
    describe('CONFIG', () => {
      // common config values with the same rules
      const configKeys = ([
        'scanner',
        'shield',
        'weapon',
        'armor',
        'engine',
        'heatsinks',
        'mines',
      ] as (keyof Robot.Config)[]).forEach((key) => {
        describe(key.toUpperCase(), () => {
          it(`should set the robot.${key} config parameter`, () => {
            expect(compile(`#config ${key}=2`)[key]).toEqual(2);
          });
          it('should set the robot.${key} config parameter to a minimum of 0', () => {
            expect(compile(`#config ${key}=-2`)[key]).toEqual(0);
          });
          it('should set the robot.${key} config parameter to a maximum of 5', () => {
            expect(compile(`#config ${key}=6`)[key]).toEqual(5);
          });
        });
      });
      describe('invalid setting', () => {
        it('should throw with an invalid setting', () => {
          expect(() => compile('#config somegarbage=6')).toThrow();
        });
      });
    });
  });
  describe('pre-compiled machine code', () => {
    it('should throw if more than one asterisk is on each line', () => {
      expect(() => compile('** 12 34 45')).toThrow();
      expect(() => compile('* 12 34 45*')).toThrow();
      expect(() => compile('* 12 34* 45')).toThrow();
    });
    it('should throw if there is only one character in the int tuple', () => {
      expect(() => compile('*1')).toThrow();
    });
    [
      {
        input: '* 1 2',
        expectedOutput: [1, 2, 0, 0],
      },
      {
        input: '* 1 2 3',
        expectedOutput: [1, 2, 3, 0],
      },
      {
        input: '* 1 2 3 4',
        expectedOutput: [1, 2, 3, 4],
      },
      {
        input: '* 11 2 3 4',
        expectedOutput: [11, 2, 3, 4],
      },
      {
        input: '* 11 232 3 43',
        expectedOutput: [11, 232, 3, 43],
      },
      {
        input: '* 0 00 3 43',
        expectedOutput: [0, 0, 3, 43],
      },
    ].forEach(({ input, expectedOutput }) => {
      it(`should return the correct output for the tuple ${input}`, () => {
        expect(compile(input).program).toEqual([expectedOutput]);
      });
    });
  });
  describe(':labels', () => {
    it('should error if a non-digit character is given', () => {
      expect(() => compile(':123a')).toThrow();
    });
    it('should return the correct tuple', () => {
      expect(compile(':12334').program).toEqual([[12334, 0, 0, 2]]);
    });
  });
  describe('!labels', () => {
    it('should error if redeclaring a !label', () => {
      expect(() => compile(`
        !label somelabel
        !label somelabel
      `)).toThrow();
    });
    it('should error if too many !labels are declared', () => {
      expect(() => compile(Array(MAX_LABELS + 1).map((v, i) => `somelabel${i}`).join('\n'))).toThrow();
    });
  });
  describe('parsing instructions', () => {

  });
});
