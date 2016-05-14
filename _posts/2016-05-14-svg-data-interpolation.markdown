---
layout: post
title: "SVG Data Interpolation"
date: 2016-05-14 12:00:00
desc: Making a line of data appear continuous
tags: ["SVG", "data"]
---

We previously started looking at [making an SVG line graph with a data set](/2016/05/10/react-svg-graphs.html), specifically with reference to rendering streaming data in React. So far what we have is an SVG path that we've assembled from one set of data. Our decibel-level data was `[4.5, 52, 37, 91]`. The resulting SVG path looks like this, with time plotted on the x-axis and decibels plotted on the y:

<svg width="150" height="100" viewBox="0 0 150 100">
  <path stroke="#FF0000" stroke-width="2" fill="none"
    d="M 0 95.5 L 50 48 L 100 63 L 150 9"
  />
  <path stroke="#000" stroke-width="1" fill="none" d="M 0 100 L 150 100" />
  <path stroke="#000" stroke-width="1" fill="none" d="M 0 0 L 0 100" />
</svg>

This path looks fine, but it is very clearly coming from discrete readings. If those data points are actually averages of data over the course of that time interval, then it may be more representative to show the data as a continuous curve. Regardless of whether or not it is more accurate, a curve is probably nicer to look at than a jagged line anyway!

We can use the `Curveto` command when building up our path from a set of data points to give the appearance of interpolation. Specifically, we want to use `C`, the cubic bezier curve command. Keep in mind that because we are using uppercase `C` and not lowercase `c`, all coordinates will be in absolute rather than relative units.

The syntax for using `C` when writing a path is:
{% highlight plaintext %}
C <control point 1> <control point 2> <end point>
{% endhighlight %}

We already know the end point (this will be the same coordinate that we moved to in our previous, jagged path). The control points may take a bit of tinkering to figure out what works for your data. The important thing to note is that the y coordinates of the control points will be proportional to the last point in the path and the next end point (the one that is part of the `C` syntax). It took me a little bit of tinkering to find something that worked well for my data. What I ended up doing is very simple &mdash; the x-coordinate for both control points is the mid-point between the point being drawn from and the end point; the y-coordinate for the first control point is equal to the y-coordinate for the point being drawn from, and the y-coord for the second control point is equal to the y-coordinate for the end point. So say we are drawing a section of our path from a data point at `(50, 16)` to the next data point at `(100, 47)`. Our `C` from point one to point two would look like this:

{% highlight plaintext %}
C 75 16 75 47 100 47
{% endhighlight %}

Again, `75` is the midpoint between our starting x (`50`) and our ending x (`100`). `16` is equal to our starting y, and `47` is equal to our ending y. `100 47` is our end point.

Let's write out the path from last time, but use `C` instead of `L` to draw from data point to data point. We ended up with `d="M 0 95.5 L 50 48 L 100 63 L 150 9"` last time for the following data: `[4.5, 52, 37, 91]`. Again, we need to do the small transform on the data of subtracting from 100 because we draw from the top down on our svg.

The path starts out the same. Our first point is just a starting point for the rest of the path, so we use the `M` command to move the path there:

{% highlight plaintext %}
d="M 0 95.5"
{% endhighlight %}

Our next point is (50, 48). Recall that our time interval (the x-axis) is a constant set to 50. We use the `C` command to draw the section to this next point:

{% highlight plaintext %}
d="M 0 95.5 C 25 95.5 25 48 50 48"
{% endhighlight %}

Again, control point 1 (`25 95.5`) has an x-coord that is the midpoint between the point being drawn from and the point being drawn to and a y-coord that is equal to the y-coord of the point being drawn from. Control point 2 (`25 48`) has the same midpoint x-coordinate and a y-coord that is equal to the y-coord of the point being drawn to. And of course the end point (`50 48`) is the point that we are drawing to.

When we finish off this path with the remaining data, we get the following:

{% highlight plaintext %}
d="M 0 95.5 C 25 95.5 25 48 50 48 C 75 48 75 63 100 63 C 125 63 125 9 150 9"
{% endhighlight %}

The resulting SVG looks like this:

<svg width="150" height="100" viewBox="0 0 150 100">
  <path stroke="#FF0000" stroke-width="2" fill="none"
    d="M 0 95.5 C 25 95.5 25 48 50 48 C 75 48 75 63 100 63 C 125 63 125 9 150 9"
  />
  <path stroke="#000" stroke-width="1" fill="none" d="M 0 100 L 150 100" />
  <path stroke="#000" stroke-width="1" fill="none" d="M 0 0 L 0 100" />
</svg>

Which is at least slightly more appealing than where we started:

<svg width="150" height="100" viewBox="0 0 150 100">
  <path stroke="#FF0000" stroke-width="2" fill="none"
    d="M 0 95.5 L 50 48 L 100 63 L 150 9"
  />
  <path stroke="#000" stroke-width="1" fill="none" d="M 0 100 L 150 100" />
  <path stroke="#000" stroke-width="1" fill="none" d="M 0 0 L 0 100" />
</svg>

To build this path in React from our starting array, we can adapt what we have from last time.

{% highlight jsx %}
// we have our starting data, which we map
// over to transform to the coordinate space
// of the svg we will be drawing on
var data = [4.5, 52, 37, 91].map(point => 100 - point);
// data now ==> [95.5, 48, 63, 9]


var path = data.reduce((result, point, i, coll) => {
  if (i === 0) {
    result.path += `${result.x} ${point}`;
  } else {
    result.path += `C ${result.x - 25} ${coll[i - 1]} ${result.x - 25} ${point} ${result.x} ${point}`;
  }
  result.x += 50;
  return result;
}, { path: 'M', x: 0 });
{% endhighlight %}

In the final part of this series, we'll look at how to make this graph dynamic &mdash; how to build the paths on the fly and how to animate the lines across the svg as additional data comes in!