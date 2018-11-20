"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
function map(iter, mapper) {
    var _i, iter_1, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, iter_1 = iter;
                _a.label = 1;
            case 1:
                if (!(_i < iter_1.length)) return [3 /*break*/, 4];
                item = iter_1[_i];
                return [4 /*yield*/, mapper(item)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
exports.map = map;
function filter(iter, predicate) {
    var _i, iter_2, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, iter_2 = iter;
                _a.label = 1;
            case 1:
                if (!(_i < iter_2.length)) return [3 /*break*/, 4];
                item = iter_2[_i];
                if (!predicate(item)) return [3 /*break*/, 3];
                return [4 /*yield*/, item];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
exports.filter = filter;
function reduce(iter, reducer, initial) {
    var result, _i, iter_3, item;
    return __generator(this, function (_a) {
        result = initial;
        for (_i = 0, iter_3 = iter; _i < iter_3.length; _i++) {
            item = iter_3[_i];
            result = reducer(result, item);
        }
        return [2 /*return*/, result];
    });
}
exports.reduce = reduce;
function first(iter) {
    for (var _i = 0, iter_4 = iter; _i < iter_4.length; _i++) {
        var item = iter_4[_i];
        return item;
    }
    return undefined;
}
exports.first = first;
function skip(iter, skipCount) {
    var _i, iter_5, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, iter_5 = iter;
                _a.label = 1;
            case 1:
                if (!(_i < iter_5.length)) return [3 /*break*/, 5];
                item = iter_5[_i];
                if (!(skipCount > 0)) return [3 /*break*/, 2];
                skipCount--;
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, item];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}
exports.skip = skip;
function take(iter, takeCount) {
    var _i, iter_6, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, iter_6 = iter;
                _a.label = 1;
            case 1:
                if (!(_i < iter_6.length)) return [3 /*break*/, 5];
                item = iter_6[_i];
                if (!(takeCount-- > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, item];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3: return [3 /*break*/, 5];
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}
exports.take = take;
function isEmpty(iter) {
    return first(iter) !== undefined;
}
exports.isEmpty = isEmpty;
function min(iter, selector) {
    var result = undefined;
    var minValue = Number.MAX_VALUE;
    for (var _i = 0, iter_7 = iter; _i < iter_7.length; _i++) {
        var item = iter_7[_i];
        var value = selector(item);
        if (value < minValue) {
            minValue = value;
            result = item;
        }
    }
    return result;
}
exports.min = min;
function max(iter, selector) {
    var result = undefined;
    var maxValue = Number.MAX_VALUE;
    for (var _i = 0, iter_8 = iter; _i < iter_8.length; _i++) {
        var item = iter_8[_i];
        var value = selector(item);
        if (value > maxValue) {
            maxValue = value;
            result = item;
        }
    }
    return result;
}
exports.max = max;
function every(iter, predicate) {
    for (var _i = 0, iter_9 = iter; _i < iter_9.length; _i++) {
        var item = iter_9[_i];
        if (!predicate(item))
            return false;
    }
    return true;
}
exports.every = every;
function any(iter, predicate) {
    for (var _i = 0, iter_10 = iter; _i < iter_10.length; _i++) {
        var item = iter_10[_i];
        if (predicate(item))
            return true;
    }
    return false;
}
exports.any = any;
