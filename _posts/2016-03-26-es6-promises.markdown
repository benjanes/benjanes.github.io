---
layout: post
title: "ES6 Flavored Promises"
date: 2016-03-26 12:00:00
desc: Using the native Promise object in ES6.
tags: ["JavaScript", "Promises", "ES6", "ES6 Promise"]
---

My [last post](/2016/03/24/basic-promises.html) was a brief intro to creating promises with `q.defer`. ES6 incorporates a native `Promise` object that can be used to the same end. If you'd like to *promisify* an async function, return an instance of the `Promise` object from that function. The `Promise` constructor takes a callback (referred to as an "executor" function), which in turn takes `resolve` and `reject` callbacks. The body of the callback passed to the `Promise` constructor contains the functionality of the original async function, with return values getting passed to either the `resolve` (in the case of successful resolution) or `reject`. This is a lot clearer in code.

{% highlight javascript %}
// say we are working in node with an async function, e.g. 
// fs.readFile...
// if we were writing a function to do something with an 
// input, then pass the output from fs.readFile to a callback 
// (the standard callback set-up), it would look something 
// like this:
function doSomething(myInput, callback) {
  fs.readFile(myInput, function(err, body) {
    if (err) {
      callback(err);
    } else {
      callback(err, body.toString('utf8'));
    }
  });
}

// to switch this function to the promise pattern, we want 
// to be returning an instance of the promise object. instead 
// of passing the err and body values to a callback, we will 
// pass them to our resolve and reject functions that are 
// passed in as arguments to the promise's "executor" function
function doSomethingPromisey(myInput) {
  return new Promise(function(resolve, reject) {
    fs.readFile(myInput, function(err, body) {
      if (err) {
        reject(err);
      } else {
        // it is important to note here that the reject and
        // resolve functions can only take and pass a single 
        // value. if you want to keep a value from higher up
        // in a chain in scope, you either need to do some
        // nesting or pass that value directly in a resolve
        // (you could pass multiple values in an object
        // literal, for instance)
        resolve(body.toString('utf8'));
      }
    });
  });
}

// now when doSomethingPromisey gets called, it returns a 
// promise that will at some point be resolved or rejected.
{% endhighlight %}

This is what the code from the last post looks like when we switch it over from using `q.defer` to the ES6 `Promise` object:

{% highlight javascript %}
// the one difference here from the last post is that there
// is some error handling incorporated into the promises. if
// a reject is called at any point within a chain of .then's, 
// the remainder of that .then chain is skipped over until the
// .catch is reached. (see below where these functions are
// invoked)
function asyncAdd10(x) {
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

function asyncMultiply3(x) {
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

function asyncDivideBy5(x) {
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

// if we pass 10, 12 will get logged to the console after
// 3 seconds.
asyncAdd10(10).then(function(val) {
  return asyncMultiply3(val);
}).then(function(val) {
  return asyncDivideBy5(val);
}).then(function(val) {
  console.log(val);
}).catch(function(err) {
  console.log(err);
});

// however, if we pass a string, we will skip to the .catch
// as soon as that first reject function is called. so after
// one second, NaN will get logged to the console
asyncAdd10('I am not a number').then(function(val) {
  return asyncMultiply3(val);
}).then(function(val) {
  return asyncDivideBy5(val);
}).then(function(val) {
  console.log(val);
}).catch(function(err) {
  console.log(err);
});
{% endhighlight %}