import { test } from "lits-extras/lib/tester"
import { Assert } from "zora"
import * as fc from "fast-check"
import * as FMath from "../fmath"
import * as Vec from "../vec"
import * as Mat from "../mat"
import * as Qt from "../quat"
import { check, arbQuat, arbRealQuat, arbPureQuat, arbVec } from "./arbitrarytypes"

function multiply(t: Assert) {
    let arbrq = arbRealQuat()
    let arbpq = arbPureQuat()
    let arbq = arbQuat()
    let ident = Qt.ident()

    check(t, "Quat: q ⋅ [1, [0 0 0]] = q", fc.property(arbq, q =>
        Qt.equals(Qt.mul(q, ident), q)))

    check(t, "Quat: If q₁ and q₂ are real, q₁ ⋅ q₂ is real.",
        fc.property(arbrq, arbrq, (q1, q2) => Qt.isReal(Qt.mul(q1, q2))))

    check(t, "Quat: [0, 𝐚] ⋅ [0, 𝐛] = [-𝐚 ⋅ 𝐛, 𝐚 × 𝐛]",
        fc.property(arbpq, arbpq, (q1, q2) => {
            let [, a] = q1
            let [, b] = q2
            let s = -Vec.dot(a, b)
            let v = Vec.cross(a, b)
            return Qt.approxEquals(Qt.mul(q1, q2), [s, v])
        }))

    check(t, "Quat: [s₁, 𝐚] ⋅ [s₂, 𝐛] = [s₁s₂ - 𝐚 ⋅ 𝐛, s₁𝐛 + s₂𝐚 + 𝐚 × 𝐛]",
        fc.property(arbpq, arbpq, (q1, q2) => {
            let [s1, a] = q1
            let [s2, b] = q2
            let s = s1 * s2 - Vec.dot(a, b)
            let v = Vec.cross(a, b)
            Vec.add(v, Vec.mul(b, s1), v)
            Vec.add(v, Vec.mul(a, s2), v)
            return Qt.approxEquals(Qt.mul(q1, q2), [s, v])
        }))

    check(t, "Quat: q ⋅ conj(q) = [s, 𝐯] ⋅ [s, -𝐯] = [s² + |𝐯|², [0 0 0]]",
        fc.property(arbpq, q => {
            let [s, v] = q
            s = s * s + Vec.lenSqr(v)
            return Qt.equals(Qt.mul(q, Qt.conj(q)), [s, Vec.zero(3)])
        }))
}

function normalize(t: Assert) {
    let arbq = arbQuat()

    check(t, "Quat: |norm(q)| = 1", fc.property(arbq, q =>
        FMath.approxEquals(Qt.len(Qt.norm(q)), 1)))

    check(t, "Quat: q ⋅ q⁻¹ = [1, [0 0 0]]", fc.property(arbq, q =>
        Qt.approxEquals(Qt.mul(q, Qt.inv(q)), Qt.ident())))
}

function convertToMatrix(t: Assert) {
    check(t, "Quat: rotation around x axis", fc.property(fc.float(), a => {
        let q = Qt.fromAxisAngle(a, [1, 0, 0])
        let m = Mat.rotationX<Mat.Mat3>(3, a)
        return Mat.approxEquals(m, Qt.toMatrix(q))
    }))
    check(t, "Quat: rotation around y axis", fc.property(fc.float(), a => {
        let q = Qt.fromAxisAngle(a, [0, 1, 0])
        let m = Mat.rotationY<Mat.Mat3>(3, a)
        return Mat.approxEquals(m, Qt.toMatrix(q))
    }))
    check(t, "Quat: rotation around z axis", fc.property(fc.float(), a => {
        let q = Qt.fromAxisAngle(a, [0, 0, 1])
        let m = Mat.rotationZ<Mat.Mat3>(3, a)
        return Mat.approxEquals(m, Qt.toMatrix(q))
    }))
}

function rotate(t: Assert) {
    let arbv = arbVec<Vec.Vec3>(3)

    check(t, "Quat: rotate vector around x axis", fc.property(fc.float(), arbv,
        (a, v) => {
            let q = Qt.fromAxisAngle(a, [1, 0, 0])
            let m = Mat.rotationX<Mat.Mat3>(3, a)
            return Vec.approxEquals(Mat.transform(m, v), Qt.rotate(q, v))
        }))

    check(t, "Quat: rotate vector around z and then y axis", fc.property(
        fc.float(), fc.float(), arbv, (a, b, v) => {
            let q = Qt.mul(Qt.fromAxisAngle(b, [0, 1, 0]),
                Qt.fromAxisAngle(a, [0, 0, 1]))
            let m = <Mat.Mat3>Mat.mul(Mat.rotationY(3, b), Mat.rotationZ(3, a))
            let qv = Qt.rotate(q, v)
            let mv = Mat.transform(m, v)
            return Vec.approxEquals(qv, mv)
        }
    ))
}

function isBetween([s, v]: Qt.Quat, [sl, vl]: Qt.Quat, [sh, vh]: Qt.Quat):
    boolean {
    let minv = Vec.min(vl, vh)
    let maxv = Vec.max(vl, vh)
    let mins = Math.min(sl, sh)
    let maxs = Math.max(sl, sh)
    return v.every((a, i) => a >= minv[i] && a <= maxv[i]) &&
        s >= mins && s <= maxs
}

function lerp(t: Assert) {
    let arbq = arbQuat()

    check(t, "Quat: q₁ ≤ lerp(q₁, q₂, [0-1]) ≤ q₂", fc.property(arbq, arbq,
        fc.float(0, 1), (q1, q2, a) => isBetween(Qt.lerp(q1, q2, a), q1, q2)))

    check(t, "Quat: |slerp(q₁, q₂, [0-1])| ≈ 1", fc.property(arbq, arbq,
        fc.float(0, 1), (q1, q2, a) => {
            let res = Qt.slerp(q1, q2, a)
            let len = Qt.len(res)
            return FMath.approxEquals(len, 1, 0.01)
        }))
}

test("quaternion multiplication", multiply)
test("quaternion normalization and inverse", normalize)
test("convert quaternion to matrix", convertToMatrix)
test("rotate vectors by quoternion", rotate)
test("quaternion lerping and slerping", lerp)