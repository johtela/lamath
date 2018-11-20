/**
 * Interface to compare two objects of a specific type.
 */
export interface Equatable<T>
{
    equals (other: T): boolean
}