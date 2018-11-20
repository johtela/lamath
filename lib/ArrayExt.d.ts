import { Equatable } from "./Equatable";
export declare function clone<T>(array: T[][]): T[][];
export declare function fill<T>(array: T[], value: T): T[];
export declare function repeat<T>(value: T, count: number): T[];
export declare function maxItems<T>(array: T[], selector: (ítem: T) => number): T[];
export declare function sum(array: number[]): number;
export declare function distinct<T extends Equatable<T>>(array: T[]): T[];
export declare function flatMap<T, U>(array: T[], selector: (item: T) => U[]): U[];
