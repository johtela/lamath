///<reference types="jsverify"/>

import * as jsc from "jsverify"
import * as Vec from "../vec"
import * as Mat from "../mat"

export function numArr(size: number): jsc.Arbitrary<number[]> {
    return jsc.tuple(Array<jsc.Arbitrary<number>>(size).fill(jsc.number));
}

export function arbvec(dim: number): jsc.Arbitrary<Vec.Vector> {
    return numArr(dim).smap(
        a => a,
        v => v, 
        Vec.toString);
}

export function arbmat(dim: number): jsc.Arbitrary<Mat.Matrix> {
    return numArr(dim * dim).smap(
        a => Mat.fromArray(dim, dim, a),
        m => Mat.toArray(m), 
        Mat.toString);
}