"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoPI = Math.PI * 2;
exports.PIover2 = Math.PI / 2;
exports.PIover4 = Math.PI / 4;
exports.PIover8 = Math.PI / 8;
exports.PIover16 = Math.PI / 16;
function approxEquals(x, y, epsilon = 0.000001) {
    if (x === y)
        return true;
    let absX = Math.abs(x);
    let absY = Math.abs(y);
    let diff = Math.abs(x - y);
    if (x * y == 0)
        return diff < (epsilon * epsilon);
    else
        return diff / (absX + absY) < epsilon;
}
exports.approxEquals = approxEquals;
function fract(x) {
    return x - Math.floor(x);
}
exports.fract = fract;
function clamp(x, min, max) {
    return x < min ? min :
        x > max ? max :
            x;
}
exports.clamp = clamp;
function mix(start, end, interPos) {
    return start + (interPos * (end - start));
}
exports.mix = mix;
function step(edge, value) {
    return value < edge ? 0 : 1;
}
exports.step = step;
function smoothStep(edgeLower, edgeUpper, value) {
    let t = clamp((value - edgeLower) / (edgeUpper - edgeLower), 0, 1);
    return t * t * (3 - (2 * t));
}
exports.smoothStep = smoothStep;
