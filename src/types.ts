export enum OperationArguments {
  NUMBER,
  VARIABLE,
  REGISTER,
  MEMORY,
}

export type NumVar = OperationArguments.NUMBER | OperationArguments.VARIABLE;

const __Command = {
  NOP: '',
  ADD: '',
  SUB: '',
  OR: '',
  AND: '',
  XOR: '',
  NOT: '',
  MPY: '',
  DIV: '',
  MOD: '',
  RET: '',
  CALL: '',
  JMP: '',
  JLS: '',
  JGR: '',
  JNE: '',
  JE: '',
  SWAP: '',
  DO: '',
  LOOP: '',
  CMP: '',
  TEST: '',
  MOV: '',
  LOC: '',
  GET: '',
  PUT: '',
  INT: '',
  IPO: '',
  OPO: '',
  DELAY: '',
  PUSH: '',
  POP: '',
  ERR: '',
  INC: '',
  DEC: '',
  SHL: '',
  SHR: '',
  ROL: '',
  ROR: '',
  JZ: '',
  JNZ: '',
  JGE: '',
  JLE: '',
  SAL: '',
  SAR: '',
  NEG: '',
  JTL: '',
  XXX: '',
  // extendedoperations
  RETURN: '',
  GOSUB: '',
  JUMP: '',
  JB: '',
  GOTO: '',
  JA: '',
  JEQ: '',
  XCHG: '',
  SET: '',
  ADDR: '',
  IN: '',
  OUT: '',
  DEL: '',
  ERROR: '',
  JBE: '',
};

export type Command = keyof typeof __Command;

const __Register = {
  COLCNT: '',
  METERS: '',
  COMBASE: '',
  COMEND: '',
  FLAGS: '',
  AX: '',
  BX: '',
  CX: '',
  DX: '',
  EX: '',
  FX: '',
  SP: '',
};
export type Register = keyof typeof __Register;

const __Constant = {
  MAXINT: '',
  MININT: '',
  P_SPEDOMETER: '',
  P_HEAT: '',
  P_COMPASS: '',
  P_TANGLE: '',
  P_TURRET_OFS: '',
  P_THEADING: '',
  P_TURRET_ABS: '',
  P_ARMOR: '',
  P_DAMAGE: '',
  P_SCAN: '',
  P_ACCURACY: '',
  P_RADAR: '',
  P_RANDOM: '',
  P_RAND: '',
  P_THROTTLE: '',
  P_TROTATE: '',
  P_OFS_TURRET: '',
  P_TAIM: '',
  P_ABS_TURRET: '',
  P_STEERING: '',
  P_WEAP: '',
  P_WEAPON: '',
  P_FIRE: '',
  P_SONAR: '',
  P_ARC: '',
  P_SCANARC: '',
  P_OVERBURN: '',
  P_TRANSPONDER: '',
  P_SHUTDOWN: '',
  P_CHANNEL: '',
  P_MINELAYER: '',
  P_MINETRIGGER: '',
  P_SHIELD: '',
  P_SHIELDS: '',
  I_DESTRUCT: '',
  I_RESET: '',
  I_LOCATE: '',
  I_KEEPSHIFT: '',
  I_OVERBURN: '',
  I_ID: '',
  I_TIMER: '',
  I_ANGLE: '',
  I_TID: '',
  I_TARGETID: '',
  I_TINFO: '',
  I_TARGETINFO: '',
  I_GINFO: '',
  I_GAMEINFO: '',
  I_RINFO: '',
  I_ROBOTINFO: '',
  I_COLLISIONS: '',
  I_RESETCOLCNT: '',
  I_TRANSMIT: '',
  I_RECEIVE: '',
  I_DATAREADY: '',
  I_CLEARCOM: '',
  I_KILLS: '',
  I_DEATHS: '',
  I_CLEARMETERS: '',
};

export type Constant = keyof typeof __Constant;

export type ProgramWord = number | string | null;
export type ProgramLine = [ProgramWord, ProgramWord, ProgramWord, ProgramWord];
export type Program = ProgramLine[];
export type PrecompiledWord = number | string;
export type PrecompiledLine = [
  number, // opcode
  PrecompiledWord, // number, variable, label reference
  PrecompiledWord,
  number, // microcode
  string | null, // label, removed for compiled lines
];
export type CompiledLine = [number, number, number, number];
export type CompiledProgram = CompiledLine[];

export interface Mine {
  x: Number; // was real, now float
  y: Number; // was real, now float
  detecy: number;
  yield: number;
  detonate: boolean;
}

export interface IRobot {
  is_locked: boolean;
  mem_watch: number;
  x: number;
  y: number;
  lx: number;
  ly: number;
  xv: number;
  yv: number;
  speed: number;
  shot_strength: number;
  damaged_adj: number;
  speed_adj: number;
  meters: number;

  hd: number;
  thd: number;
  lhd: number;
  spd: number;
  tspd: number;
  armor: number;
  larmor: number;
  heat: number;
  lheat: number;
  ip: number;

