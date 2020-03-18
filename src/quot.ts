/**
 * # Quoternions
 */
import * as FMath from "./fmath"
import { Vec3, Vec4 } from "./vec"
import * as Vec from "./vec"
import { Mat3 } from "./mat"
/**
 * Note quoternion must have exactly 4 elements even though the type signature
 * does note show it.
 */
export type Quot = [Vec3, number]

const LERP_THRESHOLD = 0.99

export function ident(): Quot {
    return [[0, 0, 0], 1]
}

export function fromAxisAngle(axis: Vec3, angle: number): Quot {
    let lensqr = Vec.lenSqr(axis)
    if (angle == 0 || lensqr == 0)
        return ident()

    let normaxis = lensqr == 1 ? axis : Vec.div(axis, Math.sqrt(lensqr))
    let halfangle = angle / 2
    return [Vec.mul(normaxis, Math.sin(halfangle)), Math.cos(halfangle)]
}

export function toMatrix([[x, y, z], w]: Quot): Mat3 {
    var xx = x * x
    var xy = x * y
    var xz = x * z
    var xw = x * w
    var yy = y * y
    var yz = y * z
    var yw = y * w
    var zz = z * z
    var zw = z * w
    return [ 3, 3,
        1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw),
        2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw),
        2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy)
    ]
}

export function inv([vec, w]: Quot): Quot {
    return [vec, -w]
}

export function conj([vec, w]: Quot): Quot {
    return [vec, w]
}

export function mul([uv1, w1]: Quot, [uv2, w2]: Quot): Quot {
    let vec = Vec.mul(uv1, w2)
    Vec.add(vec, Vec.mul(uv2, w1), vec)
    Vec.add(vec, Vec.cross(uv1, uv2), vec)
    let w = w1 * w2 + Vec.dot(uv1, uv2)
    return [vec, w]
}

export function rotate(quot: Quot, vec: Vec3): Vec3 {
    return mul(mul(quot, [vec, 0]), conj(quot))[0]
}

export function lerp([uv1, w1]: Quot, [uv2, w2]: Quot, interPos: number): Quot {
    //TODO: Need to normalize
    return [Vec.mix(uv1, uv2, interPos), FMath.mix(w1, w2, interPos)]
}

export function slerp([uv1, w1]: Quot, [uv2, w2]: Quot, interPos: number): Quot {
    let v1 = <Vec4>[...uv1, w1]
    let v2 = <Vec4>[...uv2, w2]
    let dot = Vec.dot(v1, v2)
    if (dot > LERP_THRESHOLD)
        return lerp([uv1, w1], [uv2, w2], interPos)
    let theta = Math.acos(dot) * interPos
    Vec.sub(v2, Vec.mul(v1, dot), v2)
    Vec.norm(v2, v2)
    Vec.mul(v1, Math.cos(theta), v1)
    Vec.mul(v2, Math.sin(theta), v2)
    let [x, y, z, w] = Vec.add(v1, v2, v1)
    return [[x, y, z], w]
}