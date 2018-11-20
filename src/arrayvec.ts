import * as FMath from "./fmath"
import { Dim, Vec2, Vec3, Vec4, NewVec } from "./vectors"
import * as ArrayExt from "./arrayext"

class NewArrayVec implements NewVec<Vec2>, NewVec<Vec3>, NewVec<Vec4>
{
    constructor (readonly dimensions: number) { }

    get zero (): Vec2 & Vec3 & Vec4
    {
        return new ArrayVec (ArrayExt.fill (Array<number> (this.dimensions), 0))
    }

    unif (x: number): Vec2 & Vec3 & Vec4
    {
        return new ArrayVec (ArrayExt.fill (Array<number> (this.dimensions), x))
    }

    init (...values: number[]): Vec2 & Vec3 & Vec4
    {
        if (values.length != this.dimensions)
            throw RangeError (`Expected ${this.dimensions} components.`)
        return new ArrayVec (values)
    }

    fromArray (array: number[]): Vec2 & Vec3 & Vec4
    {
        if (array.length < this.dimensions)
            throw RangeError (`Expected ${this.dimensions} components.`)
        return new ArrayVec (array.slice (0, this.dimensions))
    }
}

export const newVec2: NewVec<Vec2> = new NewArrayVec (2)
export const newVec3: NewVec<Vec3> = new NewArrayVec (3)
export const newVec4: NewVec<Vec4> = new NewArrayVec (4)

class ArrayVec implements Vec2, Vec3, Vec4
{
    constructor (private array: number[]) { }

    get dimensions (): number
    {
        return this.array.length
    }

    component (index: number): number
    {
        return this.array[index]
    }

    with (index: number, value: number): ArrayVec
    {
        return new ArrayVec (this.array.map ((v, i) => i == index ? value : v))
    }

    get x (): number { return this.array[Dim.x] }
    set x (value: number) { this.array[Dim.x] = value }

    get y (): number { return this.array[Dim.y] }
    set y (value: number) { this.array[Dim.y] = value }

    get z (): number { return this.array[Dim.z] }
    set z (value: number) { this.array[Dim.z] = value }

    get w (): number { return this.array[Dim.w] }
    set w (value: number) { this.array[Dim.w] = value }
    
    swizzle (coords: Dim[]): number[]
    {
        var res = new Array (coords.length)
        for (var i = 0; i < res.length; i++)
            res[i] = this.array[coords[i]]
        return res;
    }

    private map (oper: (x: number) => number): ArrayVec
    {
        return new ArrayVec (this.array.map (v => oper (v)));
    }

    private map2 (other: ArrayVec, oper: (x: number, y: number) => number): ArrayVec
    {
        return new ArrayVec (this.array.map (
            (v, i) => oper (v, other.array[i])));
    }

    private reduce (oper: (acc: number, x: number) => number): number
    {
        return this.array.reduce ((c, v) => oper (c, v), 0);
    }
    
    get lenSqr (): number
    {
        return this.reduce ((a, x) => a + (x * x))
    }

    get len (): number
    {
        return Math.sqrt (this.lenSqr)
    }

    inv () : ArrayVec
    {
        return this.map (x => -x)
    }

    add (other: ArrayVec | number): ArrayVec
    {
        return other instanceof ArrayVec ? 
            this.map2 (other, (x, y) => x + y) :
            this.map (x => x + other)
    }

    sub (other: ArrayVec | number): ArrayVec
    {
        return other instanceof ArrayVec ? 
            this.map2 (other,(x, y) => x - y) :
            this.map (x => x - other)
    }

    mul (other: ArrayVec | number): ArrayVec
    {
        return other instanceof ArrayVec ? 
            this.map2 (other,(x, y) => x * y) :
            this.map (x => x * other)
    }

    div (other: ArrayVec | number): ArrayVec
    {
        return other instanceof ArrayVec ? 
            this.map2 (other,(x, y) => x / y) :
            this.map (x => x / other)
    }

    norm (): ArrayVec
    {
        let l = this.len
        if (l == 0)
            throw RangeError ("Cannot normalize zero vector")
        return this.map (x => x / l)
    }

    equals (other: ArrayVec): boolean
    {
        return this.array.every (
            function (v, i)
            {
                return v === other.array[i]
            })
    }

    approxEquals (other: ArrayVec, epsilon: number = 0.000001): boolean
    {
        return this.array.every (
            function (v, i)
            {
                return FMath.approxEquals (v, other.array[i], epsilon)
            })
    }

    dot (other: ArrayVec): number
    {
        return this.array.reduce (
            function (c: number, v: number, i: number)
            {
                return c + (v * other.array[i]) 
            }, 0)
    }

    cross (other: ArrayVec): ArrayVec
    {
        return new ArrayVec ([
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x])		
    }

    abs (): ArrayVec
    {
        return this.map (Math.abs)
    }

    floor (): ArrayVec
    {
        return this.map (Math.floor)
    }

    ceil (): ArrayVec
    {
        return this.map (Math.ceil)
    }

    round (): ArrayVec
    {
        return this.map (Math.round)
    }

    fract (): ArrayVec
    {
        return this.map (FMath.fract)
    }

    min (other: ArrayVec): ArrayVec
    {
        return this.map2 (other, Math.min)
    }

    max (other: ArrayVec): ArrayVec
    {
        return this.map2 (other, Math.max)
    }

    clamp (min: number, max: number): ArrayVec
    {
        return this.map (x => FMath.clamp (x, min, max))
    }

    mix (other: ArrayVec, interPos: number): ArrayVec
    {
        return this.map2 (other, (x, y) => FMath.mix (x, y, interPos))
    }

    step (edge: number): ArrayVec
    {
        return this.map (x => FMath.step (edge, x))
    }

    smoothStep (edgeLower: number, edgeUpper: number): ArrayVec
    {
        return this.map (x => FMath.smoothStep (edgeLower, edgeUpper, x))
    }

    toString (): string
    {
        return "[" + this.array.join (" ") + "]"
    }

    toArray (): number[]
    {
        return this.array
    }

    toFloat32Array (): Float32Array
    {
        return new Float32Array (this.array)
    }

    newVec (): NewArrayVec
    {
        return new NewArrayVec (this.dimensions)
    }

    toVec2 (): ArrayVec
    {
        return new ArrayVec (this.array.slice (0, 2))
    }

    toVec3 (z: number = 0): ArrayVec
    {
        switch (this.dimensions)
        {
            case 2: new ArrayVec ([...this.array, z])
            case 4: new ArrayVec (this.array.slice (0, 3))
            default: throw Error ("Unsupported conversion.")
        }
    }

    toVec4 (z: number = 0, w: number = 0): ArrayVec
    {
        switch (this.dimensions)
        {
            case 2: new ArrayVec ([...this.array, z, w])
            case 3: new ArrayVec ([...this.array, w])
            default: throw Error ("Unsupported conversion.")
        }
    }
}
