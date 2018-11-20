"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FMath = require("./FMath");
const Vectors_1 = require("./Vectors");
const ArrayExt = require("./ArrayExt");
class NewArrayVec {
    constructor(dimensions) {
        this.dimensions = dimensions;
    }
    get zero() {
        return new ArrayVec(ArrayExt.fill(Array(this.dimensions), 0));
    }
    unif(x) {
        return new ArrayVec(ArrayExt.fill(Array(this.dimensions), x));
    }
    init(...values) {
        if (values.length != this.dimensions)
            throw RangeError(`Expected ${this.dimensions} components.`);
        return new ArrayVec(values);
    }
    fromArray(array) {
        if (array.length < this.dimensions)
            throw RangeError(`Expected ${this.dimensions} components.`);
        return new ArrayVec(array.slice(0, this.dimensions));
    }
}
exports.newVec2 = new NewArrayVec(2);
exports.newVec3 = new NewArrayVec(3);
exports.newVec4 = new NewArrayVec(4);
class ArrayVec {
    constructor(array) {
        this.array = array;
    }
    get dimensions() {
        return this.array.length;
    }
    component(index) {
        return this.array[index];
    }
    with(index, value) {
        return new ArrayVec(this.array.map((v, i, a) => i == index ? value : v));
    }
    get x() { return this.array[Vectors_1.Dim.x]; }
    set x(value) { this.array[Vectors_1.Dim.x] = value; }
    get y() { return this.array[Vectors_1.Dim.y]; }
    set y(value) { this.array[Vectors_1.Dim.y] = value; }
    get z() { return this.array[Vectors_1.Dim.z]; }
    set z(value) { this.array[Vectors_1.Dim.z] = value; }
    get w() { return this.array[Vectors_1.Dim.w]; }
    set w(value) { this.array[Vectors_1.Dim.w] = value; }
    swizzle(coords) {
        var res = new Array(coords.length);
        for (var i = 0; i < res.length; i++)
            res[i] = this.array[coords[i]];
        return res;
    }
    map(oper) {
        return new ArrayVec(this.array.map(v => oper(v)));
    }
    map2(other, oper) {
        return new ArrayVec(this.array.map((v, i) => oper(v, other.array[i])));
    }
    reduce(oper) {
        return this.array.reduce((c, v) => oper(c, v), 0);
    }
    get lenSqr() {
        return this.reduce((a, x) => a + (x * x));
    }
    get len() {
        return Math.sqrt(this.lenSqr);
    }
    inv() {
        return this.map(x => -x);
    }
    add(other) {
        return other instanceof ArrayVec ?
            this.map2(other, (x, y) => x + y) :
            this.map(x => x + other);
    }
    sub(other) {
        return other instanceof ArrayVec ?
            this.map2(other, (x, y) => x - y) :
            this.map(x => x - other);
    }
    mul(other) {
        return other instanceof ArrayVec ?
            this.map2(other, (x, y) => x * y) :
            this.map(x => x * other);
    }
    div(other) {
        return other instanceof ArrayVec ?
            this.map2(other, (x, y) => x / y) :
            this.map(x => x / other);
    }
    norm() {
        let l = this.len;
        if (l == 0)
            throw RangeError("Cannot normalize zero vector");
        return this.map(x => x / l);
    }
    equals(other) {
        return this.array.every(function (v, i, a) {
            return v === other.array[i];
        });
    }
    approxEquals(other, epsilon = 0.000001) {
        return this.array.every(function (v, i, a) {
            return FMath.approxEquals(v, other.array[i], epsilon);
        });
    }
    dot(other) {
        return this.array.reduce(function (c, v, i, a) {
            return c + (v * other.array[i]);
        }, 0);
    }
    cross(other) {
        return new ArrayVec([
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        ]);
    }
    abs() {
        return this.map(Math.abs);
    }
    floor() {
        return this.map(Math.floor);
    }
    ceil() {
        return this.map(Math.ceil);
    }
    round() {
        return this.map(Math.round);
    }
    fract() {
        return this.map(FMath.fract);
    }
    min(other) {
        return this.map2(other, Math.min);
    }
    max(other) {
        return this.map2(other, Math.max);
    }
    clamp(min, max) {
        return this.map(x => FMath.clamp(x, min, max));
    }
    mix(other, interPos) {
        return this.map2(other, (x, y) => FMath.mix(x, y, interPos));
    }
    step(edge) {
        return this.map(x => FMath.step(edge, x));
    }
    smoothStep(edgeLower, edgeUpper) {
        return this.map(x => FMath.smoothStep(edgeLower, edgeUpper, x));
    }
    toString() {
        return "[" + this.array.join(" ") + "]";
    }
    toArray() {
        return this.array;
    }
    toFloat32Array() {
        return new Float32Array(this.array);
    }
    newVec() {
        return new NewArrayVec(this.dimensions);
    }
    toVec2() {
        return new ArrayVec(this.array.slice(0, 2));
    }
    toVec3(z = 0) {
        switch (this.dimensions) {
            case 2: new ArrayVec([...this.array, z]);
            case 4: new ArrayVec(this.array.slice(0, 3));
            default: throw Error("Unsupported conversion.");
        }
    }
    toVec4(z = 0, w = 0) {
        switch (this.dimensions) {
            case 2: new ArrayVec([...this.array, z, w]);
            case 3: new ArrayVec([...this.array, w]);
            default: throw Error("Unsupported conversion.");
        }
    }
}
