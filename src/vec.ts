import * as FMath from "./fmath"
/**
 * Enumeration that defines the coordinate dimensions used in the vector types.
 */
export enum Dim {
    x = 0,
    y = 1,
    z = 2,
    w = 3
}

export type Vector = number[];

/** 
 * Base interface for all vectory types. Defines methods that have the same signature
 * in all vector variants.
 */
export module Vec {
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
    export function unif(dim: number, value: number) {
        return new Array<number>(dim).fill(value);
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
     * swizzle ([Dim.x, Dim.x, Dim.y])
     */
    export function swizzle(v: Vector, ...coords: Dim[]): Vector {
        var res = new Array(coords.length)
        for (var i = 0; i < res.length; i++)
            res[i] = v[coords[i]]
        return Object.seal(res);
    }
    /**
     * The lenght of the vector squared. Faster to calculate than the actual length,
     * and useful for comparing vector magnitudes.
     */
    export function lenSqr(v: Vector): number {
        return v.reduce((a, x) => a + (x * x))
    }
    /**
     * Length of the vector.
     */
    export function len(v: Vector): number {
        return Math.sqrt(lenSqr(v))
    }
    /**
     * Invert a vector in-place.
     * @param v Vector to be inverted.
     */
    export function inv(v: Vector): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] = -v[i];
        return v;
    }
    /**
     * Add the second vector to the first one componentwise.
     * @param v Input and result vector.
     * @param other Vector or number to be added.
     */
    export function add(v: Vector, other: Vector | number): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] += typeof other === 'number' ? other : other[i]
        return v;
    }
    /**
     * Subtract the second vector from the first one componentwise.
     * @param v Input and result vector.
     * @param other Vector or number to be subtracted.
     */
    export function sub(v: Vector, other: Vector | number): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] -= typeof other === 'number' ? other : other[i]
        return v;
    }
    /**
     * Multiply the first vector with the second one componentwise.
     * @param v Input and result vector.
     * @param other Multiplier vector or number.
     */
    export function mul(v: Vector, other: Vector | number): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] *= typeof other === 'number' ? other : other[i]
        return v;
    }
    /**
     * Divide the first vector by the second one componentwise.
     * @param v Input and result vector.
     * @param other Divider vector or number.
     */
    export function div(v: Vector, other: Vector | number): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] /= typeof other === 'number' ? other : other[i]
        return v;
    }
    /**
     * Normalize a vector in-place.
     */
    export function norm(v: Vector): Vector {
        let l = len(v)
        if (l == 0)
            throw RangeError("Cannot normalize zero vector")
        for (let i = 0; i < v.length; i++)
            v[i] /= l
        return v;
    }
    /**
     * Checks if the first vector is approximately same as the second one.
     * @param v1 First vector
     * @param v2 Second vector
     * @param epsilon The maximum allowed difference of any component.
     */
    export function approxEquals(v1: Vector, v2: Vector, epsilon?: number): boolean {
        if (v1.length != v2.length)
            return false;
        for (let i = 0; i < v1.length; i++)
            if (!FMath.approxEquals(v1[i], v2[i], epsilon))
                return false;
        return true;
    }
    /**
     * Return the cross product of two vectors. The vectors must be 3-dimensional.
     * @param v Input and result vector.
     * @param other The other vector of the cross product.
     */
    export function cross(v: Vector, other: Vector): Vector {
        if (v.length != 3 || other.length != 3)
            throw RangeError(`Both vectors must 3-dimensional.`)
        v[Dim.x] = v[Dim.y] * other[Dim.z] - v[Dim.z] * other[Dim.y]
        v[Dim.y] = v[Dim.z] * other[Dim.x] - v[Dim.x] * other[Dim.z]
        v[Dim.y] = v[Dim.x] * other[Dim.y] - v[Dim.y] * other[Dim.x]
        return v;
    }
    /**
     * Replace components of the vector with their absolute values.
     * @param v Input and result vector.
     */
    export function abs(v: Vector): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] = Math.abs(v[i]);
        return v;
    }
    /**
     * Run the components of the vector through Math.floor function.
     * @param v Input and result vector.
     */
    export function floor(v: Vector): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] = Math.floor(v[i]);
        return v;
    }
    /**
     * Run the components of the vector through Math.ceil function.
     * @param v Input and result vector.
     */
    export function ceil(v: Vector): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] = Math.ceil(v[i]);
        return v;
    }
    /**
     * Run the components of the vector through Math.round function.
     * @param v Input and result vector.
     */
    export function round(v: Vector): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] = Math.round(v[i]);
        return v;
    }
    /**
     * Run the components of the vector through FMath.fract function.
     * @param v Input and result vector.
     */
    export function fract(v: Vector): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] = FMath.fract(v[i]);
        return v;
    }
    /**
     * Calculate the minimum of two vectors componentwise.
     * @param v The input and result vector.
     * @param other The vector to compare with.
     */
    export function min(v: Vector, other: Vector): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] = Math.min(v[i], other[i]);
        return v;
    }
    /**
     * Calculate the maximum of two vectors componentwise.
     * @param v The input and result vector.
     * @param other The vector to compare with.
     */
    export function max(v: Vector, other: Vector): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] = Math.max(v[i], other[i]);
        return v;
    }
    /**
     * Clamp the components of a vector to a given range.
     * @param v The input and result vector.
     * @param min Minimum component value.
     * @param max Maximum component value.
     */
    export function clamp(v: Vector, min: number, max: number): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] = FMath.clamp(v[i], min, max);
        return v;
    }
    /**
     * Calculate the interpolated vector in a given position [0, 1].
     * @param v The input and result vector.
     * @param other The vector to be interpolated to.
     * @param interPos The position between 0 and 1, zero representing v and one other.
     */
    export function mix(v: Vector, other: Vector, interPos: number): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] = FMath.mix(v[i], other[i], interPos);
        return v;
    }
    /**
     * Replace the components of the vector with values 0 or 1 depending if they are 
     * greater or less than the edge value.
     * @param v The input and result vector.
     * @param edge The edge to which the components are compared.
     */
    export function step(v: Vector, edge: number): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] = FMath.step(v[i], edge);
        return v;
    }
    /**
     * Replace the components of the vector with values in range [0, 1] depending 
     * on how close they are to the lower and upper edge value. If a component is 
     * less that lower edge it gets value 0. Conversely, if it is greater than the
     * upper edge, it gets value 1. If a component is between lower and upper edge, 
     * its value is smoothly interpolated between zero and one.
     * @param v The input and result vector.
     * @param edgeLower The lower edge to which the components are compared.
     * @param edgeUpper The upper edge to which the components are compared.
     */
    export function smoothStep(v: Vector, edgeLower: number, edgeUpper: number): Vector {
        for (let i = 0; i < v.length; i++)
            v[i] = FMath.smoothStep(v[i], edgeLower, edgeUpper);
        return v;
    }
    /**
     * Returns the string representation of a vector formatted like this: [x y z]
     */
    export function toString(v: Vector): string {
        return "[" + v.join(" ") + "]"
    }
}