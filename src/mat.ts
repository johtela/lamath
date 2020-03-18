import { Vector, Vec3, x, y, z } from "./vec"
import * as Vec from "./vec"
import * as ArrayExt from "./arrayext"
import * as FMath from "./fmath"
/**
 * The matrix is represented by an array of numbers. The first two numbers of 
 * the array contain the number of rows and columns in the matrix respectively.
 */
export type Matrix = number[]
export type Mat2 = [number, number, number, number, number, number]
export type Mat3 = [number, number, number, number, number, number, 
    number, number, number, number, number]
export type Mat4 = [number, number, number, number, number, number,
    number, number, number, number, number, number, number, number, 
    number, number, number, number]
export type SquareMatrix = Mat2 | Mat3 | Mat4
    
const invalidElementCount = "There must be rows x cols elements in the array"

export function dimensions(m: Matrix): [number, number] {
    return [m[0], m[1]]
}

export function element(m: Matrix, row: number, column: number): number {
    return m[column * m[0] + row + 2]
}

export function create<M extends Matrix>(rows: number, cols: number): M {
    let res = new Array(rows * cols + 2)
    res[0] = rows
    res[1] = cols
    return <M>res
}

export function fromArray<M extends Matrix>(rows: number, cols: number, 
    array: number[]): M {
    if (array.length != rows * cols)
        throw RangeError(invalidElementCount)
    return <M>[rows, cols, ...array]
}

export function redim<M extends Matrix>(m: Matrix, rows: number, cols: number, 
    pad: number = 0): M {
    let res = new Array(rows * cols + 2)
    res[0] = rows
    res[1] = cols
    let r = m[0]
    for (let i = 0; i < cols; ++i)
        for (let j = 0; j < rows; ++j)
            res[i * rows + j + 2] = [i * r + j + 2] || pad; 
    return <M>res
}

export function zero<M extends Matrix>(rows: number, cols: number): M {
    let res = new Array<number>(rows * cols + 2).fill(0)
    res[0] = rows
    res[1] = cols
    return <M>res
}

export function identity<M extends SquareMatrix>(dim: number): M {
    let res = zero(dim, dim)
    for (let i = 0; i < dim; ++i)
        res[i * dim + i + 2] = 1
    return <M>res
}

export function toMat3(m: Mat2): Mat3 {
    let res = redim<Mat3>(m, 3, 3)
    res[10] = 1
    return res
}

export function toMat4(m: Mat2 | Mat3): Mat4 {
    let res = redim<Mat4>(m, 4, 4)
    res[17] = 1
    if (m[0] == 2)
        res[12] = 1
    return res
}

export function translation<M extends SquareMatrix>(dim: number, 
    offsets: number[]): M {
    let res = identity(dim)
    let lastCol = (dim - 1) * dim + 2
    let lastRow = Math.min(offsets.length, dim - 1)
    for (let i = 0; i < lastRow; ++i)
        res[lastCol + i] = offsets[i]
    return <M>res
}

export function scaling<M extends SquareMatrix>(dim: number, 
    factors: number[]): M {
    let res = identity(dim)
    let len = Math.min(factors.length, dim)
    for (let i = 0; i < len; ++i)
        res[i * dim + i + 2] = factors[i]
    return <M>res
}

export function rotationX<M extends Mat3 | Mat4>(dim: number, angle: number): M {
    let res = identity(dim)
    let sina = Math.sin(angle)
    let cosa = Math.cos(angle)
    res[dim + 3] = cosa
    res[dim + 4] = sina
    res[2 * dim + 3] = -sina
    res[2 * dim + 4] = cosa
    return <M>res
}

export function rotationY<M extends Mat3 | Mat4>(dim: number, angle: number): M {
    let res = identity(dim)
    let sina = Math.sin(angle)
    let cosa = Math.cos(angle)
    res[2] = cosa
    res[4] = -sina
    res[2 * dim + 2] = sina
    res[2 * dim + 4] = cosa
    return <M>res
}

export function rotationZ<M extends SquareMatrix>(dim: number, angle: number): M {
    let res = identity(dim)
    let sina = Math.sin(angle)
    let cosa = Math.cos(angle)
    res[2] = cosa
    res[3] = sina
    res[dim + 2] = -sina
    res[dim + 3] = cosa
    return <M>res
}

