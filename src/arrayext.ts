/**
 * Clone a 2D array.
 * @param array - The array to be cloned.
 */
export function clone<T> (array: T[][]): T[][]
{
    let rows = array.length
    let res = Array<T[]>(rows)
    for (let r = 0; r < rows; r++)
        res[r] = array[r].slice ()
    return res
}

/**
 * Fill a whole array with a same value, and return it back.
 * @param array The array to be filled and returned.
 * @param value The value used to fill the array.
 */
export function fill<T> (array: T[], value: T): T[]
{
    for (var i = 0; i < array.length; i++)
        array[i] = value
    return array
}

/**
 * Fill an array of a specified size with a same value.
 * @param value The value used to fill an array.
 * @param count Number of times the value is repeated.
 */
export function repeat<T> (value: T, count: number): T[]
{
    var res = Array<T> (count)
    for (var i = 0; i < count; i++)
        res[i] = value
    return res;
}