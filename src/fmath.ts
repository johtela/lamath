/**
 * Constants for factors of π.
 */
export const twoPI = Math.PI * 2
export const PIover2 = Math.PI / 2
export const PIover4 = Math.PI / 4
export const PIover8 = Math.PI / 8
export const PIover16 = Math.PI / 16

/**
 * Compares two numbers for approximate equality. At most the arguments 
 * can differ by the value specified by the epsilon parameter.
 * @param x First value.
 * @param y Second value.
 * @param epsilon Maximum allowed difference.
 */
export function approxEquals(x: number, y: number,
    epsilon: number = 0.000001): boolean {
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

/**
 * Return the decimal part of a number. The integer part will be zero.
 * @param x The input number.
 */
export function fract(x: number): number {
    return x - Math.floor(x);
}

/**
 * Clamp a number into a specified range. Values outside the range
 * will be clamped to lower and upper bounds respectively.
 * @param x The input number.
 * @param min Minimum value of the output range.
 * @param max Maximum value of the output range.
 */
export function clamp(x: number, min: number, max: number): number {
    return x < min ? min :
        x > max ? max :
            x;
}

/**
 * Calculate a linear interpolation between two values corresponding
 * to input positions 0 and 1. By specifying a interpolated position 
 * < 0 or > 1 you can extrapolate backwards and forwards.
 * @param start The value of the linear function at position 0.
 * @param end The value of the linear function at position 1.
 * @param interPos The interpolated position. 
 */
export function mix(start: number, end: number, interPos: number): number {
    return start + (interPos * (end - start));
}

/**
 * Return zero if the input value is smaller than the edge value, and
 * one if it is greater.
 * @param value The input value.
 * @param edge The edge value after which the result flips from 0 to 1.
 */
export function step(value: number, edge: number): number {
    return value < edge ? 0 : 1;
}

/**
 * Return a value in range [0, 1] depending on where the input value is
 * compared to two edge values. If the input value is smaller than the
 * lower edge, the result is zero. Conversely, if the input value is
 * greater than the upper edge, the result is one. If the input value is
 * between the lower and the upper edge, the result is a quadratic (smooth) 
 * interpolation in range of (0, 1). If lower and upper edge are the same,
 * the result is binary like in the {@link step} function,
 * @param value The input value.
 * @param edgeLower The lower edge value below which the result is zero.
 * @param edgeUpper The upper edge value after which the result is one.
 */
export function smoothStep(value: number, edgeLower: number, edgeUpper: number): number {
    if (edgeLower == edgeUpper)
        return step(value, edgeLower);
    let t = clamp((value - edgeLower) / (edgeUpper - edgeLower), 0, 1);
    return t * t * (3 - (2 * t));
}