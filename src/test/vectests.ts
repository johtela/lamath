import { test } from "lits-extras/lib/tester"
import { Assert } from "zora"
import * as fc from "fast-check"
import { approxEquals, fract } from "../fmath"
import * as Vec from "../vec"
import { Vector } from "../vec"
import { check, arbVec } from "./arbitrarytypes"

function addAndSubtract(t: Assert, dim: number) {
    let arb = arbVec(dim)
    let zero = Vec.zero(dim)

    check(t, `Vec${dim}: v - v = ${Vec.toString(zero)}`,
        fc.property(arb, v => Vec.equals(Vec.sub(v, v), zero)))


    check(t, `Vec${dim}: v₁ - v₂ = v₁ + (-v₂)`,
        fc.property(arb, arb, (v1, v2) =>
            Vec.equals(Vec.sub(v1, v2), Vec.add(v1, Vec.inv(v2)))))

    check(t, `Vec${dim}: |v + v| = 2 * |v|`, fc.property(arb,
        v => Vec.len(Vec.add(v, v)) === 2 * Vec.len(v)))
}

function multiplyWithScalar(t: Assert, dim: number) {
    let arb = arbVec(dim)

    check(t, `Vec${dim}: |v * s| = |s| * |v|`, fc.property(
        arb, fc.float(), (v, s) =>
        approxEquals(Math.abs(s) * Vec.len(v), Vec.len(Vec.mul(v, s)))))
}

function multiplyWithVector(t: Assert, dim: number) {
    let arb = arbVec(dim)

    check(t, `Vec${dim}: v * s = v * [ ${'s '.repeat(dim)}]`,
        fc.property(arb, fc.float(), (v, s) =>
            Vec.approxEquals(Vec.mul(v, s), Vec.mul(v, Vec.unif(dim, s)))))
}

function divideWithScalar(t: Assert, dim: number) {
    let arb = arbVec(dim)

    check(t, `Vec${dim}: v / s = v * (1 / s) when s ≠ 0`, fc.property(
        arb, fc.float().filter(s => s != 0), (v, s) =>
        Vec.approxEquals(Vec.div(v, s), Vec.mul(v, 1 / s))))
}

function normalize(t: Assert, dim: number) {
    let arb = arbVec(dim)
    let zero = Vec.zero(dim)

    check(t, `Vec${dim}: |norm (v)| = 1 when v ≠ ${Vec.toString(zero)}`,
        fc.property(arb.filter(v => !Vec.equals(v, zero)), v =>
            approxEquals(Vec.len(Vec.norm(v)), 1)))
}

function dotProduct(t: Assert, dim: number) {
    let arb = arbVec(dim)
    let zero = Vec.zero(dim)

    var nonzero = arb.filter(v => !Vec.equals(v, zero))
    check(t, `Vec${dim}: -1 ≤ norm(v₁) ⋅ norm(v₂) ≤ 1 when v₁, v₂ ≠ ${Vec.toString(zero)}`,
        fc.property(nonzero, nonzero, (v1, v2) => {
            let dp = Vec.dot(Vec.norm(v1), Vec.norm(v2))
            return -1 <= dp && dp <= 1
        }))

    check(t, `Vec${dim}: v₁ ⋅ v₂ ≈ (v₁ ⋅ norm(v₂)) * |v₂| when v₂ ≠ ${Vec.toString(zero)}`,
        fc.property(arb, nonzero, (v1, v2) =>
            approxEquals(Vec.dot(v1, v2), Vec.dot(v1, Vec.norm(v2)) * Vec.len(v2))))

    check(t, `Vec${dim}: v₁ ⋅ v₂ ≈ (v₂ ⋅ norm(v₁)) * |v₁| when v₁ ≠ ${Vec.toString(zero)}`,
        fc.property(nonzero, arb, (v1, v2) =>
            approxEquals(Vec.dot(v1, v2), Vec.dot(v2, Vec.norm(v1)) * Vec.len(v1))))
}

function componentwiseOperation(t: Assert, dim: number, oper: string,
    vecOper: (v: Vector) => Vector, numOper: (n: number) => number) {
    let arb = arbVec(dim)

    check(t, `Vec${dim}: ${oper}(v) = [ ${oper}(x) ${oper}(y) ... ]`,
        fc.property(arb, v => Vec.equals(vecOper(v), <Vector>v.map(numOper))))
}

function componentwiseOperation2(t: Assert, dim: number, oper: string,
    vecOper: (v1: Vector, v2: Vector) => Vector,
    numOper: (n1: number, n2: number) => number) {
    let arb = arbVec(dim)

    check(t, `Vec${dim}: ${oper}(v₁, v₂) = [ ${oper}(x₁, x₂) ${oper}(y₁, y₂) ... ]`,
        fc.property(arb, arb, (v1, v2) =>
            Vec.equals(vecOper(v1, v2), 
                <Vector>v1.map((c, i) => numOper(c, v2[i])))))
}

