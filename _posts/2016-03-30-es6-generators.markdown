---
layout: post
title: "Generator Functions"
date: 2016-03-30 12:00:00
desc: How can we use a generator function?
tags: ["JavaScript", "Generator function", "ES6", "ES6 Generator"]
---

Generators in ES6 provide a way to lazily evaluate a function. Say we start to execute a generator function and then exit out of it. Normally (*i.e.*, in the case of a return statement in a function) this would mean that we are done with this function. In the case of a generator, at some later point we can re-enter the generator function where we left off and evaluate the next part.

This gives us another tool for handling asynchronous code. When we combine the powers of generators with those of promises, we end up being able to write code that *looks synchronous* but gets evaluated asynchronously. In other words, we can write asynchronous code that looks really nice! I will get to that in the next post, but for now let's explore how generator functions work.

Generator functions are declared using `*` as either `function* myFunc(){}` or `function *myFunc(){}`. When a generator function is called, the function itself isn't executed at all. Instead, an iterator object is returned. To evaluate the generator function, we call `.next` on the returned iterator. When we call `.next`, what happens is:
1. The generator function is evaluated up to the first `yield` statement, 
2. This returns an object and pops the control flow out of the generator,
3. The control flow returns to the point in the code at which `.next` was called. 

The object returned when calling `.next` has a `.value` property and a `.done` property. The `.value` property is equal to the the evaluation of the expression directly after the `yield` statement (on the same line). The `.done` property is a boolean that indicates if the end of the generator function has been reached. The next time that we call `.next` on the iterator object, evaluation of the generator object will pick up where it left off and go until the next `yield` statement is reached.


{% highlight javascript %}
// let's make a simple generator function
function *myGenerator(x, y, z) {
  yield x;                    // line1
  y += x;                     // line2
  yield y;                    // line3
  z += y;                     // line4
  yield z;                    // line5
  return 'now we are done';   // line6
}

// when we invoke myGenerator, it will return an iterator object...
// so let's assign that object to a variable so we can work with it
var myGenIterator = myGenerator(5, 10, 20);

// when we call .next on myGenIterator, we evaluate only as far as
// the first yield statement, on line1. this yield statement does
// 2 things. it pops the control flow out of the generator, and it
// returns an object.
var firstYield = myGenIterator.next();

// if we look at the object returned by .next, we'll see that it
// has two properties: .value and .done
console.log(firstYield); // --> logs { value : 5, done : false }

// now if we call .next again, we will evaluate the generator as 
// far as the yield statement on line3
// before the yield statement, the code on line2 will execute, so 
// the yield will return a value of y + x
var secondYield = myGenIterator.next().value;
console.log(secondYield); // --> logs 15

// on the next call of .next, we evaluate line4 and then hit the
// last yield on line5. you might expect that, because this is 
// the last yield in the generator, the returned object's .done
// property would be set to true. however, .done is relative to 
// the generator function body, not the yield statement's themselves
// ... calling .next on the iterator object won't return an object
// with .done === true until we hit a return statement or 
// the end of the generator function's body (the ending curly brace)
var thirdYield = myGenIterator.next();
console.log(thirdYield.value); // --> logs 35
console.log(thirdYield.done); // --> logs false

// on the next .next call, we reach the end of the generator. if
// we want to pass a value to the object returned by calling .next,
// we can do so using a return statement in the generator, which
// we have done on line6
var lastYield = myGenIterator.next();
console.log(lastYield.value); // --> logs 'now we are done'
console.log(lastYield.done); // --> logs true

// now that we've reached the end of the generator, we can call
// .next on the iterator object all we want. but it will always
// return the same thing:
var oneMoreYield = myGenIterator.next();
console.log(oneMoreYield); // --> logs { value : undefined, done : true }
{% endhighlight %}

Next time: combining generators and promises with `q.spawn`.