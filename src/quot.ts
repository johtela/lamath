/**
 * # Quoternions
 */
import * as FMath from "./fmath"
import { Vector } from "./vec"
import * as Vec from "./vec"
/**
 * Note quoternion must have exactly 4 elements even though the type signature
 * does note show it.
 */
export type Quoternion = number[]

export function ident(): Quoternion {
    return [0, 0, 0, 1]
}

export function init(vec: Vector, w: number) {
    return [vec[Vec.x], vec[Vec.y], vec[Vec.z], w]
}

export function fromAxisAngle(axis: Vector, angle: number) {
    let lensqr = Vec.lenSqr(axis)
    if (angle == 0 || lensqr == 0)
        return ident()

    let normaxis = lensqr == 1 ? axis : Vec.div(axis, Math.sqrt(lensqr))
    let halfangle = angle / 2;
    return init(Vec.mul(normaxis, Math.sin(halfangle)), Math.cos(halfangle));
}

