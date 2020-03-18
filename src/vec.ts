import * as FMath from "./fmath"
/**
 * Coordinate dimensions used in the vector types.
 */
export const x = 0
export const y = 1
export const z = 2
export const w = 3

/**
 * A vector is represented by an array of numbers. The length of the array
 * determines the vector's dimension.
 */
export type Vec2 = [number, number]
export type Vec3 = [number, number, number]
export type Vec4 = [number, number, number, number]
export type Vector = Vec2 | Vec3 | Vec4

/**
 * Create a vector of the scpecified dimension with all of its components 
 * initialized to zero.
 * @param dim Vector dimension.
 */
export function zero<V extends Vector>(dim: number): V {
    return unif(dim, 0)
}

/**
 * Initializes a vector with the same value in all components.
 * @param dim Vector dimension.
 * @param value Value for components.
 */
export function unif<V extends Vector>(dim: number, value: number): V {
    return <V>new Array<number>(dim).fill(value)
}

/**
 * Return a copy of the input vector in different dimension. Resizes the
 * vector and fills possible new components with the specified padding value.
 * @param vec The input vector.
 * @param dim The dimension of the new vector.
 * @param pad The value used to pad the new vector, if dimension is greater
 * than originally.
 */
export function redim<V extends Vector>(vec: Vector, dim: number,
    pad: number = 1): V {
    let res = new Array(dim)
    for (let i = 0; i < dim; ++i)
        res[i] = vec[i] || pad
    return <V>res
}

/**
 * Returns the vector's dimension, i.e. its number of components.
 */
export function dimension(vec: Vector): number {
    return vec.length
}

/**
 * Return one or more components of the vector in arbitrary order. The components
 * returned depend on the dimensions specified in the coords argument. Note that
 * the same component can occur multiple times in coords. So, it is valid to call
 * the function like this:
 * 
 * swizzle ([x, x, y])
 */
export function swizzle<V extends Vector>(vec: Vector, ...coords: number[]): V {
    let len = coords.length
    let res = new Array(len)
    for (let i = 0; i < len; ++i)
        res[i] = vec[coords[i]]
    return <V>res
}

/**
 * Return the lenght of a vector squared. This is faster to calculate than the
 * actual length since taking the square root is omitted. The value is useful 
 * for comparing vectors' magnitudes.
 */
export function lenSqr(vec: Vector): number {
    let res = 0
    let len = vec.length
    for (let i = 0; i < len; ++i)
        res += vec[i] * vec[i]
    return res
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
export function inv<V extends Vector>(vec: V,
    out: V = <V>new Array(vec.length)): V {
    let len = vec.length
    for (let i = 0; i < len; ++i)
        out[i] = -vec[i]
    return out
}

/**
 * Add a vector or scalar to the input vector componentwise.
 * @param vec Input vector.
 * @param other Vector or scalar to be added.
 * @param out Result vector.
 */
export function add<V extends Vector>(vec: V, other: V | number,
    out: V = <V>new Array(vec.length)): V {
    let len = vec.length
    if (typeof other === 'number')
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] + other
    else 
       for (let i = 0; i < len; ++i)
            out[i] = vec[i] + other[i]
    return out
}

/**
 * Subtract a vector or scalar from the input vector componentwise.
 * @param vec Input vector.
 * @param other Vector or scalar to be subtracted.
 * @param out Result vector.
 */
export function sub<V extends Vector>(vec: V, other: V | number,
    out: V = <V>new Array(vec.length)): V {
    let len = vec.length
    if (typeof other === 'number')
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] - other
    else 
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] - other[i]
    return out
}

/**
 * Multiply the input vector componentwise with another vector or scalar.
 * @param vec Input vector.
 * @param other Multiplier vector or scalar.
 * @param out Result vector.
 */
export function mul<V extends Vector>(vec: V, other: V | number,
    out: V = <V>new Array(vec.length)): V {
    let len = vec.length
    if (typeof other === 'number')
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] * other
    else 
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] * other[i]
    return out
}

/**
 * Divide the input vector by another vector or scalar componentwise.
 * @param vec Input vector.
 * @param other Divider vector or number.
 * @param out Result vector.
 */
export function div<V extends Vector>(vec: V, other: V | number,
    out: V = <V>new Array(vec.length)): V {
    let len = vec.length
    if (typeof other === 'number')
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] / other
    else 
        for (let i = 0; i < len; ++i)
            out[i] = vec[i] / other[i]
    return out
}

/**
 * Normalize a vector by dividing its components by its length. If the 
 * vector's lenght is zero, meaning that all of its components are zero, then
 * the function throws an error.
 */
export function norm<V extends Vector>(vec: V,
    out: V = <V>new Array(vec.length)): V {
    let l = len(vec)
    let vlen = vec.length
    for (let i = 0; i < vlen; ++i)
        out[i] = vec[i] / l
    return out
}

/**
 * Checks if two vectors are equal, i.e. they have the same dimension and 
 * exactly same component values.
 * @param vec1 First vector
 * @param vec2 Second vector
 */
export function equals<V extends Vector>(vec1: V, vec2: V): boolean {
    let len = vec1.length
    for (let i = 0; i < len; ++i)
        if (vec1[i] != vec2[i])
            return false
    return true
}

