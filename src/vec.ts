import * as FMath from "./fmath"
/**
 * Coordinate dimensions used in the vector types.
 */
export const x = 0;
export const y = 1;
export const z = 2;
export const w = 3;

const dimMismatch = "Vectors must have same dimensions";

/**
 * A vector is represented by an array of numbers. The length of the array
 * determines the vector's dimension.
 */
export type Vector = number[];

/**
 * Create a vector of the scpecified dimension with all of its components 
 * initialized to zero.
 * @param dim Vector dimension.
 */
export function zero(dim: number): Vector {
    return unif(dim, 0);
}

/**
 * Initializes a vector with the same value in all components.
 * @param dim Vector dimension.
 * @param value Value for components.
 */
export function unif(dim: number, value: number): Vector {
    return new Array<number>(dim).fill(value);
}

/**
 * Return a copy of the input vector in different dimension. Resizes the
 * vector and fills possible new components with the specified padding value.
 * @param vec The input vector.
 * @param dim The dimension of the new vector.
 * @param pad The value used to pad the new vector, if dimension is greater
 * than originally.
 */
export function redim(vec: Vector, dim: number, pad: number = 1): Vector {
    let res = new Array(dim);
    for (let i = 0; i < dim; ++i)
        res[i] = vec[i] || pad;
    return res;
}

/**
 * Returns the vector's dimension, i.e. its number of components.
 */
export function dimension(vec: Vector): number {
    return vec.length;
}

/**
 * Return one or more components of the vector in arbitrary order. The components
 * returned depend on the dimensions specified in the coords argument. Note that
 * the same component can occur multiple times in coords. So, it is valid to call
 * the function like this:
 * 
 * swizzle ([x, x, y])
 */
export function swizzle(vec: Vector, ...coords: number[]): Vector {
    let len = coords.length;
    let res = new Array(len)
    for (let i = 0; i < len; ++i)
        res[i] = vec[coords[i]]
    return res;
}

/**
 * Return the lenght of a vector squared. This is faster to calculate than the
 * actual length since taking the square root is omitted. The value is useful 
 * for comparing vectors' magnitudes.
 */
export function lenSqr(vec: Vector): number {
    let res = 0;
    let len = vec.length;
    for (let i = 0; i < len; ++i)
        res += vec[i] * vec[i];
    return res;
}

/**
 * Return the length of a vector.
 */
export function len(vec: Vector): number {
    return Math.sqrt(lenSqr(vec))
}

/**
 * Invert a vector, i.e. flip the signs of all its components.
 * @param vec Vector to be inverted.
 * @param out Result vector.
 */
export function inv(vec: Vector, out: Vector = new Array(vec.length)): Vector {
    let len = vec.length;
    for (let i = 0; i < len; ++i)
        out[i] = -vec[i];
    return out;
}

/**
 * Add a vector or scalar to the input vector componentwise.
 * @param vec Input vector.
 * @param other Vector or scalar to be added.
 * @param out Result vector.
 */
export function add(vec: Vector, other: Vector | number,
    out: Vector = new Array(vec.length)): Vector {
    let len = vec.length;
    if (typeof other === 'number')
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] + other;
    else {
        if (other.length != len)
            throw RangeError(dimMismatch);
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] + other[i];
    }
    return out;
}

/**
 * Subtract a vector or scalar from the input vector componentwise.
 * @param vec Input vector.
 * @param other Vector or scalar to be subtracted.
 * @param out Result vector.
 */
export function sub(vec: Vector, other: Vector | number,
    out: Vector = new Array(vec.length)): Vector {
    let len = vec.length;
    if (typeof other === 'number')
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] - other;
    else {
        if (other.length != len)
            throw RangeError(dimMismatch);
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] - other[i];
    }
    return out;
}

/**
 * Multiply the input vector componentwise with another vector or scalar.
 * @param vec Input vector.
 * @param other Multiplier vector or scalar.
 * @param out Result vector.
 */
