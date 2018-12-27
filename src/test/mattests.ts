///<reference types="jsverify"/>

import * as jsc from "jsverify"
import { approxEquals } from "../fmath"
import * as Vec from "../vec"
import * as Mat from "../mat"
import * as Arb from "./arbitrarytypes"

function transformationIsLinear(dim: number) {
    let arbm = Arb.arbmat(dim);
    let arbv = Arb.arbvec(dim);

    jsc.property(`Matrix${dim}: M(v1) + M(v2) = M(v1 + v2)`, arbm, arbv, arbv,
        (m, v1, v2) => Vec.approxEquals(
            Vec.add(Mat.transform(m, v1), Mat.transform(m, v2)),
            Mat.transform(m, Vec.add(v1, v2))));

    jsc.property(`Matrix${dim}: M(v * s) = s * M(v)`, arbm, arbv, jsc.number,
        (m, v, s) => Vec.approxEquals(
            Mat.transform(m, Vec.mul(v, s)),
            Vec.mul(Mat.transform(m, v), s)));
}

function addAndSubtract(dim: number) {
    let arb = Arb.arbmat(dim);
    let zero = Mat.zero(dim, dim);

    jsc.property(`Matrix${dim}: m - m = [ 0 ... ]`, arb,
        m => Mat.equals(Mat.sub(m, m), zero));

    jsc.property(`Matrix${dim}: m1 - m2 = m1 + (-m2)`, arb, arb,
        (m1, m2) => Mat.equals(Mat.sub(m1, m2), Mat.add(m1, Mat.mul(m2, -1))));
}

function multiplyWithScalar(dim: number) {
    let arb = Arb.arbmat(dim);

    jsc.property(`Matrix${dim}: m * s * (1 / s) = m when s != 0`,
        arb, jsc.suchthat(jsc.number, s => s != 0),
        (m, s) => Mat.approxEquals(Mat.mul(Mat.mul(m, s), 1 / s), m));
}

function transpose(dim: number) {
    let arb = Arb.arbmat(dim);

    jsc.property(`Matrix${dim}: m.rows = m^T.cols and m.cols = m^T.rows`, arb,
        m => {
            let mt = Mat.transpose(m);
            let [rows, cols] = Mat.dimensions(mt);
            return cols == dim && rows == dim;
        });

    jsc.property(`Matrix${dim}: m^T^T = m`, arb,
        m => Mat.equals(Mat.transpose(Mat.transpose(m)), m));

    jsc.property(`Matrix${dim}: m1^T + m2^T = (m1 + m2)^T`, arb, arb,
        (m1, m2) => Mat.equals(
            Mat.add(Mat.transpose(m1), Mat.transpose(m2)),
            Mat.transpose(Mat.add(m1, m2))));
}

function matrixMultiply(dim: number) {
    let arb = Arb.arbmat(dim);
    let ident = Mat.identity(dim);

    jsc.property(`Matrix${dim}: m * I = m`, arb,
        m => Mat.equals(Mat.mul(m, ident), m));

    jsc.property(`Matrix${dim}: (m1 * m2) * m3 = m1 * (m2 * m3)`,
        arb, arb, arb,
        (m1, m2, m3) => Mat.approxEquals(
            Mat.mul(Mat.mul(m1, m2), m3),
            Mat.mul(m1, Mat.mul(m2, m3))));
}

function translation(dim: number) {
    let arb = Arb.arbvec(dim);

    jsc.property(`Matrix${dim}: M(v1) = v1 + v2 where M = translate (v2)`,
        arb, arb,
        (v1, v2) => {
            let vec = [ ...v1.slice(0, dim - 1), 1 ];
            let off = [ ...v2.slice(0, dim - 1), 0 ];
            let m = Mat.translation(dim, off);
            return Vec.equals(Mat.transform(m, vec), Vec.add(vec, off));
        })
}

