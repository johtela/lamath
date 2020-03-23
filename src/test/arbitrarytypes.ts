import * as fc from "fast-check"
import { Assert } from "zora"
import * as Vec from "../vec"
import * as Mat from "../mat"
import { Quat } from "../quat"

export function numArr(size: number): fc.Arbitrary<number[]> {
    return fc.array(fc.float(), size, size);
}

export function arbvec<V extends Vec.Vector>(dim: number): fc.Arbitrary<V> {
    return <fc.Arbitrary<V>>numArr(dim)
}

export function arbmat<M extends Mat.SquareMatrix>(dim: number): fc.Arbitrary<M> {
    return numArr(dim * dim).map(a => Mat.fromArray(dim, dim, a))
}

export function arbQuat(): fc.Arbitrary<Quat> {
    return fc.tuple(fc.float(), arbvec<Vec.Vec3>(3))
}

export function arbRealQuat(): fc.Arbitrary<Quat> {
    return fc.tuple(fc.float(), fc.constant(Vec.zero(3)))
}

export function arbPureQuat(): fc.Arbitrary<Quat> {
    return fc.tuple(fc.constant(0), arbvec<Vec.Vec3>(3))
}

export function check<T>(test: Assert, desc: string, prop: fc.IProperty<T>) {
    fc.assert(prop)
    test.ok(true, desc)
}