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

    check(t, "Quat: If q₁ and q₂ are real, q₁ ⋅ q₂ is real.",
        fc.property(arbrq, arbrq, (q1, q2) => Qt.isReal(Qt.mul(q1, q2))))

    check(t, "Quat: If q₁ = [0, 𝐚] and q₂ = [0, 𝐛], q₁ ⋅ q₂ = [-𝐚 ⋅ 𝐛, 𝐚 × 𝐛]",
        fc.property(arbpq, arbpq, (q1, q2) => {
            let [s1, a] = q1
            let [s2, b] = q2
            let s = Vec.dot(Vec.inv(a), b)
            let v = Vec.cross(a, b)
            return Qt.approxEquals(Qt.mul(q1, q2), [s, v])
        }))
}

test("multiplication", multiply)
