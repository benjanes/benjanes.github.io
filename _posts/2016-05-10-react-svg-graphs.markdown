---
layout: post
title: "React SVG Graphs"
date: 2016-05-10 12:00:00
desc: Turning a stream of data into an SVG graph in React
tags: ["React", "SVG", "data"]
---

I am currently working on a React/Redux project where we are trying to visualize a stream of incoming data. Our team kicked around some ideas about how to render the data into a graph with multiple lines. The main goals we had in mind were: 

1. Having some flexibility in formatting and styling our display, 
2. Interpolating between subsequent data points as they come in, and 
3. Animating the display to make the data stream appear continuous.

We tried a handful of D3, React/D3, and React-based pre-existing solutions, but couldn't quite find what we were looking for. Ultimately I decided to try to write my own solution. Thanks to React's inherent rendering abilities, it wasn't nearly as difficult as I'd expected.

Our data source is coming in as objects, with a data point at each key. As a new object comes in, we add the data points to a data-tracking object that stores the data for each key as an array. Once an array reaches a certain length, we'll knock the oldest value off when a new value comes in. As an example:

{% highlight javascript %}
// let's say we are measuring the decibel level
// of various neighborhood noises every minute.
// every minute we get an object that looks like this:
{ dogs: 12, cats: 4, lawnmowers: 34, cars: 16 }

// we also have an object that stores all of our
// incoming data points in arrays for each data source:
{ dogs: [], cats: [], lawnmowers: [], cars: [] }

// when new data comes in, we put the incoming data into
// our arrays. so after that first data object came in,
// our storage would look like:
{ dogs: [12], cats: [4], lawnmowers: [34], cars: [16] }

// subsequent data points get added to the end of each
// array. so if we got in some new data:
var newData = { dogs: 6, cats: 8, lawnmowers: 2, cars: 41 }
var storage = { dogs: [12, 6], cats: [4, 8], lawnmowers: [34, 2], cars: [16, 41] }

// the last part here is that if the arrays grow beyond
// a certain point, we will start to cull the oldest
// values
{% endhighlight %}

Now that we have the format of our data out of the way, let's look at how we can go about actually rendering it for display. We want to have a line graph, with one line per data source (dogs, cats, lawnmowers, and cars). Each line will be rendered as an svg `path`. Time will be on the x axis, and decibels will be on the y axis. We hopefully won't be going anywhere above 100 decibels in our neighborhood, so let's just assume that the scale on our y axis can be 0 to 100.

We know our x units are time, and we also know that we are getting a new data point every minute. So we can safely say that even x-axis intervals will separate our data points in a given path. We will be drawing these paths on an svg. Because svg coordinates start at the top left, we need to do a small transformation on our data to map it properly to our svg space. If our data is getting shown on a y-axis scale of 0 - 100 (and assuming we are certain that no values will be over 100), we can just subtract each value from 100. For instance, 16 becomes 84. This is because our graph will have its zero at the bottom... to go 16 units from the bottom of the graph, we need to move 84 units down from the top of the svg. 

So if we start with this array: [4.5, 52, 37, 91], we could convert it to [95.5, 48, 63, 9] to give us units we can use to render a path. Let's make a path out of the data! Again, time intervals between points are equal, so we'll move the same number of units of x for each point. For simplicity, let's go 50 units per point:

{% highlight html %}
<!-- again, our data looks like: [95.5, 48, 63, 9] -->
<svg width="150" height="100" viewBox="0 0 150 100">
  <path stroke="#000" stroke-width="1" fill="none"
    d="M 0 95.5 L 50 48 L 100 63 L 150 9"
  />
</svg>
{% endhighlight %}

Now we have a path that goes from (0, 95.5) to (50, 48) to (100, 63) to (150, 9). To actually build this path in React, we could do something like:

{% highlight jsx %}
var path = arr.reduceRight((result, point, i, coll) => {
  if (i === coll.length - 1) {
    result.path += `${result.x} ${point}`;
  } else {
    result.path += `L ${result.x} ${point}`;
  }
  result.x += 50;
  return result;
}, { path: 'M', x: 0 });
{% endhighlight %}

In the next two installments, we'll go over how to interpolate between data points, then finally how to bring it all together and animate the line graph as new data comes in.