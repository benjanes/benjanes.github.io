---
layout: post
title: "Animated SVG/React Line Graphs"
date: 2016-05-21 12:00:00
desc: Putting things together for an animated line graph with React and SVG
tags: ["SVG", "data", "React", "GreenSock"]
---

We've already covered [how to generate an SVG path from a set of data](/2016/05/10/react-svg-graphs.html) and [how to do some basic path interpolation between data points](/2016/05/14/svg-data-interpolation.html). So we can now construct curved paths from a data set and render them to an SVG. That is great for rendering out one set of data onto a line graph. But what if this data is continually updating? Is there a way to animate incoming data onto the graph so that the data stream appears continuous, rather than having the paths jump each time the data updates?

The technique I'm about to outline is reliant on having new data coming in at a known, fixed interval. The reason for this will become clear as we move through an example. We will use GreenSock's `TweenMax` for the line animation.

We should first consider what it is exactly that we will be animating. We want the line paths to move across the graph. We don't need to animate the drawing of the paths. Instead we can do a little fakery by translating the lines, giving the *appearance* of the lines being drawn on the graph. This requires us to always have the newest data just off the graph &mdash; animating that data point onto the graph will drive the entire line forward.

Let's go back to the data set from last time: `[4.5, 52, 37, 91]`. We can establish now that we are getting a new data point every 10 seconds, so this array represents 40 seconds worth of data. Now, we need to establish a direction for the data before we move on. I'm going to say that new data points are added to the end of the array; so, 91 is the last data point that we received. On our graph's x-axis, let's say that at `x = 0`, we have the current time, and as we move right on the graph we are going back in time.

<svg width="400" height="50" viewBox="28 48 200 25">
  <path stroke="#000" stroke-width="1" fill="none" d="M 30 54 L 30 50 L 80 50 L 80 54 L 80 50 L 130 50 L 130 54 L 130 50 L 180 50 L 180 54" />
  <text x="28" y="64" font-size="8">NOW</text>
  <text x="78" y="64" font-size="8">10 sec ago</text>
  <text x="128" y="64" font-size="8">20 sec ago</text>
  <text x="178" y="64" font-size="8">30 sec ago</text>
</svg>

Now let's say that we don't have this data all at once, but it is coming in to our React app at 10 second intervals. So when the app receives its first data point at time zero, we have one item in our array of data (`4.5`). After 10 seconds, we get another data point, `52`. Now we have a path, which we can start animating onto the graph. In another 10 seconds, we get in `37`, add another section to our path, and continue animating the path onto the graph.

We are now going to go over the set-up for this. It is going to look slightly different from the previous post, but the ideas are all the same!

{% highlight javascript %}
// let's make a container/component for our line graph
import React, { Component } from 'react';
// we aren't going to go over the redux set-up at all,
// but to make this work with real data we would probably
// want to have redux handling the incoming data for us
import { connect } from 'react-redux';
// and we'll use TweenMax for the animation part
import TweenMax from 'gsap/src/minified/TweenMax.min';

// one helper function will be used for transforming
// data into paths as the data comes in
const transformData = (data, xCoord) => {
  let x = xCoord;
  return data.reduce((path, point, index, collection) => {
    if (!index) {
      path += `${x} ${100 - point}`;
    } else {
      path += `C ${x + 5} ${100 - collection[index - 1]} ${x + 5} ${100 - point} ${x} ${100 - point}`;
    }
    x -= 10;
    return path;
  }, 'M');
};

class LineGraph extends Component {
  // we need to have a few things in the component state,
  // so let's use a constructor function
  constructor(props) {
    super(props);
    this.state = {
      dataPath: '',
    };
  }

  componentWillReceiveProps(props) {
    // props.data is the array of points
    this.setState({
      dataPath: transformData(props.data, -10),
    });
  }

  render() {
    return (
      <svg width="100%" height="400" viewBox="0 0 40 100" preserveAspectRatio="none">
        <g id="line_container">
          <path stroke="#000" fill="none" d={this.state.dataPath} />
        </g>
      </svg>
    );
  }
}
{% endhighlight %}

What we have now is a path that can grow indefinitely to the left. The last thing that is missing is the movement of the line onto and across the graph. We can add a Greensock `TweenMax` call to `componentWillReceiveProps` to cause this motion. If we animate `#line_container` rather than the path itself, we can later add additional paths to the container and only animate one node instead of many. If it is safe to assume we are receiving new props not more than once every 10 seconds, a 10 second duration for the animation should give a relatively smooth sequence as the path is added to. We are going to animate only when we receive new properties and have additional path to show. Note that we are passing `-10` as a starting x-coordinate to `transformData` when setting the state in `componentWillReceiveProps`. This means that the paths will be starting off the graph, and we won't start to see the lines animating onto the graph until the next, incoming section has been built.

To add in the animation so that we can actually see the path as it grows:

{% highlight javascript %}
// everything up here is the same. TweenMax has
// already been included.

// helper function is the same

class LineGraph extends Component {
  // constructor is unchanged

  componentWillReceiveProps(props) {
    // props.data is the array of points
    this.setState({
      dataPath: transformData(props.data, -10),
    });
    // every time we get new props and additional path
    // to render, we will animate the line container to the 
    // right (x: '+=10') for 10 seconds, with linear easing
    TweenMax.to('#line_container', 10, { x: '+=10', ease: Power0.easeNone });
  }

  render() {
    return (
      <svg width="100%" height="400" viewBox="0 0 40 100" preserveAspectRatio="none">
        <g id="line_container">
          <path stroke="#000" fill="none" d={this.state.dataPath} />
        </g>
      </svg>
    );
  }
}
{% endhighlight %}

So what we end up with is a `LineGraph` component that takes an array of data as a property. Subsequent arrays that get passed have new data points added to the end of the array. The component builds a new path from the array every time this property updates. The path will always start at `x = -10` for the first point in the array (which happens to be the oldest data point). Additional data points will build onto the path to the left. As the additional properties are received every 10 seconds, the container that holds the data path will be animated to the right, so that new sections of the path are animated onto the graph as they are assembled.