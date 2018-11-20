export const twoPI = Math.PI * 2
export const PIover2 = Math.PI / 2
export const PIover4 = Math.PI / 4
export const PIover8 = Math.PI / 8
export const PIover16 = Math.PI / 16

export function approxEquals (x: number, y: number, 
    epsilon: number = 0.000001) : boolean
{
    if (x === y)
        return true;

    let absX = Math.abs (x);
    let absY = Math.abs (y);
    let diff = Math.abs (x - y);

    if (x * y == 0)
        return diff < (epsilon * epsilon);
    else
        return diff / (absX + absY) < epsilon;
}

export function fract (x: number): number
{
    return x - Math.floor (x);
}

export function clamp (x: number, min: number, max: number): number
{
    return x < min ? min :
           x > max ? max :
           x;
}

export function mix (start: number, end: number, interPos: number): number
{
    return start + (interPos * (end - start));
}

export function step (edge: number, value: number): number
{
    return value < edge ? 0 : 1;
}

export function smoothStep (edgeLower: number, edgeUpper: number, value: number): number
{
    let t = clamp ((value - edgeLower) / (edgeUpper - edgeLower), 0, 1);
    return t * t * (3 - (2 * t));
}