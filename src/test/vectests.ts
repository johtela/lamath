///<reference types="jsverify"/>

import * as jsc from "jsverify"
import { approxEquals } from "../fmath"
import * as Vec from "../vec"
import * as Arb from "./arbitrarytypes"
import * as ArrayExt from "../arrayext"

function addAndSubtract(dim: number) {
    let arb = Arb.arbvec(dim);
    let zero = Vec.zero(dim);

    jsc.property(`Vector${dim}: v - v = ${zero}`, arb,
        v => Vec.equals(Vec.sub(v, v), zero));

    jsc.property(`Vector${dim}: v1 - v2 = v1 + (-v2)`, arb, arb,
        (v1, v2) => Vec.equals(Vec.sub(v1, v2), Vec.add(v1, Vec.inv(v2))));

    jsc.property(`Vector${dim}: |v + v| = 2 * |v|`, arb,
        v => Vec.len(Vec.add(v, v)) === 2 * Vec.len(v));
}

function multiplyWithScalar(dim: number) {
    let arb = Arb.arbvec(dim);

    jsc.property(`Vector${dim}: |v * s| = |s| * |v|`, arb, jsc.number,
        (v, s) => approxEquals(Math.abs(s) * Vec.len(v), Vec.len(Vec.mul(v, s))));
}

function multiplyWithVector(dim: number) {
    let arb = Arb.arbvec(dim);

    jsc.property(`Vector${dim}: v * s = v * v.${ArrayExt.repeat('s', dim)}`,
        arb, jsc.number,
        (v, s) => Vec.approxEquals(Vec.mul(v, s), Vec.mul(v, Vec.unif(dim, s))));
}

function divideWithScalar(dim: number) {
    let arb = Arb.arbvec(dim);

    jsc.property(`Vector${dim}: v / s = v * (1 / s) when s != 0`,
        arb, jsc.suchthat(jsc.number, s => s != 0),
        (v, s) => Vec.approxEquals(Vec.div(v, s), Vec.mul(v, 1 / s)));
}

function normalize(dim: number) {
    let arb = Arb.arbvec(dim);
    let zero = Vec.zero(dim);

    jsc.property(`Vector${dim}: |norm (v)| = 1 when v != ${zero}`,
        jsc.suchthat(arb, v => !Vec.equals(v, zero)),
        v => approxEquals(Vec.len(Vec.norm(v)), 1));
}

function dotProduct(dim: number) {
    let arb = Arb.arbvec(dim);
    let zero = Vec.zero(dim);

    var nonzero = jsc.suchthat(arb, v => !Vec.equals(v, zero));
    jsc.property(`Vector${dim}: -1 <= norm(v1) . norm(v2) <= 1 when v1, v2 != ${zero}`,
        nonzero, nonzero,
        (v1, v2) => {
            let dp = Vec.dot(Vec.norm(v1), Vec.norm(v2));
            return -1 <= dp && dp <= 1;
        });

    jsc.property(`Vector${dim}: v1 . v2 == (v1 . norm(v2)) * |v2| when v2 != ${zero}`,
        arb, nonzero,
        (v1, v2) => approxEquals(Vec.dot(v1, v2), Vec.dot(v1, Vec.norm(v2)) * Vec.len(v2)));

    jsc.property(`Vector${dim}: v1 . v2 == (v2 . norm(v1)) * |v1| when v1 != ${zero}`,
        nonzero, arb,
        (v1, v2) => approxEquals(Vec.dot(v1, v2), Vec.dot(v2, Vec.norm(v1)) * Vec.len(v1)));
}

describe("vector addition and subtraction", () => {
    for (let i = 2; i < 5; ++i)
        addAndSubtract(i);
})

describe("vector multiplication with scalar", () => {
    for (let i = 2; i < 5; ++i)
        multiplyWithScalar(i);
})

describe("vector multiplication with vector", () => {
    for (let i = 2; i < 5; ++i)
        multiplyWithVector(i);
})

describe("vector division with scalar", () => {
    for (let i = 2; i < 5; ++i)
        divideWithScalar(i);
})

describe("vector normalization", () => {
    for (let i = 2; i < 5; ++i)
        normalize(i);
})

describe("vector dot product", () => {
    for (let i = 2; i < 5; ++i)
        dotProduct(i);
})

describe("vec3 cross product", () => {
    let zero = Vec.zero(3);
    let nonzero = jsc.suchthat(Arb.arbvec(3), v => !Vec.equals(v, zero));
    jsc.property(`Vec3: norm(v1) x norm(v2) . norm(v1|v2) = 1 when v1, v2 != [0 0 0]`,
        nonzero, nonzero,
        (v1, v2) => {
            let v1n = Vec.norm(v1);
            let v2n = Vec.norm(v2);
            let cr = Vec.cross(v1n, v2n);
            let dt1 = Vec.dot(cr, v1n);
            let dt2 = Vec.dot(cr, v2n);
            return approxEquals(dt1, 0) && approxEquals(dt2, 0);
        })
})