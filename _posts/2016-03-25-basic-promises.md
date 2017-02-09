---
year: "2016"
month: "03"
day: "25"
filename: "basic-promises"
title: "Basic Promises"
date: 2016-03-24 12:00:00
desc: Barebones promises with q.defer().
tags: ["JavaScript", "Promises", "npm q"]
---

Promises are a fantastic means for dealing with asynchronous code. Lets say you have:

1. An asynchronous function (funcAsync)
2. A function that should run only after funcAsync has completed (funcCB)

This is a classic use-case for a callback function. However, what if funcCB is going to be calling a third function, and that function calling a fourth function? These nested callbacks can quickly spin out of control, making for code that is difficult to understand at best and easily broken at worst.

Instead of calling successive callback functions from within async functions, we can chain together these operations using promises. The basic premise of promises, as I understand them, is that an async function returns a promise. That promise lives on outside of the async function that returned it. When the async portion of the function completes, the promise is resolved and some value is passed. Alternatively, if an error occurs the promise can be rejected. To help stay positive, I'm only going to focus on resolved promises and chaining.

Kris Kowal's [Q](https://github.com/kriskowal/q) is a popular npm module for using promises in your client-side or server-side code. It served as the inspiration for Angular's `$q`. Below, we will use Q's `q.defer` to return promises from some async functions, then chain off of these returned promises (waiting for each one to be resolved in turn) using `.then`.

Let's first consider what some async functions might look like with callbacks:

```
// these 3 functions perform some asynchronous operations
function add10(x, cb) {
  setTimeout(function() {
    return cb(x + 10);
  }, 1000);
}

function multiply3(x, cb) {
  setTimeout(function() {
    return cb(x * 3);
  }, 1000);
}

function divideBy5(x, cb) {
  setTimeout(function() {
    return cb(x / 5);
  }, 1000);
}

// in order to string these async functions together, we 
// need to use nested callbacks. after 3 seconds, 12 is logged
// to the console
add10(10, function(x) {
  multiply3(x, function(y) {
    divideBy5(y, function(z) {
      console.log(z);
    });
  });
});
```

An alternative implementation with `q.defer`:

```
// make the q module available after
// npm install q'ing it into our package
var q = require('q');

// now each of these functions returns a promise. when the
// async code (the setTimeout) completes, we resolve the promise
// and pass on the value passed to resolve
function deferredAdd10(x) {
  var deferred = q.defer();

  setTimeout(function() {
    deferred.resolve(x + 10);
  }, 1000);

  return deferred.promise;
}

function deferredMultiply3(x) {
  var deferred = q.defer();

  setTimeout(function() {
    deferred.resolve(x * 3);
  }, 1000);

  return deferred.promise;
}

function deferredDivideBy5(x) {
  var deferred = q.defer();

  setTimeout(function() {
    deferred.resolve(x / 5);
  }, 1000);

  return deferred.promise;
}

// the way we can pass on the value passed to 'resolve' is
// by chaining these functions together with '.then'.
// after 3 seconds, 12 is logged to the console.
deferredAdd10(10).then(function(val) {
  return deferredMultiply3(val);
}).then(function(val) {
  return deferredDivideBy5(val);
}).then(function(val) {
  console.log(val);
});
```

Using promises flattens out our code, making it more readable and probably a lot easier to edit!