export function mul(vec: Vector, other: Vector | number,
    out: Vector = new Array(vec.length)): Vector {
    let len = vec.length;
    if (typeof other === 'number')
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] * other;
    else {
        if (other.length != len)
            throw RangeError(dimMismatch);
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] * other[i];
    }
    return out;
}

/**
 * Divide the input vector by another vector or scalar componentwise.
 * @param vec Input vector.
 * @param other Divider vector or number.
 * @param out Result vector.
 */
export function div(vec: Vector, other: Vector | number,
    out: Vector = new Array(vec.length)): Vector {
    let len = vec.length;
    if (typeof other === 'number')
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] / other;
    else {
        if (other.length != len)
            throw RangeError(dimMismatch);
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] / other[i];
    }
    return out;
}

/**
 * Normalize a vector by dividing its components by its length. If the 
 * vector's lenght is zero, meaning that all of its components are zero, then
 * the function throws an error.
 */
export function norm(vec: Vector, out: Vector = new Array(vec.length)): Vector {
    let l = len(vec)
    if (l == 0)
        throw RangeError("Cannot normalize zero vector")
    let vlen = vec.length;
    for (let i = 0; i < vlen; ++i)
        out[i] = vec[i] / l;
    return out;
}

/**
 * Checks if two vectors are equal, i.e. they have the same dimension and 
 * exactly same component values.
 * @param vec1 First vector
 * @param vec2 Second vector
 */
export function equals(vec1: Vector, vec2: Vector): boolean {
    let len = vec1.length;
    if (len != vec2.length)
        return false;
    for (let i = 0; i < len; ++i)
        if (vec1[i] != vec2[i])
            return false;
    return true;
}

/**
 * Checks if two vectors are approximately equal. They must have the same dimension,
 * but their components can deviate by the amount specified inthe epsilon parameter.
 * @param vec1 First vector
 * @param vec2 Second vector
 * @param epsilon The maximum allowed difference of any component.
 */
export function approxEquals(vec1: Vector, vec2: Vector, epsilon?: number): boolean {
    let len = vec1.length;
    if (len != vec2.length)
        return false;
    for (let i = 0; i < len; ++i)
        if (!FMath.approxEquals(vec1[i], vec2[i], epsilon))
            return false;
    return true;
}

/**
 * Return the dot product of two vectors. The vectors must have the same dimension,
 * otherwise an error is thrown. The result of the dot product is a scalar.
 * @param vec Input vector.
 * @param other Other vector of the dot product.
 */
export function dot(vec: Vector, other: Vector): number {
    let res = 0;
    let len = vec.length;
    if (other.length != len)
        throw RangeError(dimMismatch);
    for (let i = 0; i < len; ++i)
        res += vec[i] * other[i];
    return res;
}

/**
 * Return the cross product of two vectors. The vectors must be 3-dimensional.
 * @param vec Input vector.
 * @param other The other vector of the cross product.
 * @param out Result vector.
 */
export function cross(vec: Vector, other: Vector,
    out: Vector = new Array(3)): Vector {
    if (vec.length != 3 || other.length != 3)
        throw RangeError(`Both vectors must 3-dimensional.`)
    out[x] = vec[y] * other[z] - vec[z] * other[y]
    out[y] = vec[z] * other[x] - vec[x] * other[z]
    out[z] = vec[x] * other[y] - vec[y] * other[x]
    return out;
}

/**
 * Run the components of the vector through the {@link Math.abs} function.
 * @param vec Input vector.
 */
export function abs(vec: Vector): Vector {
    return vec.map(Math.abs);
}

/**
 * Run the components of the vector through the {@link Math.floor} function.
 * @param vec Input vector.
 */
export function floor(vec: Vector): Vector {
    return vec.map(Math.floor);
}

/**
 * Run the components of the vector through the {@link Math.ceil} function.
 * @param vec Input vector.
 */
