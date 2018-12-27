import * as FMath from "./fmath"
/**
 * Coordinate dimensions used in the vector types.
 */
export const x = 0;
export const y = 1;
export const z = 2;
export const w = 3;

/**
 * Vector is represented by an array of numbers.
 */
export type Vector = number[];

/**
 * Initialize a zero vector with dim components.
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
 * Return a copy of the input vector but with different dimension.
 * @param vec The input vector.
 * @param dim The dimension of the new vector.
 * @param pad The value used to pad the new vector, if dimension is greater
 * than originally.
 */
export function redim (vec: Vector, dim: number, pad: number = 1): Vector {
    let len = vec.length;
    let res = new Array(dim);
    for (let i = 0; i < dim; ++i)
        res[i] = i < len ? vec[i] : pad;
    return res;
}

/**
 * Returns the vector dimension, i.e. number of components.
 */
export function dimension(v: Vector): number {
    return v.length;
}

/**
 * Return one or more components of the vector in arbitrary order. The components
 * returned depend on the dimensions specified in the coords argument. Note that
 * the same component can occur multiple times in coords. So, it is valid to call
 * the function like this:
 * 
 * swizzle ([x, x, y])
 */
export function swizzle(v: Vector, ...coords: number[]): Vector {
    let len = coords.length;
    let res = new Array(len)
    for (let i = 0; i < len; ++i)
        res[i] = v[coords[i]]
    return res;
}

/**
 * The lenght of the vector squared. Faster to calculate than the actual length,
 * and useful for comparing vector magnitudes.
 */
export function lenSqr(v: Vector): number {
    let res = 0;
    let len = v.length;
    for (let i = 0; i < len; ++i)
        res += v[i] * v[i];
    return res;
}

/**
 * Length of the vector.
 */
export function len(v: Vector): number {
    return Math.sqrt(lenSqr(v))
}

/**
 * Invert a vector.
 * @param v Vector to be inverted.
 * @param out Result vector.
 */
export function inv(v: Vector, out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    for (let i = 0; i < len; ++i)
        out[i] = -v[i];
    return out;
}

/**
 * Add the second vector to the first one componentwise.
 * @param v Input vector.
 * @param other Vector or number to be added.
 * @param out Result vector.
 */
export function add(v: Vector, other: Vector | number, 
    out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    if (typeof other === 'number')
        for (let i = 0; i < len; ++i)
            out[i] = v[i] + other;
    else
        for (let i = 0; i < len; ++i)
            out[i] = v[i] + other[i];
    return out;
}

/**
 * Subtract the second vector from the first one componentwise.
 * @param v Input vector.
 * @param other Vector or number to be subtracted.
 * @param out Result vector.
 */
export function sub(v: Vector, other: Vector | number, 
    out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    if (typeof other === 'number')
        for (let i = 0; i < len; ++i)
            out[i] = v[i] - other;
    else
        for (let i = 0; i < len; ++i)
            out[i] = v[i] - other[i];
    return out;
}

/**
 * Multiply the first vector with the second one componentwise.
 * @param v Input vector.
 * @param other Multiplier vector or number.
 * @param out Result vector.
 */
export function mul(v: Vector, other: Vector | number, 
    out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    if (typeof other === 'number')
        for (let i = 0; i < len; ++i)
            out[i] = v[i] * other;
    else
        for (let i = 0; i < len; ++i)
            out[i] = v[i] * other[i];
    return out;
}

/**
 * Divide the first vector by the second one componentwise.
 * @param v Input vector.
 * @param other Divider vector or number.
 * @param out Result vector.
 */
export function div(v: Vector, other: Vector | number, 
    out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    if (typeof other === 'number')
        for (let i = 0; i < len; ++i)
            out[i] = v[i] / other;
    else
        for (let i = 0; i < len; ++i)
            out[i] = v[i] / other[i];
    return out;
}

/**
 * Normalize a vector.
 */
export function norm(v: Vector, out: Vector = new Array(v.length)): Vector {
    let l = len(v)
    if (l == 0)
        throw RangeError("Cannot normalize zero vector")
    let vlen = v.length;
    for (let i = 0; i < vlen; ++i)
        out[i] = v[i] / l;
    return out;
}

/**
 * Checks if the first vector is same as the second one.
 * @param v1 First vector
 * @param v2 Second vector
 */
export function equals(v1: Vector, v2: Vector): boolean {
    let len = v1.length;
    if (len != v2.length)
        return false;
    for (let i = 0; i < len; ++i)
        if (v1[i] != v2[i])
            return false;
    return true;
}

/**
 * Checks if the first vector is approximately same as the second one.
 * @param v1 First vector
 * @param v2 Second vector
 * @param epsilon The maximum allowed difference of any component.
 */
export function approxEquals(v1: Vector, v2: Vector, epsilon?: number): boolean {
    let len = v1.length;
    if (len != v2.length)
        return false;
    for (let i = 0; i < len; ++i)
        if (!FMath.approxEquals(v1[i], v2[i], epsilon))
            return false;
    return true;
}

