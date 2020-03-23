import { test } from "lits-extras/lib/tester"
import { Assert } from "zora"
import * as fc from "fast-check"
import { approxEquals } from "../fmath"
import * as Vec from "../vec"
import * as Mat from "../mat"
import { check, arbvec, arbmat } from "./arbitrarytypes"

function transformationIsLinear(t: Assert, dim: number) {
    let arbm = arbmat(dim)
    let arbv = arbvec(dim)

    check(t, `Mat${dim}: M(v₁) + M(v₂) = M(v₁ + v₂)`, fc.property(
        arbm, arbv, arbv, (m, v1, v2) =>
            Vec.approxEquals(
                Vec.add(Mat.transform(m, v1), Mat.transform(m, v2)),
                Mat.transform(m, Vec.add(v1, v2)))))

    check(t, `Mat${dim}: M(v * s) = s * M(v)`, fc.property(
        arbm, arbv, fc.float(), (m, v, s) =>
            Vec.approxEquals(
                Mat.transform(m, Vec.mul(v, s)),
                Vec.mul(Mat.transform(m, v), s))))
}

function addAndSubtract(t: Assert, dim: number) {
    let arb = arbmat(dim)
    let zero = Mat.zero(dim, dim)

    check(t, `Mat${dim}: M - M = [ 0 ... ]`, fc.property(arb, m => 
        Mat.equals(Mat.sub(m, m), zero)))

    check(t, `Mat${dim}: M₁ - M₂ = M₁ + (-M₂)`, fc.property(arb, arb,
        (m1, m2) => Mat.equals(Mat.sub(m1, m2), Mat.add(m1, Mat.mul(m2, -1)))))
}

function multiplyWithScalar(t: Assert, dim: number) {
    let arb = arbmat(dim)

    check(t, `Mat${dim}: M * s * (1 / s) = M when s ≠ 0`, fc.property(
        arb, fc.float().filter(s => s != 0), (m, s) => 
            Mat.approxEquals(Mat.mul(Mat.mul(m, s), 1 / s), m)))
}

function transpose(t: Assert, dim: number) {
    let arb = arbmat(dim)

    check(t, `Mat${dim}: M.rows = Mᵀ.cols and M.cols = Mᵀ.rows`, 
        fc.property(arb, m => {
            let mt = Mat.transpose(m)
            let [rows, cols] = Mat.dimensions(mt)
            return cols == dim && rows == dim
        }))

    check(t, `Mat${dim}: Mᵀᵀ = M`, fc.property(arb, m => 
        Mat.equals(Mat.transpose(Mat.transpose(m)), m)))

    check(t, `Mat${dim}: M₁ᵀ + M₂ᵀ = (M₁ + M₂)ᵀ`, fc.property(arb, arb,
        (m1, m2) => Mat.equals(
            Mat.add(Mat.transpose(m1), Mat.transpose(m2)),
            Mat.transpose(Mat.add(m1, m2)))))
}

function matrixMultiply(t: Assert, dim: number) {
    let arb = arbmat(dim)
    let ident = Mat.identity(dim)

    check(t, `Mat${dim}: M * I = M`, fc.property(arb, m => 
        Mat.equals(Mat.mul(m, ident), m)))

    check(t, `Mat${dim}: (M₁ * M₂) * M₃ = M₁ * (M₂ * M₃)`, fc.property(
        arb, arb, arb, (m1, m2, m3) => Mat.approxEquals(
            Mat.mul(Mat.mul(m1, m2), m3),
            Mat.mul(m1, Mat.mul(m2, m3)))))
}

function translation(t: Assert, dim: number) {
    let arb = arbvec(dim)

    check(t, `Mat${dim}: M(v₁) = v₁ + v₂ where M = translate (v₂)`, 
        fc.property(arb, arb, (v1, v2) => {
            let vec = <Vec.Vector>[ ...v1.slice(0, dim - 1), 1 ]
            let off = <Vec.Vector>[ ...v2.slice(0, dim - 1), 0 ]
            let m = Mat.translation(dim, off)
            return Vec.equals(Mat.transform(m, vec), Vec.add(vec, off))
        }))
}

