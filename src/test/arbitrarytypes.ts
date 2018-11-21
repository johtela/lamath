///<reference types="jsverify"/>

import * as jsc from "jsverify"
import * as ArrayExt from "../arrayext";
import { Vec2, Vec3, Vec4 } from "../vectors"
import { newVec2, newVec3, newVec4 } from "../arrayvec"
import { Mat2, Mat3, Mat4 } from "../matrices";
import { newMat2, newMat3, newMat4 } from "../arraymat";

export function numArr (size: number): jsc.Arbitrary<number[]>
{
    return jsc.tuple (ArrayExt.fill (Array<jsc.Arbitrary<number>>(size), jsc.number));
}

export const vec2: jsc.Arbitrary<Vec2> = numArr (2).smap (
    a => newVec2.fromArray (a),
    v => [v.x, v.y], v => v.toString ())
export const vec3: jsc.Arbitrary<Vec3> = numArr (3).smap (
    a => newVec3.fromArray (a),
    v => [v.x, v.y, v.z], v => v.toString ())
export const vec4: jsc.Arbitrary<Vec4> = numArr (4).smap (
    a => newVec4.fromArray (a),
    v => [v.x, v.y, v.z, v.w], v => v.toString ())

export const mat2: jsc.Arbitrary<Mat2> = numArr (4).smap (
    a => newMat2.fromArray (a, 2, 2),
    m => m.toArray (), m => m.toString ())
export const mat3: jsc.Arbitrary<Mat3> = numArr (9).smap (
    a => newMat3.fromArray (a, 3, 3),
    m => m.toArray (), m => m.toString ())
export const mat4: jsc.Arbitrary<Mat4> = numArr (16).smap (
    a => newMat4.fromArray (a, 4, 4),
    m => m.toArray (), m => m.toString ())