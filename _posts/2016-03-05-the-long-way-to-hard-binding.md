---
year: "2016"
month: "03"
day: "05"
filename: "the-long-way-to-hard-binding"
title: "The Long Way to Hard Binding"
date: 2016-03-05 12:00:00
desc: Hard binding using Function.prototype.bind
tags: ["JavaScript", "JS Fundamentals", "keyword this", "execution context"]
---

I've been using `Function.prototype.apply` and `Function.prototype.call` for a while now. I remember when I was reading about them on MDN for the first time. I looked at `.apply` and said, "Why would I ever use this, I can pass in my arguments individually to `.call` without having to put them into an array!" Not long after, I said something along the lines of, "Oh yeah, `arguments`!!"

At the same time I was first learning about `.apply` and `.call`, I read up on `.bind`. I couldn't for the life of me determine why I would ever want to use `.bind` when I could just use `.call`. Because of this, I pushed `.bind` off to the side and tried to forget about it. Well, I just had my "`.bind` aha moment". It is awesome. And it was there right under my nose in the first line of the MDN description the whole time. To quote [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) (emphasis added):

> The bind() method **creates a new function** that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.

The big difference between `.bind` and those other two Function prototype methods is that `.bind` returns a function. That returned function essentially serves as a wrapper for calling `.apply`, such that the context you want for your outer function is hard bound. The potential for any binding ambiguity provided by `.apply` or `.call` is no longer an issue. What's more, because a function is returned, you can use `.bind` to specify the context in a callback function!

To illustrate:

```
var myObj = { x : 1 };

var addToX = function() {
  this.x++
};

// if we call addToX in the global context, nothing happens 
// --> x is not defined in the global context
addToX();

// console.log(myObj.x) --> 1
// console.log(x) --> NaN

// if we use .call to bind myObj to addToX, 
// we get x to increment in addToX
addToX.bind(myObj);

// console.log(myObj.x) --> 2

// now if we try to use .call in a callback, we are invoking 
// it as soon as the setTimeout is encountered, **not after 
// 500 milliseconds**. what is actually getting passed to 
// setTimeout is the return value for .call (undefined) and the 
// wait value (500)
setTimeout( addToX.call(myObj), 500);

// console.log(myObj.x) --> 3 
// ... but it didn't happen when we wanted it to

// we can get around this issue by passing a function to be 
// run by setTimeout which will in turn invoke .call
setTimeout( function() {
  addToX.call(myObj);
}, 500);

// console.log(myObj.x) --> 4 
// ... and it happened when we wanted it to!

// but wait, we can simplify just a bit with our friend .bind! 
// we take advantage of the fact that .bind returns a function
setTimeout( addToX.bind(myObj), 500);

// console.log(myObj.x) --> 5 
// ... proper binding, when we want it
// ... and we didn't need to wrap it in an anonymous function
```