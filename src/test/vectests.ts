import * as jsc from "jsverify"
import { approxEquals, fract } from "../fmath"
import * as Vec from "../vec"
import { Vector } from "../vec";
import * as Arb from "./arbitrarytypes"

function addAndSubtract(dim: number) {
    let arb = Arb.arbvec(dim);
    let zero = Vec.zero(dim);

    jsc.property(`Vector${dim}: v - v = ${Vec.toString(zero)}`, arb,
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

    jsc.property(`Vector${dim}: v * s = v * [ ${'s '.repeat(dim)}]`,
        arb, jsc.number,
        (v, s) => Vec.approxEquals(Vec.mul(v, s), Vec.mul(v, Vec.unif(dim, s))));
}

function divideWithScalar(dim: number) {
    let arb = Arb.arbvec(dim);

    jsc.property(`Vector${dim}: v / s = v * (1 / s) when s ≠ 0`,
        arb, jsc.suchthat(jsc.number, s => s != 0),
        (v, s) => Vec.approxEquals(Vec.div(v, s), Vec.mul(v, 1 / s)));
}

function normalize(dim: number) {
    let arb = Arb.arbvec(dim);
    let zero = Vec.zero(dim);

    jsc.property(`Vector${dim}: |norm (v)| = 1 when v ≠ ${Vec.toString(zero)}`,
        jsc.suchthat(arb, v => !Vec.equals(v, zero)),
        v => approxEquals(Vec.len(Vec.norm(v)), 1));
}

function dotProduct(dim: number) {
    let arb = Arb.arbvec(dim);
    let zero = Vec.zero(dim);

    var nonzero = jsc.suchthat(arb, v => !Vec.equals(v, zero));
    jsc.property(`Vector${dim}: -1 ≤ norm(v1) ⋅ norm(v2) ≤ 1 when v1, v2 ≠ ${Vec.toString(zero)}`,
        nonzero, nonzero,
        (v1, v2) => {
            let dp = Vec.dot(Vec.norm(v1), Vec.norm(v2));
            return -1 <= dp && dp <= 1;
        });

    jsc.property(`Vector${dim}: v1 ⋅ v2 ≈ (v1 ⋅ norm(v2)) * |v2| when v2 ≠ ${Vec.toString(zero)}`,
        arb, nonzero,
        (v1, v2) => approxEquals(Vec.dot(v1, v2), Vec.dot(v1, Vec.norm(v2)) * Vec.len(v2)));

    jsc.property(`Vector${dim}: v1 ⋅ v2 ≈ (v2 ⋅ norm(v1)) * |v1| when v1 ≠ ${Vec.toString(zero)}`,
        nonzero, arb,
        (v1, v2) => approxEquals(Vec.dot(v1, v2), Vec.dot(v2, Vec.norm(v1)) * Vec.len(v1)));
}

function componentwiseOperation(dim: number, oper: string, vecOper: (v: Vector) => Vector,
    numOper: (n: number) => number) {
    let arb = Arb.arbvec(dim);

    jsc.property(`Vector${dim}: ${oper}(v) = [ ${oper}(x) ${oper}(y) ... ]`, arb,
        (v) => Vec.equals(vecOper(v), v.map(numOper)));
}

function componentwiseOperation2(dim: number, oper: string,
    vecOper: (v1: Vector, v2: Vector) => Vector,
    numOper: (n1: number, n2: number) => number) {
    let arb = Arb.arbvec(dim);

    jsc.property(`Vector${dim}: ${oper}(v1, v2) = [ ${oper}(x1, x2) ${oper}(y1, y2) ... ]`,
        arb, arb, (v1, v2) =>
            Vec.equals(vecOper(v1, v2), v1.map((c, i) => numOper(c, v2[i]))));
}

function clamp(dim: number) {
    let arb = Arb.arbvec(dim);

    jsc.property(`Vector${dim}: clamp(v, min, max) ⇒ [ c | c ≤ min, c ≤ max ]`,
        arb, jsc.number, jsc.number,
        (v, n1, n2) => {
            let min = Math.min(n1, n2);
            let max = Math.max(n1, n2);
            let clamped = Vec.clamp(v, min, max);
            return clamped.every(c => c >= min && c <= max);
        });
}

function mix(dim: number) {
    let arb = Arb.arbvec(dim);

    jsc.property(`Vector${dim}: mix(v1, v2, n ∈ [0, 1] ) ⇒ [ c | c ≥ min(c1, c2), c ≤ max(c1, c2) ]`,
        arb, arb, jsc.number(0, 1),
        (v1, v2, n) => {
            let clamped = Vec.mix(v1, v2, n);
            let min = Vec.min(v1, v2);
            let max = Vec.max(v1, v2);
            return clamped.every((c, i) => c >= min[i] && c <= max[i]);
        });
}

function steps(dim: number) {
    let arb = Arb.arbvec(dim);

    jsc.property(`Vector${dim}: step(v, n) = [ cᵢ | (vᵢ < n ∧ cᵢ = 0) ∨ cᵢ = 1 ]`,
        arb, jsc.number,
        (v, n) => Vec.step(v, n).every((c, i) => (v[i] < n && c == 0) || c == 1));

    jsc.property(`Vector${dim}: smoothstep(v, low, up) = [ cᵢ | (vᵢ ≤ low ∧ cᵢ = 0) ∨ (vᵢ ≥ up ∧ cᵢ = 1) ∨ cᵢ ∈ (0, 1) ]`,
        arb, jsc.number, jsc.number,
        (v, n1, n2) => {
            let low = Math.min(n1, n2);
            let up = Math.max(n1, n2);
            return Vec.smoothStep(v, low, up).every((c, i) => 
                (v[i] <= low && c == 0) || 
                (v[i] >= up && c == 1) || 
                (c > 0 && c < 1));
        });
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

describe("vector3 cross product", () => {
    let zero = Vec.zero(3);
    let nonzero = jsc.suchthat(Arb.arbvec(3), v => !Vec.equals(v, zero));
    jsc.property(`Vector3: norm(v1) × norm(v2) ⋅ norm(v1 or v2) ≈ 0 when v1, v2 ≠ [0 0 0]`,
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

describe("componentwise unary operations", () => {
    for (let i = 2; i < 5; ++i) {
        componentwiseOperation(i, "abs", Vec.abs, Math.abs);
        componentwiseOperation(i, "floor", Vec.floor, Math.floor);
        componentwiseOperation(i, "ceil", Vec.ceil, Math.ceil);
        componentwiseOperation(i, "round", Vec.round, Math.round);
        componentwiseOperation(i, "fract", Vec.fract, fract);
    }
})

describe("componentwise binary operations", () => {
    for (let i = 2; i < 5; ++i) {
        componentwiseOperation2(i, "min", Vec.min, Math.min);
        componentwiseOperation2(i, "max", Vec.max, Math.max);
    }
})

describe("clamping", () => {
    for (let i = 2; i < 5; ++i)
        clamp(i);
})

describe("mixing", () => {
    for (let i = 2; i < 5; ++i)
        mix(i);
})

describe("stepping", () => {
    for (let i = 2; i < 5; ++i)
        steps(i);
})