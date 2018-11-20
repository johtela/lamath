import { Equatable } from "./Equatable";
/**
 * Enumeration that defines the coordinate dimensions used in the vector types.
 */
export declare enum Dim {
    x = 0,
    y = 1,
    z = 2,
    w = 3
}
/**
 * Base interface for all vectory types. Defines methods that have the same signature
 * in all vector variants.
 */
export interface Vec<V extends Vec<V>> extends Equatable<V> {
    /**
     * Number dimensions in the vector.
     */
    readonly dimensions: number;
    /**
     * Return one or more components of the vector in arbitrary order. The components
     * returned depend on the dimensions specified in the coords argument. Note that
     * the same component can occur multiple times in coords. So, it is valid to call
     * the function like this:
     *
     * swizzle ([Dim.x, Dim.x, Dim.y])
     */
    swizzle(coords: Dim[]): number[];
    /**
     * The lenght of the vector squared. Faster to calculate than the actual length,
     * and useful for comparing vector magnitudes.
     */
    readonly lenSqr: number;
    /**
     * Length of the vector.
     */
    readonly len: number;
    component(index: number): number;
    with(index: number, value: number): V;
    /**
     * Returns the string representation of a vector. Formatted like this: [x y z]
     */
    toString(): string;
    toArray(): number[];
    toFloat32Array(): Float32Array;
    newVec(): NewVec<V>;
    inv(): V;
    add(other: V | number): V;
    sub(other: V | number): V;
    mul(other: V | number): V;
    div(other: V | number): V;
    norm(): V;
    approxEquals(other: V, epsilon?: number): boolean;
    dot(other: V): number;
    abs(): V;
    floor(): V;
    ceil(): V;
    round(): V;
    fract(): V;
    min(other: V): V;
    max(other: V): V;
    clamp(min: number, max: number): V;
    mix(other: V, interPos: number): V;
    step(edge: number): V;
    smoothStep(edgeLower: number, edgeUpper: number): V;
}
export interface NewVec<V extends Vec<V>> {
    readonly dimensions: number;
    readonly zero: V;
    unif(x: number): V;
    init(...values: number[]): V;
    fromArray(array: number[]): V;
}
export interface Vec2 extends Vec<Vec2> {
    x: number;
    y: number;
    toVec3(z: number): Vec3;
    toVec4(z: number, w: number): Vec4;
}
export interface Vec3 extends Vec<Vec3> {
    x: number;
    y: number;
    z: number;
    toVec2(): Vec2;
    toVec4(w: number): Vec4;
    cross(other: Vec3): Vec3;
}
export interface Vec4 extends Vec<Vec4> {
    x: number;
    y: number;
    z: number;
    w: number;
    toVec2(): Vec2;
    toVec3(): Vec3;
}