export function ceil(vec: Vector): Vector {
    return vec.map(Math.floor);
}

/**
 * Run the components of the vector through the {@link Math.round} function.
 * @param vec Input vector.
 */
export function round(vec: Vector): Vector {
    return vec.map(Math.round);
}

/**
 * Run the components of the vector through the {@link FMath.fract} function.
 * @param vec Input vector.
 */
export function fract(vec: Vector): Vector {
    return vec.map(FMath.fract);
}

/**
 * Calculate the minimum of two vectors componentwise.
 * @param vec The input vector.
 * @param other The vector to compare with.
 * @param out Result vector.
 */
export function min(vec: Vector, other: Vector,
    out: Vector = new Array(vec.length)): Vector {
    let len = vec.length;
    if (other.length != len)
        throw RangeError(dimMismatch);
    for (let i = 0; i < len; ++i)
        out[i] = Math.min(vec[i], other[i]);
    return out;
}

/**
 * Calculate the maximum of two vectors componentwise.
 * @param vec The input vector.
 * @param other The vector to compare with.
 * @param out Result vector.
 */
export function max(vec: Vector, other: Vector,
    out: Vector = new Array(vec.length)): Vector {
    let len = vec.length;
    if (other.length != len)
        throw RangeError(dimMismatch);
    for (let i = 0; i < len; ++i)
        out[i] = Math.max(vec[i], other[i]);
    return out;
}

/**
 * Clamp the components of a vector to a given range.
 * @param vec The input vector.
 * @param min Minimum component value.
 * @param max Maximum component value.
 * @param out Result vector.
 */
export function clamp(vec: Vector, min: number, max: number,
    out: Vector = new Array(vec.length)): Vector {
    let len = vec.length;
    for (let i = 0; i < len; ++i)
        out[i] = FMath.clamp(vec[i], min, max);
    return out;
}

/**
 * Calculate the interpolated vector in a given position [0, 1].
 * @param vec The input vector.
 * @param other The vector to be interpolated to.
 * @param interPos The position between 0 and 1, zero representing v and one other.
 * @param out Result vector.
 */
export function mix(vec: Vector, other: Vector, interPos: number,
    out: Vector = new Array(vec.length)): Vector {
    let len = vec.length;
    if (other.length != len)
        throw RangeError(dimMismatch);
    for (let i = 0; i < len; ++i)
        out[i] = FMath.mix(vec[i], other[i], interPos);
    return out;
}

/**
 * Return a vector of zeros and ones depending if the input vector components are 
 * greater or less than the edge value.
 * @param vec The input vector.
 * @param edge The edge to which the components are compared.
 * @param out Result vector.
 */
export function step(vec: Vector, edge: number,
    out: Vector = new Array(vec.length)): Vector {
    let len = vec.length;
    for (let i = 0; i < len; ++i)
        out[i] = FMath.step(vec[i], edge);
    return out;
}

/**
 * Return a vector with components in range [0, 1] depending on how close the
 * input vector values are to the lower and upper edge value. If a component is 
 * less that lower edge it gets value 0. Conversely, if it is greater than the
 * upper edge, it gets value 1. If a component is between lower and upper edge, 
 * its value is smoothly interpolated between zero and one.
 * @param vec The input vector.
 * @param edgeLower The lower edge to which the components are compared.
 * @param edgeUpper The upper edge to which the components are compared.
 * @param out Result vector.
 */
export function smoothStep(vec: Vector, edgeLower: number, edgeUpper: number,
    out: Vector = new Array(vec.length)): Vector {
    let len = vec.length;
    for (let i = 0; i < len; ++i)
        out[i] = FMath.smoothStep(vec[i], edgeLower, edgeUpper);
    return out;
}

/**
 * Returns the string representation of a vector formatted like this: [x y z]
 */
export function toString(vec: Vector): string {
    return "[" + vec.join(" ") + "]"
}