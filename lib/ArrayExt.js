"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FMath_1 = require("./FMath");
function clone(array) {
    let rows = array.length;
    let res = Array(rows);
    for (let r = 0; r < rows; r++)
        res[r] = array[r].slice();
    return res;
}
exports.clone = clone;
function fill(array, value) {
    for (var i = 0; i < array.length; i++)
        array[i] = value;
    return array;
}
exports.fill = fill;
function repeat(value, count) {
    var res = Array(count);
    for (var i = 0; i < count; i++)
        res[i] = value;
    return res;
}
exports.repeat = repeat;
function maxItems(array, selector) {
    let res = [];
    let max = Number.MAX_VALUE;
    for (let item of array) {
        var value = selector(item);
        if (value > max) {
            max = value;
            res = [item];
        }
        else if (FMath_1.approxEquals(value, max))
            res.push(item);
    }
    return res;
}
exports.maxItems = maxItems;
function sum(array) {
    let res = 0;
    for (var item of array)
        res += item;
    return res;
}
exports.sum = sum;
function distinct(array) {
    let firstOccurence = (item, index) => array.findIndex(i => i.equals(item)) === index;
    return array.filter(firstOccurence);
}
exports.distinct = distinct;
function flatMap(array, selector) {
    return new Array().concat(...array.map(selector));
}
exports.flatMap = flatMap;