export function perspective(left: number, right: number, bottom: number, 
    top: number, zNear: number, zFar: number): Mat4 {
    if (zNear <= 0 || zNear >= zFar)
        throw RangeError("zNear needs to be positive and smaller thatn zFar")
    let width = right - left
    let height = top - bottom
    let depth = zFar - zNear
    return [4, 4,
        (2.0 * zNear) / width, 0, 0, 0,
        0, (2.0 * zNear) / height, 0, 0,
        (right + left) / width, (top + bottom) / height, -(zFar + zNear) / depth, -1,
        0, 0, -(2.0 * zFar * zNear) / depth, 0]
}

export function orthographic(left: number, right: number, bottom: number, 
    top: number, zNear: number, zFar: number): Mat4 {
    let invWidth = 1.0 / (right - left)
    let invHeight = 1.0 / (top - bottom)
    let invDepth = 1.0 / (zFar - zNear)
    return [4, 4,
        2 * invWidth, 0, 0, 0,
        0, 2 * invHeight, 0, 0,
        0, 0, -2 * invDepth, 0,
        -(right + left) * invWidth, -(top + bottom) * invHeight, -(zFar + zNear) * invDepth, 1]
}

export function lookAt(direction: Vec3, up: Vec3): Mat4 {
    let zaxis = Vec.norm(Vec.inv(direction))
    let xaxis = Vec.norm(Vec.cross(up, zaxis))
    let yaxis = Vec.cross(zaxis, xaxis)

    return [4, 4,
        xaxis[x], yaxis[x], zaxis[x], 0,
        xaxis[y], yaxis[y], zaxis[y], 0,
        xaxis[z], yaxis[z], zaxis[z], 0,
        0, 0, 0, 1]
}

export function add<M extends Matrix>(mat: M, other: M | number, 
    out: M = create(mat[0], mat[1])): M {
    let len = mat.length
    if (typeof other === "number")
        for (let i = 2; i < len; ++i)
            out[i] = mat[i] + other
    else 
        for (let i = 2; i < len; ++i)
            out[i] = mat[i] + other[i]
    return out
}

export function sub<M extends Matrix>(mat: M, other: M | number, 
    out: M = create(mat[0], mat[1])): M {
    let len = mat.length
    if (typeof other === "number")
        for (let i = 2; i < len; ++i)
            out[i] = mat[i] - other
    else 
        for (let i = 2; i < len; ++i)
            out[i] = mat[i] - other[i]
    return out
}

export function mul(mat: Matrix, other: Matrix | number): Matrix {
    if (typeof other === "number") {
        let len = mat.length
        let res = create(mat[0], mat[1])
        for (let i = 2; i < len; ++i)
            res[i] = mat[i] * other
        return res
    }
    else {
        let n = mat[0]
        let m = mat[1]
        let q = other[0]
        let p = other[1]
        if (m !== q)
            throw RangeError(`Cannot multiply ${n}x${m} matrix with ${q}x${p} matrix.`);
        let res = create(n, p);
        // Iterate through rows and columns
        for (let i = 0; i < n; ++i)
            for (let j = 0; j < p; ++j) {
                // Sum up rows from this with columns from other matrix.
                let val = 0
                for (let k = 0; k < m; ++k)
                    val += mat[k * n + i + 2] * other[j * q + k + 2]
                res[j * n + i + 2] = val
            }
        return res
    }
}

export function transform(mat: SquareMatrix, vec: Vector): Vector {
    let cols = mat[1]
    let len = vec.length
    if (len < cols)
        vec = Vec.redim(vec, cols)
    let vecm = [cols, 1, ...vec]
    return <Vector>mul(mat, vecm).slice(2)
}

export function transpose(mat: Matrix): Matrix {
    let rows = mat[0], cols = mat[1]
    let res = create(cols, rows)
    let ind = 2
    for (let i = 0; i < rows; ++i)
        for (let j = 0; j < cols; ++j)
            res[j * rows + i + 2] = mat[ind++]
    return res
}

export function determinant(mat: SquareMatrix): number {
    let luMatrix = toJaggedArray(mat)
    let result = decomposeFA(mat[0], mat[1], luMatrix)[1]
    for (let i = 0; i < luMatrix.length; ++i)
        result *= luMatrix[i][i]
    return result
}

export function invert<M extends SquareMatrix>(mat: M): M {
    let luMatrix = toJaggedArray(mat)
    let rows = luMatrix.length
    let result = ArrayExt.clone(luMatrix)
    let perm = decomposeFA(mat[0], mat[1], luMatrix)[0]
    let b = Array<number>(rows)
    for (let c = 0; c < rows; c++) {
        for (let r = 0; r < rows; r++)
            b[r] = c == perm[r] ? 1 : 0
        let x = helperSolvef(luMatrix, b)
        for (let r = 0; r < rows; r++)
            result[r][c] = x[r]
    }
    return <M>fromJaggedArray(result)
}

