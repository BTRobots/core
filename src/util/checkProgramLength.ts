import { CODE_SIZE } from '../constants';
import { PrecompiledLine, Program } from '../types';

export const checkProgramLength = (program: PrecompiledLine[]) => {
  if (program.length > CODE_SIZE) {
    throw new Error(`Program is ${program.length - CODE_SIZE} lines too long: maximum program length is ${CODE_SIZE} compiled lines`);
  }
};
