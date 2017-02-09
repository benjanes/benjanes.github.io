---
year: "2017"
month: "01"
day: "20"
filename: "haskell-nuggets-one"
title: "Haskell Nugget: Everything Curried"
date: 2017-01-20 12:00:00
desc: A basic concept in Haskell is that all functions are curried
tags: ["Haskell", "currying", "Javascript", "Functional Programming"]
---

example of partial application...
evaluation left to right...

I've been having a blast working my way through the excellent [Learn You a Haskell for Great Good](link) in my spare time. I don't know that I'll ever take my Haskell skills beyond the realm of toy problems, but the process of learning the language has already had an impact on how I think about writing Javascript, the main language that I use at work. I'd like to use this space to record first impressions of some of the fundamentals of Haskell (and perhaps of functional programming in general), and how these concepts map to Javascript.

The first thing I noticed when looking at Haskell type definitions (already a foreign concept for anyone who has JS as their first language) was... a lot of arrows. "That's a lot of function returns for one simple function," I thought. Take for example this function that adds 3 integers:

```
addThreeInts :: Int -> Int -> Int -> Int
addThreeInts a b c = a + b + c
```

When we define `addThreeInts` we place the type signature after the double colon, then supply the function itself below. So the type signature is `Int -> Int -> Int -> Int`. This indicates that the function `addThreeInts` takes an `Int` and returns a function that takes an `Int` which returns a function that takes an `Int` which returns an `Int`. Why then does the function definition look like it takes three arguments and has a single return? In Javascript, the same function would look like:

```
function addThreeInts(a, b, c) {
  return a + b + c;
}
```

Notice that the definitions look very similar. But, we still have that weird type signature. The Haskell type signature written as it is helps to drive home this point: everything is curried in Haskell! Functions can only ever accept one argument. If you write a function that is not unary, intermediate steps in applying arguments to that function will be returned functions. So when we call `addThreeInts` with one integer, `a`, what gets returned is a function. This function would have the type signature `Int -> Int -> Int`. Pass another `Int`, `b`, to this function, and the return value will be another function with type `Int -> Int`. In these intermediate steps, `a` and `b` are being applied to `addThreeInts` and we're returning a partially applied function. Pass a third integer, `c`, and we get the result of `a + b + c`.

Well, this is awesome. If we pass a single argument to this function as written in JS, we'd get a return value of `NaN` as we would be trying to add an integer to two `undefined`s. Of course, we can rewrite `addThreeInts` so that it is curried:

```
function addThreeInts(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    }
  }
}
```

This looks kind of ugly in ES5. In ES6, it starts to really resemble our Haskell type signature:

```
const addThreeInts = a => b => c => a + b + c;
```

The big difference here is that we had to change our function to make it curry. In Haskell, there isn't anyway around currying, as every function must be unary!