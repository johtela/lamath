import * as fc from "fast-check"
import { Assert } from "lits-extras/lib/tester"
import * as Vec from "../vec"
import * as Mat from "../mat"
import { Quat } from "../quat"

export function arbFloat(min?: number, max?: number): fc.Arbitrary<number> {
    return fc.float({ min, max, noDefaultInfinity: true, noNaN: true })
}

export function numArr(size: number): fc.Arbitrary<number[]> {
    return fc.array(arbFloat(), { minLength: size, maxLength: size });
}

export function arbVec<V extends Vec.Vector>(dim: number): fc.Arbitrary<V> {
    return <fc.Arbitrary<V>>numArr(dim)
}

export function arbMat<M extends Mat.SquareMatrix>(dim: number): fc.Arbitrary<M> {
    return numArr(dim * dim).map(a => Mat.fromArray(dim, dim, a))
}

export function arbQuat(): fc.Arbitrary<Quat> {
    return fc.tuple(arbFloat(), arbVec<Vec.Vec3>(3))
}

export function arbRealQuat(): fc.Arbitrary<Quat> {
    return fc.tuple(arbFloat(), fc.constant(Vec.zero(3)))
}

export function arbPureQuat(): fc.Arbitrary<Quat> {
    return fc.tuple(fc.constant(0), arbVec<Vec.Vec3>(3))
}

export function check<T>(test: Assert, desc: string, prop: fc.IProperty<T>) {
    fc.assert(prop)
    test.isTrue(desc, true)
}