import * as FMath from "./fmath"

/**
 * The matrix is represented by an array of numbers. The first two numbers of 
 * the array contain the number of rows and columns in the matrix respectively.
 */
export type Matrix = number[];

export function dimensions(m: Matrix): [number, number] {
    return [m[0], m[1]];
}

export function element(m: Matrix, row: number, column: number): number {
    return m[column * m[0] + row + 2]
}

export function zero(rows: number, cols: number): Matrix {
    let res = new Array<number>(rows * cols + 2).fill(0);
    res[0] = rows;
    res[1] = cols;
    return res;
}

export function identity(dim: number): Matrix {
    let res = zero(dim, dim);
    for (let i = 0; i < dim; ++i)
        res[i * dim + i + 2] = 1;
    return res;
}

export function translation(dim: number, offsets: number[]): Matrix {
    let res = identity(dim);
    let lastCol = (dim - 1) * dim + 2;
    let lastRow = Math.min(offsets.length, dim - 1);
    for (let i = 0; i < lastRow; i++)
        res[lastCol + i] = offsets[i]
    return res;
}

export function scaling(dim: number, factors: number[]): Matrix {
    let res = identity(dim);
    let len = Math.min(factors.length, dim);
    for (let i = 0; i < len; i++)
        res[i * dim + i + 2] = factors[i];
    return res;
}

rotationX(angle: number): M
rotationY(angle: number): M
rotationZ(angle: number): M
fromArray(array: number[], rows: number, cols: number): M


export interface Mat<M extends Mat<M>> extends Equatable<M> {
    readonly rows: number
    readonly cols: number


    add(other: M | number): M
    sub(other: M | number): M
    mul(other: M | number): M
    transform<V extends Vec<V>>(vec: V): V
    transpose(): M
    determinant(): number
    invert(): M

    approxEquals(other: M, epsilon?: number): boolean
    toString(): string
    toArray(): number[]
    toFloat32Array(): Float32Array
}
