import * as fc from "fast-check"
import { Assert } from "zora"
import * as Vec from "../vec"
import * as Mat from "../mat"

export function numArr(size: number): fc.Arbitrary<number[]> {
    return fc.array(fc.float(), size, size);
}

export function arbvec<V extends Vec.Vector>(dim: number): fc.Arbitrary<V> {
    return <fc.Arbitrary<V>>numArr(dim)
}

export function arbmat<M extends Mat.SquareMatrix>(dim: number): fc.Arbitrary<M> {
    return numArr(dim * dim).map(a => Mat.fromArray(dim, dim, a))
}

export function check<T>(test: Assert, desc: string, prop: fc.IProperty<T>) {
    test.truthy(fc.check(prop), desc)
}