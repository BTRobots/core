/**
    Microcode:
        0 = instruction, number, constant
        1 = variable, memory access
        2 = :label
        3 = !label (unresolved)
        4 = !label (resolved)
       8h mask = inderect addressing (enclosed in [])
*/
export declare const operand: (suffix: number, prefix: number) => string;