function clamp(t: Assert, dim: number) {
    let arb = arbVec(dim)

    check(t, `Vec${dim}: clamp(v, min, max) ⇒ [ c | c ≤ min, c ≤ max ]`,
        fc.property(arb, fc.float(), fc.float(), (v, n1, n2) => {
            let min = Math.min(n1, n2)
            let max = Math.max(n1, n2)
            let clamped = Vec.clamp(v, min, max)
            return clamped.every(c => c >= min && c <= max)
        }))
}

function mix(t: Assert, dim: number) {
    let arb = arbVec(dim)

    check(t, `Vec${dim}: mix(v₁, v₂, n ∈ [0, 1] ) ⇒ [ c | c ≥ min(c₁, c₂), c ≤ max(c₁, c₂) ]`,
        fc.property(arb, arb, fc.float(0, 1), (v1, v2, n) => {
            let clamped = Vec.mix(v1, v2, n)
            let min = Vec.min(v1, v2)
            let max = Vec.max(v1, v2)
            return clamped.every((c, i) => c >= min[i] && c <= max[i])
        }))
}

function steps(t: Assert, dim: number) {
    let arb = arbVec(dim)

    check(t, `Vec${dim}: step(v, n) = [ cᵢ | (vᵢ < n ∧ cᵢ = 0) ∨ cᵢ = 1 ]`,
        fc.property(arb, fc.float(), (v, n) => 
            Vec.step(v, n).every((c, i) => (v[i] < n && c == 0) || c == 1)))

    check(t, `Vec${dim}: smoothstep(v, low, up) = [ cᵢ | (vᵢ ≤ low ∧ cᵢ = 0) ∨ (vᵢ ≥ up ∧ cᵢ = 1) ∨ cᵢ ∈ (0, 1) ]`,
        fc.property(arb, fc.float(), fc.float(), (v, n1, n2) => {
            let low = Math.min(n1, n2)
            let up = Math.max(n1, n2)
            return Vec.smoothStep(v, low, up).every((c, i) =>
                (v[i] <= low && c == 0) ||
                (v[i] >= up && c == 1) ||
                (c > 0 && c < 1))
        }))
}

test("vector addition and subtraction", t => {
    for (let i = 2; i < 5; ++i)
        addAndSubtract(t, i)
})

test("vector multiplication with scalar", t => {
    for (let i = 2; i < 5; ++i)
        multiplyWithScalar(t, i)
})

test("vector multiplication with vector", t => {
    for (let i = 2; i < 5; ++i)
        multiplyWithVector(t, i)
})

test("vector division with scalar", t => {
    for (let i = 2; i < 5; ++i)
        divideWithScalar(t, i)
})

test("vector normalization", t => {
    for (let i = 2; i < 5; ++i)
        normalize(t, i)
})

test("vector dot product", t => {
    for (let i = 2; i < 5; ++i)
        dotProduct(t, i)
})

test("vector3 cross product", t => {
    let zero = Vec.zero(3)
    let nonzero = arbVec<Vec.Vec3>(3).filter(v => !Vec.equals(v, zero))
    check(t, `Vector3: norm(v₁) × norm(v₂) ⋅ norm(v₁ or v₂) ≈ 0 when v₁, v₂ ≠ [0 0 0]`,
        fc.property(nonzero, nonzero, (v1, v2) => {
            let v1n = Vec.norm(v1)
            let v2n = Vec.norm(v2)
            let cr = Vec.cross(v1n, v2n)
            let dt1 = Vec.dot(cr, v1n)
            let dt2 = Vec.dot(cr, v2n)
            return approxEquals(dt1, 0) && approxEquals(dt2, 0)
        }))
})

test("vector componentwise unary operations", t => {
    for (let i = 2; i < 5; ++i) {
        componentwiseOperation(t, i, "abs", Vec.abs, Math.abs)
        componentwiseOperation(t, i, "floor", Vec.floor, Math.floor)
        componentwiseOperation(t, i, "ceil", Vec.ceil, Math.ceil)
        componentwiseOperation(t, i, "round", Vec.round, Math.round)
        componentwiseOperation(t, i, "fract", Vec.fract, fract)
    }
})

test("vector componentwise binary operations", t => {
    for (let i = 2; i < 5; ++i) {
        componentwiseOperation2(t, i, "min", Vec.min, Math.min)
        componentwiseOperation2(t, i, "max", Vec.max, Math.max)
    }
})

test("vector clamping", t => {
    for (let i = 2; i < 5; ++i)
        clamp(t, i)
})

test("vector mixing", t => {
    for (let i = 2; i < 5; ++i)
        mix(t, i)
})

test("vector stepping", t => {
    for (let i = 2; i < 5; ++i)
        steps(t, i)
})