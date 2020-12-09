import { CODE_SIZE } from '../constants';
import { checkProgramLength } from './checkProgramLength';

describe('checkProgramLength', () => {
  it(`should throw if program is longer than ${CODE_SIZE} compiled lines`, () => {
    expect(() => checkProgramLength(new Array(CODE_SIZE + 1))).toThrow();
  });
  it(`should not throw if program is <= ${CODE_SIZE} compiled lines`, () => {
    expect(() => checkProgramLength(new Array(CODE_SIZE))).not.toThrow();
    expect(() => checkProgramLength([])).not.toThrow();
  });
});