function scaling(dim: number) {
    let arb = Arb.arbvec(dim);

    jsc.property(`Matrix${dim}: M(v1) = v1 * v2 where M = scale (v2)`,
        arb, arb,
        (v1, v2) => Vec.equals(
            Mat.transform(Mat.scaling(dim, v2), v1),
            Vec.mul(v1, v2)));
}

function rotationZ(dim: number) {
    let arb = Arb.arbvec(dim);
    let zero = Vec.zero(dim);
    let arbnz = jsc.suchthat(arb, v => !Vec.equals(v, zero));

    jsc.property(`Matrix${dim}: | M(v) | = | v | where M = rotateZ (a)`,
        arb, jsc.number,
        (v, a) => approxEquals(
            Vec.len(Mat.transform(Mat.rotationZ(dim, a), v)),
            Vec.len(v)));

    jsc.property(`Matrix${dim}: M(v1) . M(v2)  = v1 . v2 where M = rotateZ (a) and v1, v2 != ${zero}`,
        arbnz, arbnz, jsc.number,
        (v1, v2, a) => {
            let m = Mat.rotationZ(dim, a);
            let vr1 = Mat.transform(m, v1);
            let vr2 = Mat.transform(m, v2);
            return approxEquals(Vec.dot(v1, v2), Vec.dot(vr1, vr2));
        })
}

function rotationXY(dim: number) {
    let arb = Arb.arbvec(dim);
    let zero = Vec.zero(dim);
    let arbnz = jsc.suchthat(arb, v => !Vec.equals(v, zero));

    jsc.property(`Matrix${dim}: | M(v) | = | v | where M = rotateX (a) * rotateY (b)`,
        arb, jsc.number, jsc.number,
        (v, a, b) => approxEquals(
            Vec.len(Mat.transform(Mat.mul(Mat.rotationX(dim, a), Mat.rotationY(dim, b)), v)),
            Vec.len(v)));

    jsc.property(`Matrix${dim}: M(v1) . M(v2)  = v1 . v2 where ` +
        `M = rotateX (a) * rotateY (b) and v1, v2 != ${zero}`,
        arbnz, arbnz, jsc.number, jsc.number,
        (v1, v2, a, b) => {
            let m = Mat.mul(Mat.rotationX(dim, a), Mat.rotationY(dim, b));
            let vr1 = Mat.transform(m, v1);
            let vr2 = Mat.transform(m, v2);
            return approxEquals(Vec.dot(v1, v2), Vec.dot(vr1, vr2));
        })
}

function inverse(dim: number) {
    let ident = Mat.identity(dim);
    let arb = Arb.arbmat(dim);

    jsc.property(`Matrix${dim}: m * m^-1 = I when det(m) != 0`,
        jsc.suchthat(arb, m => Mat.determinant(m) != 0),
        m => Mat.approxEquals(Mat.mul(m, Mat.invert(m)), ident));
}

describe("matrix transformation is linear", () => {
    for (let i = 2; i < 5; ++i)
        transformationIsLinear(i);
})

describe("matrix addition and subtraction", () => {
    for (let i = 2; i < 5; ++i)
        addAndSubtract(i);
})

describe("matrix multiplication with scalar", () => {
    for (let i = 2; i < 5; ++i)
        multiplyWithScalar(i);
})

describe("matrix transpose", () => {
    for (let i = 2; i < 5; ++i)
        transpose(i);
})

describe("matrix multiplication", () => {
    for (let i = 2; i < 5; ++i)
        matrixMultiply(i);
})

describe("translation matrix", () => {
    for (let i = 2; i < 5; ++i)
        translation(i);
})

describe("scaling matrix", () => {
    for (let i = 2; i < 5; ++i)
        scaling(i);
})

describe("rotation around Z axis", () => {
    for (let i = 2; i < 5; ++i)
        rotationZ(i);
})

describe("rotation around X and Y axis", () => {
    for (let i = 3; i < 5; ++i)
        rotationXY(i);
})

describe("matrix inverse", () => {
    for (let i = 2; i < 5; ++i)
        inverse(i);
})