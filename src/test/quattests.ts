import { test } from "lits-extras/lib/tester"
import { Assert } from "zora"
import * as fc from "fast-check"
import { approxEquals, fract } from "../fmath"
import * as Vec from "../vec"
import { Vector } from "../vec"
import * as Qt from "../quat"
import { Quat } from "../quat"
import { check, arbQuat, arbRealQuat, arbPureQuat } from "./arbitrarytypes"

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
            let [s1, a] = q1
            let [s2, b] = q2
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

test("quaternion multiplication", multiply)
