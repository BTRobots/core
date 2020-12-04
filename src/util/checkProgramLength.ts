import { MAX_CODE } from '../constants';
import { PrecompiledLine, Program } from '../types';

export const checkProgramLength = (program: PrecompiledLine[]) => {
  if (program.length > MAX_CODE) {
    throw new Error(`Program is ${program.length - MAX_CODE} lines too long: maximum program length is ${MAX_CODE} compiled lines`);
  }
};