function scaling(t: Assert, dim: number) {
    let arb = arbvec(dim)

    check(t, `Mat${dim}: M(v₁) = v₁ + v₂ where M = scale (v₂)`, fc.property(
        arb, arb, (v1, v2) => Vec.equals(
            Mat.transform(Mat.scaling(dim, v2), v1),
            Vec.mul(v1, v2))))
}

function rotationZ(t: Assert, dim: number) {
    let arb = arbvec(dim)
    let zero = Vec.zero(dim)
    let arbnz = arb.filter(v => !Vec.equals(v, zero))

    check(t, `Mat${dim}: | M(v) | = | v | where M = rotateZ (a)`, 
        fc.property(arb, fc.float(), (v, a) => 
            approxEquals(
                Vec.len(Mat.transform(Mat.rotationZ(dim, a), v)),
                Vec.len(v))))

    check(t, `Mat${dim}: M(v₁) . M(v₂)  = v₁ ⋅ v₂ where M = rotateZ (a) and v₁, v₂ ≠ ${Vec.toString(zero)}`,
        fc.property(arbnz, arbnz, fc.float(), (v1, v2, a) => {
            let m = Mat.rotationZ(dim, a)
            let vr1 = Mat.transform(m, v1)
            let vr2 = Mat.transform(m, v2)
            return approxEquals(Vec.dot(v1, v2), Vec.dot(vr1, vr2))
        }))
}

function rotationXY(t: Assert, dim: number) {
    let arb = arbvec(dim)
    let zero = Vec.zero(dim)
    let arbnz = arb.filter(v => !Vec.equals(v, zero))

    check(t, `Mat${dim}: | M(v) | = | v | where M = rotateX (a) * rotateY (b)`,
        fc.property(arb, fc.float(), fc.float(), (v, a, b) => 
            approxEquals(
                Vec.len(Mat.transform(<Mat.SquareMatrix>Mat.mul(
                    Mat.rotationX(dim, a), Mat.rotationY(dim, b)), v)),
                Vec.len(v))))

    check(t, `Mat${dim}: M(v₁) ⋅ M(v₂)  = v₁ ⋅ v₂ where ` +
        `M = rotateX (a) * rotateY (b) and v1, v2 != ${Vec.toString(zero)}`,
        fc.property(arbnz, arbnz, fc.float(), fc.float(), (v1, v2, a, b) => {
            let m = <Mat.SquareMatrix>Mat.mul(Mat.rotationX(dim, a), 
                Mat.rotationY(dim, b))
            let vr1 = Mat.transform(m, v1)
            let vr2 = Mat.transform(m, v2)
            return approxEquals(Vec.dot(v1, v2), Vec.dot(vr1, vr2))
        }))
}

function inverse(t: Assert, dim: number) {
    let ident = Mat.identity(dim)
    let arb = arbmat(dim)

    check(t, `Mat${dim}: M * M⁻¹ = I when det(M) ≠ 0`, fc.property(
        arb.filter(m => Mat.determinant(m) != 0), m => 
            Mat.approxEquals(Mat.mul(m, Mat.invert(m)), ident, 0.0001)))
}

test("matrix transformation is linear", t => {
    for (let i = 2; i < 5; ++i)
        transformationIsLinear(t, i)
})

test("matrix addition and subtraction", t => {
    for (let i = 2; i < 5; ++i)
        addAndSubtract(t, i)
})

test("matrix multiplication with scalar", t => {
    for (let i = 2; i < 5; ++i)
        multiplyWithScalar(t, i)
})

test("matrix transpose", t => {
    for (let i = 2; i < 5; ++i)
        transpose(t, i)
})

test("matrix multiplication", t => {
    for (let i = 2; i < 5; ++i)
        matrixMultiply(t, i)
})

test("translation matrix", t => {
    for (let i = 2; i < 5; ++i)
        translation(t, i)
})

test("scaling matrix", t => {
    for (let i = 2; i < 5; ++i)
        scaling(t, i)
})

test("rotation around Z axis matrix", t => {
    for (let i = 2; i < 5; ++i)
        rotationZ(t, i)
})

test("rotation around X and Y axis matrix", t => {
    for (let i = 3; i < 5; ++i)
        rotationXY(t, i)
})

test("matrix inverse", t => {
    for (let i = 2; i < 5; ++i)
        inverse(t, i)
})