  plen: number;
  scan_arc: number;
  accuracy: number;
  shift: number;
  err: number;
  delay_left: number;
  robot_time_limit: number;
  max_time: number;
  time_left: number;
  l_shift: number;
  arc_count: number;
  sonar_count: number;
  scan_range: number;
  last_damage: number;
  last_hit: number;
  transponder: number;
  shutdown: number;
  channel: number;
  l_end_arc: number;
  end_arc: number;
  l_start_arc: number;
  start_arc: number;
  mines: number;

  tx: number[];
  ltx: number[];
  ty: number[];
  lty: number[];

  wins: number;
  trials: number;
  kills: number;
  deaths: number;
  startkills: number;
  shots_fired: number;
  match_shots: number;
  hits: number;
  damage_total: number;
  cycles_lived: number;
  error_count: number;
  config: Robot.Config;

  name: string;
  fn: string;

  shields_up: boolean;
  lshields: boolean;
  overburn: boolean;
  keepshift: boolean;
  cooling: boolean;
  won:boolean;

  code: CompiledProgram;
  stack: number[];
  ram: number[];
  mine: Mine[];
  errorlog: string;
}

export type Missile = {
  x: number;
  y: number;
  lx: number;
  ly: number;
  mult: number;
  mspd: number;
  source: number;
  a: number;
  hd: number;
  rad: number;
  lrad: number;
  max_rad: number;
};

export type Variable = number | null;
export type VariableMap = Map<string, Variable>;

export namespace Robot {
  export type CompilerHelper = {
    variableMap: VariableMap;
    config: Robot.Config;
  };

  export interface ConfigInput {
    name?: string;
    scanner?: number;
    weapon?: number;
    armor?: number;
    engine?: number;
    heatsinks?: number;
    shield?: number;
    mines?: number;
    program?: CompiledProgram;
    robot_time_limit?: number;
  }

  export class Config {
    readonly name: string;
    readonly scanner: number;
    readonly weapon: number;
    readonly armor: number;
    readonly engine: number;
    readonly heatsinks: number;
    readonly shield: number;
    readonly mines: number;
    readonly program: CompiledProgram;
    readonly robot_time_limit: number;
    constructor(input: ConfigInput) {
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
  // TODO - replace with more performant deep copy.
  export const clone = (inputRobot: IRobot): IRobot => JSON.parse(JSON.stringify(inputRobot));
}

export namespace Options {

  export type DebugCompiler = {
    show_code: boolean;
    compile_by_line: boolean;
    max_var_len: number;
    debugging_compiler: boolean;
  };

  export type Robots = {
    max_robots: number;
    max_code: number;
    max_op: number;
    max_stack: number; // power of 2
    max_ram: number; // 2^n-1
    max_vars: number;
    max_labels: number;
    acceleration: number;
    turn_rate: number;
    max_vel: number;
    max_missiles: number;
    missile_spd: number;
    hit_range: number;
    blast_radius: number;
    crash_range: number;
    max_sonar: number;
    com_queue: number;
    max_queue: number;
    max_config_points: number;
    max_mines: number;
    mine_blast: number;
  };

  export type SimulatorAndGraphics = {
    screen_scale: Number;
    screen_x: number;
    screen_y: number;
    robot_scale: number;
    default_delay: number;
    default_slice: number;
    mine_circle: number;
    blast_circle: number;
    mis_radius: number;
    max_robot_lines: number;
  };
}
export class LineType {}
export namespace LineType {
  export const EMPTY = 'EMPTY';
  export const BANG_LABEL = 'BANG_LABEL';
  export const COLON_LABEL = 'COLON_LABEL';
  export const COMMENT = 'COMMENT';
  export const PRE_COMPILED = 'PRE_COMPILED';
  export const OPERATION = 'OPERATION';
  export const DIRECTIVE = 'DIRECTIVE';
  export const UNKNOWN = 'UNKNOWN';
}

export enum DirectiveType {
  TIME_SLICE = 'TIME', // deprecated?
  VARIABLE_DECLARATION = 'DEF',
  MSG = 'MSG',
  CONFIGURATION = 'CONFIG',
  LOCK = 'LOCK',
}

export enum ConfigurationType {
  SCANNER = 'SCANNER',
  SHIELD = 'SHIELD',
  WEAPON = 'WEAPON',
  ARMOR = 'ARMOR',
  ENGINE = 'ENGINE',
  HEATSINKS = 'HEATSINKS',
  MINES = 'MINES',
}

/*
export enum InstructionType {
  'EMPTY' = 'EMPTY',
  'BANG_LABEL' = 'BANG_LABEL',
  'COLON_LABEL' = 'COLON_LABEL',
  'COMMENT' = 'COMMENT',
  'PRE_COMPILED' = 'PRE_COMPILED',
  'OPERATION' = 'OPERATION',
  'DIRECTIVE' = 'DIRECTIVE',
  'UNKNOWN' = 'UNKNOWN',
}*/

export type Instruction = string | number;
export type InstructionTuple = [Instruction, Instruction, Instruction, Instruction];
export type MachineCodeTuple = [number, number, number, number];
export type DebuggingSymbol = {
  original_line_num: number;
  original_line_text: string;
  compiled_line_num: number | null;
  compiled_line_instructions?: InstructionTuple;
  line_type: LineType,
  instructions?: Instruction[];
};
export type DebuggingSymbols = DebuggingSymbol[];
