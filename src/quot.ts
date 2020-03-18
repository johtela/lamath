/**
 * # Quaternions
 */
import * as FMath from "./fmath"
import { Vec3, Vec4 } from "./vec"
import * as Vec from "./vec"
import { Mat3 } from "./mat"
/**
 * Note quoternion must have exactly 4 elements even though the type signature
 * does note show it.
 */
export type Quat = [Vec3, number]

const LERP_THRESHOLD = 0.99

export function ident(): Quat {
    return [[0, 0, 0], 1]
}

export function lenSqr([vec, w]: Quat): number {
    return Vec.lenSqr(vec) + (w * w)
}

export function len(quat: Quat): number {
    return Math.sqrt(lenSqr(quat))
}

export function isNorm(quat: Quat): boolean {
    return FMath.approxEquals(lenSqr(quat), 1, 0.001)
}

export function norm(quat: Quat): Quat {
    let l = len(quat)    
    return [Vec.div(quat[0], l), quat[1] / l]
}

export function fromAxisAngle(axis: Vec3, angle: number): Quat {
    let lensqr = Vec.lenSqr(axis)
    if (angle == 0 || lensqr == 0)
        return ident()

    let normaxis = lensqr == 1 ? axis : Vec.div(axis, Math.sqrt(lensqr))
    let halfangle = angle / 2
    return [Vec.mul(normaxis, Math.sin(halfangle)), Math.cos(halfangle)]
}

export function toMatrix([[x, y, z], w]: Quat): Mat3 {
    let xx = x * x
    let xy = x * y
    let xz = x * z
    let xw = x * w
    let yy = y * y
    let yz = y * z
    let yw = y * w
    let zz = z * z
    let zw = z * w
    return [3, 3,
        1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw),
        2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw),
        2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy)
    ]
}

export function inv([vec, w]: Quat): Quat {
    return [vec, -w]
}

export function conj([vec, w]: Quat): Quat {
    return [vec, w]
}

export function mul([uv1, w1]: Quat, [uv2, w2]: Quat): Quat {
    let vec = Vec.mul(uv1, w2)
    Vec.add(vec, Vec.mul(uv2, w1), vec)
    Vec.add(vec, Vec.cross(uv1, uv2), vec)
    let w = w1 * w2 + Vec.dot(uv1, uv2)
    return [vec, w]
}

export function rotate(quat: Quat, vec: Vec3): Vec3 {
    return mul(mul(quat, [vec, 0]), conj(quat))[0]
}

export function lerp([uv1, w1]: Quat, [uv2, w2]: Quat, interPos: number): Quat {
    return norm([Vec.mix(uv1, uv2, interPos), FMath.mix(w1, w2, interPos)])
}

export function slerp([uv1, w1]: Quat, [uv2, w2]: Quat, interPos: number): Quat {
    let v1 = <Vec4>[...uv1, w1]
    let v2 = <Vec4>[...uv2, w2]
    let dot = Vec.dot(v1, v2)
    if (dot > LERP_THRESHOLD)
        Vec.mix(v1, v2, interPos, v1)
    else {
        let theta = Math.acos(dot) * interPos
        Vec.sub(v2, Vec.mul(v1, dot), v2)
        Vec.norm(v2, v2)
        Vec.mul(v1, Math.cos(theta), v1)
        Vec.mul(v2, Math.sin(theta), v2)
        Vec.add(v1, v2, v1)
    }
    let [x, y, z, w] = v1
    return [[x, y, z], w]
}

export function equals(quat: Quat, other: Quat): boolean {
    return Vec.equals(quat[0], other[0]) && quat[1] == other[1]
}

export function toString(quat: Quat): string {
    return `[${Vec.toString(quat[0])} ${quat[1]}]` 
}