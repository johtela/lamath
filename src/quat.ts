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

const LERP_THRESHOLD = 0.95

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
    return FMath.approxEquals(lenSqr(quat), 1)
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

export function toMatrix(quat: Quat): Mat3 {
    let [s, [x, y, z]] = isNorm(quat) ? quat : norm(quat)
    let xx = x * x
    let xy = x * y
    let xz = x * z
    let xs = x * s
    let yy = y * y
    let yz = y * z
    let ys = y * s
    let zz = z * z
    let zs = z * s
    return [3, 3,
        1 - 2 * (yy + zz), 2 * (xy + zs), 2 * (xz - ys),  
        2 * (xy - zs), 1 - 2 * (xx + zz), 2 * (yz + xs), 
        2 * (xz + ys), 2 * (yz - xs), 1 - 2 * (xx + yy)
    ]
}

export function inv(quat: Quat): Quat {
    let res = conj(quat)
    let ls = lenSqr(quat)
    if (FMath.approxEquals(ls, 1))
        return res
    res[0] /= ls
    Vec.div(res[1], ls, res[1])
    return res
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
    let q = isNorm(quat) ? quat : norm(quat)
    return mul(mul(q, [0, vec]), conj(q))[1]
}

export function lerp([s1, v1]: Quat, [s2, v2]: Quat, interPos: number): Quat {
    return [FMath.mix(s1, s2, interPos), Vec.mix(v1, v2, interPos)]
}

export function slerp(quat1: Quat, quat2: Quat, interPos: number): Quat {
    let q1 = isNorm(quat1) ? quat1 : norm(quat1)
    let q2 = isNorm(quat2) ? quat2 : norm(quat2)
    let v1 = <Vec4>[q1[0], ...q1[1]]
    let v2 = <Vec4>[q2[0], ...q2[1]]
    let dot = Vec.dot(v1, v2)
    if (dot < 0) {
        Vec.inv(v1, v1)
        dot = -dot
    }
    if (dot > LERP_THRESHOLD)
        Vec.mix(v1, v2, interPos, v1)
    else {
        let theta0 = Math.acos(dot)
        let theta = theta0 * interPos
        let sintheta0 = Math.sin(theta0)
        let sintheta = Math.sin(theta)
        let s1 = Math.sin(theta0 - theta) / sintheta0
        let s2 = sintheta / sintheta0
        Vec.mul(v1, s1, v1)
        Vec.mul(v2, s2, v2)
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