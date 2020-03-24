
# ![Logo](images/llama.svg) LAMATH 

[![Build Status](https://travis-ci.org/johtela/lamath.svg?branch=master)](https://travis-ci.org/johtela/lamath)
[![Version](https://img.shields.io/npm/v/lamath)](https://www.npmjs.com/package/lamath)

## Linear Algebra Math Library for Javascript/Typescript 

LAMATH is a basic linear algebra library designed to be used with WebGL and 
Typescript. The library depends on neither of them, so it can be used in any 
JS/TS project that needs vector math.

Features include:

- Vectors of any length, although explicit types are defined for 2D, 3D, and 4D
  vectors.
- Matrices of any dimensions. Square matrices, 2×2, 3×3, and 4×4 matrices have
  their own subtypes.
- Quaternions.

Performance, simplicity, and generality are the main design goals of the 
library. Vectors and matrices are defined simply as arrays of numbers, no 
wrapper objects are used. This minimizes the number of allocations and 
alleviates GC pressure. If required, it is possible also to reuse the 
vector/matrix arrays by explicitly specifying the result of the operations.

