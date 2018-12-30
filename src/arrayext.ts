/**
 * Clone a 2D array.
 * @param array - The array to be cloned.
 */
export function clone<T>(array: T[][]): T[][] {
    let rows = array.length
    let res = Array<T[]>(rows)
    for (let r = 0; r < rows; r++)
        res[r] = array[r].slice()
    return res
}

/**
 * Fill an array of a specified size with a same value.
 * @param value The value used to fill an array.
 * @param count Number of times the value is repeated.
 */
export function repeat<T>(value: T, count: number): T[] {
    var res = Array<T>(count)
    for (var i = 0; i < count; i++)
        res[i] = value
    return res;
}

/**
 * Return the sum of numbers in an array.
 * @param array The array to be summed.
 */
export function sum(array: number[]): number {
    let res = 0
    for (var item of array)
        res += item
    return res
}

/**
 * The flatMap() method first maps each element using a mapping function, 
 * then flattens the result into a new array.
 * @param array The array of items to be flattened.
 * @param selector Function that returns an array for a given item.
 */
export function flatMap<T, U>(array: T[], selector: (item: T) => U[]): U[] {
    return new Array<U>().concat(...array.map(selector))
}