---
layout: post
title: "Generators with Promises"
date: 2016-03-30 12:00:00
desc: What happens when generators join forces with promises? Only good things.
tags: ["JavaScript", "Generators", "Promises", "q.spawn", "ES6"]
---

In the [last post](/2016/03/30/es6-generators.html), we looked at the basics of how ES6 generators work. To sum up, generators give us a way to jump in and out of a single function, executing some portion of it each time we enter. The lazy evaluation capabilities of generators make them excellent candidates for executing asynchronous code. How might we go about setting this up? Recall that to iterate through a generator, we need to call `.next` on the iterator object returned when the generator is executed. If we make the `.next` calls from within the async functions and pass in the values that we want to return, we can asynchronously cycle through a generator.

{% highlight javascript %}
// let's start with some async functions
// in each of these, we are passing a return value to a 
// .next call on an iterator object (defined below)
function add10(x) {
  setTimeout(function() {
    myIterator.next(x + 10);
  }, 1000);
}

function multiply3(x) {
  setTimeout(function() {
    myIterator.next(x * 3);
  }, 1000);
}

function divideBy5(x) {
  setTimeout(function() {
    myIterator.next(x / 5);
  }, 1000);
}

// the generator function
function *myGenerator(x) {
  var a = yield add10(x);
  var b = yield multiply3(a);
  var c = yield divideBy5(b);
  console.log(c);
}

// when we call myGenerator, it returns an iterator
// object. this is what we are calling .next on in the 
// three async functions declared above.
var myIterator = myGenerator(10);

// now we can call .next on myIterator to the first line
// of the generator function to execute. when the yield
// statement is encountered, we pop out of myGenerator
// and start executing the async code in add10. when the
// .next is encountered in add10, we jump back into 
// myGenerator and start evaluating where we left off.
myIterator.next();

// after 3 seconds, 12 gets logged to the console

{% endhighlight %}

This example works fine and is really cool, but I think it is more illustrative than it is useful. The async functions can't get reused as written, as they are referencing a particular iterator object (`myIterator`). We can't pass in a reference to the iterator object when we create the generator function, because getting the iterator object in the first place is dependent on invoking the generator. How can this situation be improved upon? Using promises, of course!

What we want is for our generator function to yield out promise objects. This by itself won't remedy the situation of having to manually call `.next` on the iterator object. However, we can pass the generator function to another function that will handle the returned promises for us. There is a great [explanation of this technique](https://www.promisejs.org/generators/) by Forbes Lindesay on the PromiseJS website, along with the code for just such a function for handling promises returned by a generator. Various libraries have their own implementations. We can do this using the [Q module's](http://documentup.com/kriskowal/q/) `q.spawn()`. 


{% highlight javascript %}
// require in the q module after npm installing it
var q = require('q');

// we start out with our promise functions
function add10(x) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      if (typeof x !== 'number') {
        reject(NaN);
      } else {
        resolve(x + 10);
      }
    }, 1000);
  });
}

function multiply3(x) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      if (typeof x !== 'number') {
        reject(NaN);
      } else {
        resolve(x * 3);
      }
    }, 1000);
  });
}

function divideBy5(x) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      if (typeof x !== 'number') {
        reject(NaN);
      } else {
        resolve(x / 5);
      }
    }, 1000);
  });
}

// with q.spawn, we pass in a generator function.
// it immediately gets invoked, and the promises that
// are yielded get handled internally by the spawn method
q.spawn(function* () {
  var val1 = yield add10(10);
  var val2 = yield multiply3(val1);
  var val3 = yield divideBy5(val2);
  console.log(val3);
});
// after 3 seconds, 12 gets logged to the console
{% endhighlight %}

What if we wanted to pass some arguments to the generator function we are passing into `q.spawn`? The [example code at PromiseJS](https://www.promisejs.org/generators/) provides a nice way to pass in additional arguments to get called when the generator function gets executed. `q.spawn` doesn't have this option directly, but we can easily update how we pass in the generator function to accomodate this need.

{% highlight javascript %}
function makeGenerator(x) {
  return function *myGenerator() {
    var val1 = yield add10(x);
    var val2 = yield multiply3(val1);
    var val3 = yield divideBy5(val2);
    console.log(val3);
  };
}

q.spawn(makeGenerator(10));
// 12 gets logged to the console after 3 seconds
{% endhighlight %}