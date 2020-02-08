import { MAX_CODE } from '../constants';
import { checkProgramLength } from './checkProgramLength';

describe('checkProgramLength', () => {
  it(`should throw if program is longer than ${MAX_CODE} compiled lines`, () => {
    expect(() => checkProgramLength(new Array(MAX_CODE + 1))).toThrow();
  });
  it(`should not throw if program is <= ${MAX_CODE} compiled lines`, () => {
    expect(() => checkProgramLength(new Array(MAX_CODE))).not.toThrow();
    expect(() => checkProgramLength([])).not.toThrow();
  });
});
