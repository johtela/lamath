"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FMath = require("./FMath");
const ArrayHelper = require("./ArrayExt");
class NewArrayMat {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
    }
    identityArray() {
        let { rows: r, cols: c } = this;
        let arr = ArrayHelper.fill(Array(r * c), 0);
        for (let i = 0; i < Math.min(r, c); i++)
            arr[i * r + i] = 1;
        return arr;
    }
    get zero() {
        let { rows: r, cols: c } = this;
        return new ArrayMat(ArrayHelper.fill(Array(r * c), 0), r, c);
    }
    get identity() {
        return new ArrayMat(this.identityArray(), this.rows, this.cols);
    }
    translation(offsets) {
        let { rows: r, cols: c } = this;
        let res = this.identityArray();
        let lastCol = c - 1;
        for (let i = 0; i < Math.min(offsets.length, r - 1); i++)
            res[lastCol * r + i] = offsets[i];
        return new ArrayMat(res, r, c);
    }
    scaling(factors) {
        let { rows: r, cols: c } = this;
        let res = this.identityArray();
        for (let i = 0; i < Math.min(factors.length, r, c); i++)
            res[i * r + i] = factors[i];
        return new ArrayMat(res, r, c);
    }
    rotationX(angle) {
        let { rows: r, cols: c } = this;
        if (r < 3 || c < 3)
            throw RangeError(`Rotation around X-axis not defined for ${r}x${c} matrix.`);
        let res = this.identityArray();
        let sina = Math.sin(angle);
        let cosa = Math.cos(angle);
        res[r + 1] = cosa;
        res[r + 2] = sina;
        res[2 * r + 1] = -sina;
        res[2 * r + 2] = cosa;
        return new ArrayMat(res, r, c);
    }
    rotationY(angle) {
        let { rows: r, cols: c } = this;
        if (r < 3 || c < 3)
            throw RangeError(`Rotation around Y-axis not defined for ${r}x${c} matrix.`);
        let res = this.identityArray();
        let sina = Math.sin(angle);
        let cosa = Math.cos(angle);
        res[0] = cosa;
        res[2] = -sina;
        res[2 * r] = sina;
        res[2 * r + 2] = cosa;
        return new ArrayMat(res, r, c);
    }
    rotationZ(angle) {
        let { rows: r, cols: c } = this;
        let res = this.identityArray();
        let sina = Math.sin(angle);
        let cosa = Math.cos(angle);
        res[0] = cosa;
        res[1] = sina;
        res[r] = -sina;
        res[r + 1] = cosa;
        return new ArrayMat(res, r, c);
    }
    perspective(left, right, bottom, top, zNear, zFar) {
        if (zNear <= 0 || zNear >= zFar)
            throw RangeError("zNear needs to be positive and smaller thatn zFar");
        let width = right - left;
        let height = top - bottom;
        let depth = zFar - zNear;
        return new ArrayMat([(2.0 * zNear) / width, 0, 0, 0,
            0, (2.0 * zNear) / height, 0, 0,
            (right + left) / width, (top + bottom) / height, -(zFar + zNear) / depth, -1,
            0, 0, -(2.0 * zFar * zNear) / depth, 0], 4, 4);
    }
    orthographic(left, right, bottom, top, zNear, zFar) {
        let invWidth = 1.0 / (right - left);
        let invHeight = 1.0 / (top - bottom);
        let invDepth = 1.0 / (zFar - zNear);
        return new ArrayMat([2 * invWidth, 0, 0, 0,
            0, 2 * invHeight, 0, 0,
            0, 0, -2 * invDepth, 0,
            -(right + left) * invWidth, -(top + bottom) * invHeight, -(zFar + zNear) * invDepth, 1], 4, 4);
    }
    lookAt(direction, up) {
        let zaxis = direction.inv().norm();
        let xaxis = up.cross(zaxis).norm();
        let yaxis = zaxis.cross(xaxis);
        return new ArrayMat([xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            0, 0, 0, 1], 4, 4);
    }
    fromArray(array, rows, cols) {
        return new ArrayMat(array, rows, cols);
    }
}
exports.newMat2 = new NewArrayMat(2, 2);
exports.newMat3 = new NewArrayMat(3, 3);
exports.newMat4 = new NewArrayMat(4, 4);
class ArrayMat {
    constructor(array, rows, cols) {
        this.array = array;
        this.rows = rows;
        this.cols = cols;
        if (array.length !== rows * cols)
            throw RangeError("Array length has to be equal to rows * columns.");
    }
    element(row, column) {
        return this.array[column * this.rows + row];
    }
    map(oper) {
        return new ArrayMat(this.array.map(v => oper(v)), this.cols, this.rows);
    }
    map2(other, oper) {
        if (this.cols != other.cols || this.rows != other.rows)
            throw RangeError("Matrix dimensions must match.");
        return new ArrayMat(this.array.map((v, i) => oper(v, other.array[i])), this.cols, this.rows);
    }
    matrixMultiply(other) {
        let n = this.rows;
        let m = this.cols;
        let q = other.rows;
        let p = other.cols;
        if (m !== q)
            throw RangeError(`Cannot multiply ${n}x${m} matrix with ${q}x${p} matrix.`);
        let res = Array(n * p);
        // Iterate through rows and columns
        for (let i = 0; i < n; i++)
            for (let j = 0; j < p; j++) {
                // Sum up rows from this with columns from other matrix.
                let val = 0;
                for (let k = 0; k < m; k++)
                    val += this.array[k * n + i] * other.array[j * q + k];
                res[j * n + i] = val;
            }
        return new ArrayMat(res, n, p);
    }
    add(other) {
        return other instanceof ArrayMat ?
            this.map2(other, (x, y) => x + y) :
            this.map(x => x + other);
    }
    sub(other) {
        return other instanceof ArrayMat ?
            this.map2(other, (x, y) => x - y) :
            this.map(x => x - other);
    }
    mul(other) {
        return other instanceof ArrayMat ?
            this.matrixMultiply(other) :
            this.map(x => x * other);
    }
    transform(vec) {
        let arr = [...vec.toArray(), 1, 1].slice(0, this.cols);
        let vecm = new ArrayMat(arr, this.cols, 1);
        return vec.newVec().fromArray(this.matrixMultiply(vecm).array);
    }
    transpose() {
        let rows = this.cols;
        let cols = this.rows;
        let res = Array(this.array.length);
        let ind = 0;
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++)
                res[j * rows + i] = this.array[ind++];
        return new ArrayMat(res, rows, cols);
    }
    determinant() {
        return this.determinantFA();
    }
    invert() {
        return ArrayMat.fromJaggedArray(this.inverseFA());
    }
    toJaggedArray() {
        let { rows, cols, array } = this;
        let res = Array(rows);
        for (let r = 0; r < rows; r++) {
            res[r] = Array(cols);
            for (let c = 0; c < cols; c++)
                res[r][c] = array[c * rows + r];
        }
        return res;
    }
    static fromJaggedArray(matrix) {
        let rows = matrix.length;
        let cols = matrix[0].length;
        let arr = Array(cols * rows);
        let i = 0;
        for (let c = 0; c < cols; c++)
            for (let r = 0; r < rows; r++)
                arr[i++] = matrix[r][c];
        return new ArrayMat(arr, rows, cols);
    }
    decomposeFA(matrix) {
        let { rows, cols } = this;
        if (rows != cols)
            throw RangeError("Cannot decompose non-square matrix");
        // set up row permutation result
        let perm = Array(rows);
        for (let i = 0; i < rows; i++)
            perm[i] = i;
        // toggle tracks row swaps. +1 -> even, -1 -> odd. used by MatrixDeterminant
        let toggle = 1;
        for (let c = 0; c < cols - 1; c++) // each column
         {
            let colMax = Math.abs(matrix[c][c]); // find largest value in col j
            let pRow = c;
            for (let r = c + 1; r < rows; r++)
                if (matrix[r][c] > colMax) {
                    colMax = matrix[r][c];
                    pRow = r;
                }
            if (pRow != c) {
                // if largest value not on pivot, swap rows
                let rowPtr = matrix[pRow];
                matrix[pRow] = matrix[c];
                matrix[c] = rowPtr;
                // and swap perm info
                let tmp = perm[pRow];
                perm[pRow] = perm[c];
                perm[c] = tmp;
                // adjust the row-swap toggle
                toggle = -toggle;
            }
            // handle the case where the input matrix is singular
            if (matrix[c][c] == 0)
                matrix[c][c] = 0.000001;
            for (let r = c + 1; r < rows; r++) {
                matrix[r][c] /= matrix[c][c];
                for (let k = c + 1; k < cols; k++)
                    matrix[r][k] -= matrix[r][c] * matrix[c][k];
            }
        }
        return [perm, toggle];
    }
    determinantFA() {
        let matrix = this.toJaggedArray();
        let result = this.decomposeFA(matrix)[1];
        for (let i = 0; i < matrix.length; i++)
            result *= matrix[i][i];
        return result;
    }
    inverseFA() {
        let matrix = this.toJaggedArray();
        let rows = matrix.length;
        let result = ArrayHelper.clone(matrix);
        let perm = this.decomposeFA(matrix)[0];
        let b = Array(rows);
        for (let c = 0; c < rows; c++) {
            for (let r = 0; r < rows; r++)
                b[r] = c == perm[r] ? 1 : 0;
            let x = ArrayMat.helperSolvef(matrix, b);
            for (let r = 0; r < rows; r++)
                result[r][c] = x[r];
        }
        return result;
    }
    static helperSolvef(luMatrix, vector) {
        // before calling this helper, permute b using the perm array from 
        // MatrixDecompose that generated luMatrix
        let rows = luMatrix.length;
        let res = vector.slice();
        for (let r = 1; r < rows; r++) {
            let sum = res[r];
            for (let c = 0; c < r; c++)
                sum -= luMatrix[r][c] * res[c];
            res[r] = sum;
        }
        res[rows - 1] /= luMatrix[rows - 1][rows - 1];
        for (let r = rows - 2; r >= 0; r--) {
            let sum = res[r];
            for (let c = r + 1; c < rows; c++)
                sum -= luMatrix[r][c] * res[c];
            res[r] = sum / luMatrix[r][r];
        }
        return res;
    }
    equals(other) {
        return this.array.every(function (v, i, a) {
            return v === other.array[i];
        });
    }
    approxEquals(other, epsilon) {
        return this.array.every(function (v, i, a) {
            return FMath.approxEquals(v, other.array[i], epsilon);
        });
    }
    toString() {
        let res = "";
        for (let r = 0; r < this.rows; r++) {
            res += "[ ";
            for (let c = 0; c < this.cols; c++)
                res += this.element(r, c) + " ";
            res += "]\n";
        }
        return res;
    }
    toArray() {
        return this.array;
    }
    toFloat32Array() {
        return new Float32Array(this.array);
    }
    toMat2() {
        return new ArrayMat([
            ...this.array.slice(0, 2),
            ...this.array.slice(this.rows, this.rows + 2)
        ], 2, 2);
    }
    toMat3() {
        switch (this.rows) {
            case 2: return new ArrayMat([
                ...this.array.slice(0, 2), 0,
                ...this.array.slice(2, 4), 0,
                0, 0, 1
            ], 3, 3);
            case 4: return new ArrayMat([
                ...this.array.slice(0, 3),
                ...this.array.slice(4, 7),
                ...this.array.slice(8, 11)
            ], 3, 3);
            default: throw Error("Unsupported conversion.");
        }
    }
    toMat4() {
        switch (this.rows) {
            case 2: return new ArrayMat([
                ...this.array.slice(0, 2), 0, 0,
                ...this.array.slice(2, 4), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ], 4, 4);
            case 3: return new ArrayMat([
                ...this.array.slice(0, 3), 0,
                ...this.array.slice(3, 7), 0,
                ...this.array.slice(7, 10), 0,
                0, 0, 0, 1
            ], 4, 4);
            default: throw Error("Unsupported conversion.");
        }
    }
}