function toJaggedArray(mat: SquareMatrix): number[][] {
    let rows = mat[0], cols = mat[1]
    let res = new Array<number[]>(rows)
    for (let r = 0; r < rows; ++r) {
        res[r] = new Array<number>(cols)
        for (let c = 0; c < cols; ++c)
            res[r][c] = mat[c * rows + r + 2]
    }
    return res
}

function fromJaggedArray(array: number[][]): SquareMatrix {
    let rows = array.length
    let cols = array[0].length
    let res = create(rows, cols)
    let i = 2
    for (let c = 0; c < cols; ++c)
        for (let r = 0; r < rows; ++r)
            res[i++] = array[r][c]
    return <SquareMatrix>res
}

function decomposeFA(rows: number, cols: number, luMatrix: number[][]):
    [number[], number] {
    if (rows != cols)
        throw RangeError("Cannot decompose non-square matrix")
    // set up row permutation result
    let perm = Array<number>(rows)
    for (let i = 0; i < rows; ++i)
        perm[i] = i
    // toggle tracks row swaps. +1 -> even, -1 -> odd. used by MatrixDeterminant
    let toggle = 1
    for (let c = 0; c < cols - 1; c++) // each column
    {
        let colMax = Math.abs(luMatrix[c][c]) // find largest value in col j
        let pRow = c
        for (let r = c + 1; r < rows; r++)
            if (luMatrix[r][c] > colMax) {
                colMax = luMatrix[r][c]
                pRow = r
            }
        if (pRow != c) {
            // if largest value not on pivot, swap rows
            let rowPtr = luMatrix[pRow]
            luMatrix[pRow] = luMatrix[c]
            luMatrix[c] = rowPtr
            // and swap perm info
            let tmp = perm[pRow]
            perm[pRow] = perm[c]
            perm[c] = tmp
            // adjust the row-swap toggle
            toggle = -toggle
        }
        // handle the case where the input matrix is singular
        if (luMatrix[c][c] == 0)
            luMatrix[c][c] = 0.000001
        for (let r = c + 1; r < rows; r++) {
            luMatrix[r][c] /= luMatrix[c][c]
            for (let k = c + 1; k < cols; k++)
                luMatrix[r][k] -= luMatrix[r][c] * luMatrix[c][k]
        }
    }
    return [perm, toggle]
}

function helperSolvef(luMatrix: number[][], vector: number[]): number[] {
    // before calling this helper, permute b using the perm array from 
    // MatrixDecompose that generated luMatrix
    let rows = luMatrix.length
    let res = vector.slice()

    for (let r = 1; r < rows; r++) {
        let sum = res[r]
        for (let c = 0; c < r; c++)
            sum -= luMatrix[r][c] * res[c]
        res[r] = sum
    }
    res[rows - 1] /= luMatrix[rows - 1][rows - 1]
    for (let r = rows - 2; r >= 0; r--) {
        let sum = res[r]
        for (let c = r + 1; c < rows; c++)
            sum -= luMatrix[r][c] * res[c]
        res[r] = sum / luMatrix[r][r]
    }
    return res
}

export function equals<M extends Matrix>(mat: M, other: M): boolean {
    if (mat[0] != other[0] || mat[1] != other[1])
        return false
    let len = mat.length
    for (let i = 0; i < len; ++i)
        if (mat[i] != other[i])
            return false
    return true
}

export function approxEquals<M extends Matrix>(mat: M, other: M, 
    epsilon?: number): boolean {
    if (mat[0] != other[0] || mat[1] != other[1])
        return false
    let len = mat.length
    for (let i = 2; i < len; ++i)
        if (!FMath.approxEquals(mat[i], other[i], epsilon))
            return false
    return true
}

export function toString(mat: Matrix): string {
    let res = ""
    let rows = mat[0], cols = mat[1]
    for (let r = 0; r < rows; r++) {
        res += "[ "
        for (let c = 0; c < cols; c++)
            res += mat[c * rows + r + 2] + " "
        res += "]\n"
    }
    return res
}

export function toArray(mat: Matrix): number[] {
    return mat.slice(2)
}

export function toFloat32Array(mat: Matrix): Float32Array {
    return new Float32Array(mat.slice(2))
}