/**
 * Return the dot product of two vectors.
 * @param v Input vector.
 * @param other Other vector of the dot product.
 */
export function dot(v: Vector, other: Vector): number {
    let res = 0;
    let len = v.length;
    for (let i = 0; i < len; ++i)
        res += v[i] * other[i]; 
    return res;
}

/**
 * Return the cross product of two vectors. The vectors must be 3-dimensional.
 * @param v Input vector.
 * @param other The other vector of the cross product.
 * @param out Result vector.
 */
export function cross(v: Vector, other: Vector, 
    out: Vector = new Array(v.length)): Vector {
    if (v.length != 3 || other.length != 3)
        throw RangeError(`Both vectors must 3-dimensional.`)
    out[x] = v[y] * other[z] - v[z] * other[y]
    out[y] = v[z] * other[x] - v[x] * other[z]
    out[z] = v[x] * other[y] - v[y] * other[x]
    return out;
}

/**
 * Replace components of the vector with their absolute values.
 * @param v Input vector.
 * @param out Result vector.
 */
export function abs(v: Vector, out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    for (let i = 0; i < len; ++i)
        out[i] = Math.abs(v[i]);
    return out;
}

/**
 * Run the components of the vector through Math.floor function.
 * @param v Input vector.
 * @param out Result vector.
 */
export function floor(v: Vector, out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    for (let i = 0; i < len; ++i)
        out[i] = Math.floor(v[i]);
    return out;
}

/**
 * Run the components of the vector through Math.ceil function.
 * @param v Input vector.
 * @param out Result vector.
 */
export function ceil(v: Vector, out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    for (let i = 0; i < len; ++i)
        out[i] = Math.ceil(v[i]);
    return out;
}

/**
 * Run the components of the vector through Math.round function.
 * @param v Input vector.
 * @param out Result vector.
 */
export function round(v: Vector, out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    for (let i = 0; i < len; ++i)
        out[i] = Math.round(v[i]);
    return out;
}

/**
 * Run the components of the vector through FMath.fract function.
 * @param v Input vector.
 * @param out Result vector.
 */
export function fract(v: Vector, out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    for (let i = 0; i < len; ++i)
        out[i] = FMath.fract(v[i]);
    return out;
}

/**
 * Calculate the minimum of two vectors componentwise.
 * @param v The input vector.
 * @param other The vector to compare with.
 * @param out Result vector.
 */
export function min(v: Vector, other: Vector, 
    out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    for (let i = 0; i < len; ++i)
        out[i] = Math.min(v[i], other[i]);
    return out;
}

/**
 * Calculate the maximum of two vectors componentwise.
 * @param v The input vector.
 * @param other The vector to compare with.
 * @param out Result vector.
 */
export function max(v: Vector, other: Vector, 
    out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    for (let i = 0; i < len; ++i)
        out[i] = Math.max(v[i], other[i]);
    return out;
}

/**
 * Clamp the components of a vector to a given range.
 * @param v The input vector.
 * @param min Minimum component value.
 * @param max Maximum component value.
 * @param out Result vector.
 */
export function clamp(v: Vector, min: number, max: number, 
    out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    for (let i = 0; i < len; ++i)
        out[i] = FMath.clamp(v[i], min, max);
    return out;
}

/**
 * Calculate the interpolated vector in a given position [0, 1].
 * @param v The input vector.
 * @param other The vector to be interpolated to.
 * @param interPos The position between 0 and 1, zero representing v and one other.
 * @param out Result vector.
 */
export function mix(v: Vector, other: Vector, interPos: number, 
    out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    for (let i = 0; i < len; ++i)
        out[i] = FMath.mix(v[i], other[i], interPos);
    return out;
}

/**
 * Return a vector of zeros and ones depending if the input vector components are 
 * greater or less than the edge value.
 * @param v The input vector.
 * @param edge The edge to which the components are compared.
 * @param out Result vector.
 */
export function step(v: Vector, edge: number, 
    out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    for (let i = 0; i < len; ++i)
        out[i] = FMath.step(v[i], edge);
    return out;
}

/**
 * Return a vector with components in range [0, 1] depending on how close the
 * input vector values are to the lower and upper edge value. If a component is 
 * less that lower edge it gets value 0. Conversely, if it is greater than the
 * upper edge, it gets value 1. If a component is between lower and upper edge, 
 * its value is smoothly interpolated between zero and one.
 * @param v The input vector.
 * @param edgeLower The lower edge to which the components are compared.
 * @param edgeUpper The upper edge to which the components are compared.
 * @param out Result vector.
 */
export function smoothStep(v: Vector, edgeLower: number, edgeUpper: number, 
    out: Vector = new Array(v.length)): Vector {
    let len = v.length;
    for (let i = 0; i < len; ++i)
        out[i] = FMath.smoothStep(v[i], edgeLower, edgeUpper);
    return out;
}

/**
 * Returns the string representation of a vector formatted like this: [x y z]
 */
export function toString(v: Vector): string {
    return "[" + v.join(" ") + "]"
}