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
export type Quat = [number, Vec3]

const LERP_THRESHOLD = 0.99

export function ident(): Quat {
    return [1, [0, 0, 0]]
}

export function isReal(quat: Quat): boolean {
    return Vec.equals(quat[1], Vec.zero(3))
}

export function isPure(quat: Quat): boolean {
    return quat[0] == 0
}

export function lenSqr([s, vec]: Quat): number {
    return Vec.lenSqr(vec) + (s * s)
}

export function len(quat: Quat): number {
    return Math.sqrt(lenSqr(quat))
}

export function isNorm(quat: Quat): boolean {
    return FMath.approxEquals(lenSqr(quat), 1, 0.001)
}

export function norm(quat: Quat): Quat {
    let l = len(quat)
    return [quat[0] / l, Vec.div(quat[1], l)]
}

export function fromAxisAngle(angle: number, axis: Vec3): Quat {
    let lensqr = Vec.lenSqr(axis)
    if (angle == 0 || lensqr == 0)
        return ident()

    let normaxis = lensqr == 1 ? axis : Vec.div(axis, Math.sqrt(lensqr))
    let halfangle = angle / 2
    return [Math.cos(halfangle), Vec.mul(normaxis, Math.sin(halfangle))]
}

export function toMatrix([s, [x, y, z]]: Quat): Mat3 {
    let xx = x * x
    let xy = x * y
    let xz = x * z
    let xw = x * s
    let yy = y * y
    let yz = y * z
    let yw = y * s
    let zz = z * z
    let zw = z * s
    return [3, 3,
        1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw),
        2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw),
        2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy)
    ]
}

export function inv([s, vec]: Quat): Quat {
    return [-s, vec]
}

export function conj([s, vec]: Quat): Quat {
    return [s, Vec.inv(vec)]
}

export function mul([s1, [x1, y1, z1]]: Quat, [s2, [x2, y2, z2]]: Quat): Quat {
    return [
        s1 * s2 - x1 * x2 - y1 * y2 - z1 * z2,
        [
            s1 * x2 + s2 * x1 + y1 * z2 - y2 * z1,
            s1 * y2 + s2 * y1 + z1 * x2 - z2 * x1,
            s1 * z2 + s2 * z1 + x1 * y2 - x2 * y1
        ]
    ]
}

export function rotate(quat: Quat, vec: Vec3): Vec3 {
    return mul(mul(quat, [0, vec]), conj(quat))[1]
}

export function lerp([s1, v1]: Quat, [s2, v2]: Quat, interPos: number): Quat {
    return norm([FMath.mix(s1, s2, interPos), Vec.mix(v1, v2, interPos)])
}

export function slerp([s1, uv1]: Quat, [s2, uv2]: Quat, interPos: number): Quat {
    let v1 = <Vec4>[s1, ...uv1]
    let v2 = <Vec4>[s2, ...uv2]
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
    let [s, x, y, z] = v1
    return [s, [x, y, z]]
}

export function equals(quat: Quat, other: Quat): boolean {
    return quat[0] == other[0] && Vec.equals(quat[1], other[1])
}

export function approxEquals(quat: Quat, other: Quat, epsilon?: number):
    boolean {
    return FMath.approxEquals(quat[0], other[0], epsilon) &&
        Vec.approxEquals(quat[1], other[1], epsilon)
}

export function toString(quat: Quat): string {
    return `[${quat[0]} ${Vec.toString(quat[1])}]`
}