/**
 * Checks if two vectors are approximately equal. They must have the same 
 * dimension, but their components can deviate by the amount specified in the 
 * epsilon parameter.
 * @param vec1 First vector
 * @param vec2 Second vector
 * @param epsilon The maximum allowed difference of any component.
 */
export function approxEquals<V extends Vector>(vec1: V, vec2: V,
    epsilon?: number): boolean {
    let len = vec1.length
    for (let i = 0; i < len; ++i)
        if (!FMath.approxEquals(vec1[i], vec2[i], epsilon))
            return false
    return true
}

/**
 * Return the dot product of two vectors. The vectors must have the same dimension,
 * otherwise an error is thrown. The result of the dot product is a scalar.
 * @param vec Input vector.
 * @param other Other vector of the dot product.
 */
export function dot<V extends Vector>(vec: V, other: V): number {
    let res = 0
    let len = vec.length
    for (let i = 0; i < len; ++i)
        res += vec[i] * other[i]
    return res
}

/**
 * Return the cross product of two vectors. The vectors must be 3-dimensional.
 * @param vec Input vector.
 * @param other The other vector of the cross product.
 * @param out Result vector.
 */
export function cross(vec: Vec3, other: Vec3,
    out: Vec3 = <Vec3>new Array(3)): Vec3 {
    out[x] = vec[y] * other[z] - vec[z] * other[y]
    out[y] = vec[z] * other[x] - vec[x] * other[z]
    out[z] = vec[x] * other[y] - vec[y] * other[x]
    return out
}

/**
 * Run the components of the vector through the {@link Math.abs} function.
 * @param vec Input vector.
 */
export function abs<V extends Vector>(vec: V): V {
    return <V>vec.map(Math.abs)
}

/**
 * Run the components of the vector through the {@link Math.floor} function.
 * @param vec Input vector.
 */
export function floor<V extends Vector>(vec: V): V {
    return <V>vec.map(Math.floor)
}

/**
 * Run the components of the vector through the {@link Math.ceil} function.
 * @param vec Input vector.
 */
export function ceil<V extends Vector>(vec: V): V {
    return <V>vec.map(Math.ceil)
}

/**
 * Run the components of the vector through the {@link Math.round} function.
 * @param vec Input vector.
 */
export function round<V extends Vector>(vec: V): V {
    return <V>vec.map(Math.round)
}

/**
 * Run the components of the vector through the {@link FMath.fract} function.
 * @param vec Input vector.
 */
export function fract<V extends Vector>(vec: V): V {
    return <V>vec.map(FMath.fract)
}

/**
 * Calculate the minimum of two vectors componentwise.
 * @param vec The input vector.
 * @param other The vector to compare with.
 * @param out Result vector.
 */
export function min<V extends Vector>(vec: V, other: V,
    out = <V>new Array(vec.length)): V {
    let len = vec.length
    for (let i = 0; i < len; ++i)
        out[i] = Math.min(vec[i], other[i])
    return out
}

/**
 * Calculate the maximum of two vectors componentwise.
 * @param vec The input vector.
 * @param other The vector to compare with.
 * @param out Result vector.
 */
export function max<V extends Vector>(vec: V, other: V,
    out = <V>new Array(vec.length)): V {
    let len = vec.length
    for (let i = 0; i < len; ++i)
        out[i] = Math.max(vec[i], other[i])
    return out
}

/**
 * Clamp the components of a vector to a given range.
 * @param vec The input vector.
 * @param min Minimum component value.
 * @param max Maximum component value.
 * @param out Result vector.
 */
export function clamp<V extends Vector>(vec: V, min: number, max: number,
    out = <V>new Array(vec.length)): V {
    let len = vec.length
    for (let i = 0; i < len; ++i)
        out[i] = FMath.clamp(vec[i], min, max)
    return out
}

/**
 * Calculate the interpolated vector in a given position [0, 1].
 * @param vec The input vector.
 * @param other The vector to be interpolated to.
 * @param interPos The position between 0 and 1, zero representing v and one other.
 * @param out Result vector.
 */
export function mix<V extends Vector>(vec: V, other: V, interPos: number,
    out = <V>new Array(vec.length)): V {
    let len = vec.length
    for (let i = 0; i < len; ++i)
        out[i] = FMath.mix(vec[i], other[i], interPos)
    return out
}

/**
 * Return a vector of zeros and ones depending if the input vector components are 
 * greater or less than the edge value.
 * @param vec The input vector.
 * @param edge The edge to which the components are compared.
 * @param out Result vector.
 */
export function step<V extends Vector>(vec: V, edge: number,
    out = <V>new Array(vec.length)): V {
    let len = vec.length
    for (let i = 0; i < len; ++i)
        out[i] = FMath.step(vec[i], edge)
    return out
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
export function smoothStep<V extends Vector>(vec: V, edgeLower: number,
    edgeUpper: number, out = <V>new Array(vec.length)): V {
    let len = vec.length 
    for (let i = 0; i < len; ++i)
        out[i] = FMath.smoothStep(vec[i], edgeLower, edgeUpper)
    return out
}

/**
 * Returns the string representation of a vector formatted like this: [x y z]
 */
export function toString(vec: Vector): string {
    return "[" + vec.join(" ") + "]"
}