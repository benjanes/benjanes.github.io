---
layout: post
title:  "A Good Drag"
date:   2015-09-25 12:00:00
desc: Getting better dragging on canvas objects with EaselJS.
---

I have been checking out EaselJS lately as a tool to streamline some of the tasks of managing objects drawn on a canvas. When I looked at the EaselJS site's examples for dragging, I saw that dragged objects were getting recentered relative to the mouse coordinates, causing the object to jump a little when the mouse first moved. After looking through the docs a little further, I realized this was a pretty easy thing to fix, and it certainly isn't a bug. For more information on EaselJS and the whole CreateJS suite, check out [the CreateJS site](http://createjs.com/).


### Overview

1. [Mouse events in EaselJS.](#easeljs-mouse-events)
2. [Basic dragging example, with recentering.](#a-basic-drag)
3. [Better dragging, without recentering.](#a-better-drag)


### EaselJS Mouse Events

Objects created on the canvas with EaselJS can utilize the standard JavaScript events. In addition, there are a few unique events that EaselJS makes available, a couple of which &mdash; `pushmove` and `pushup` &mdash; are particularly relevant for dragging. The `pushmove` event is fired every time the mouse moves while a user has the mouse engaged (clicked down) over an object. Mouse events in EaselJS have `stageX` and `stageY` properties which indicate the coordinates within the canvas area (in EaselJS, the canvas area getting drawn on is a `stage` object). We can easily implement a drag by using `stageX` and `stageY` to update the position of an object during a related `pushmove` event.


### A Basic Drag

I'm not really going to go over the set-up of the canvas and easelJS `stage`. Here is one way to go about setting up some draggable objects in EaselJS:

{% highlight javascript %}

// get a reference to the canvas element on the page, and
// use this to initialize a createJS 'stage', which will
// hold any easelJS objects we make
var canvas = document.getElementById('canvas'),
    stage = new createjs.Stage(canvas),

    // the circles we'll make
    circleA, circleB;

// we'll make our own Circle object, which uses the
// createjs.Shape object as its prototype
Circle.prototype = new createjs.Shape();

// use Circle to create a new instance of the Circle object
Circle.constructor = Circle;

// the Circle constructor
function Circle(xpos, ypos, color, radius) {
  // call super constructor, ensures proper binding of 'this'
  // such that new instances of Circle are not bound to each other
  createjs.Shape.call( this );

  // draw the circle using the arguments passed in
  this.graphics.beginFill(color);
  this.graphics.drawCircle(0, 0, radius);
  this.x = xpos;
  this.y = ypos;
  this.graphics.endFill();

  // assign handlers
  this.on('pressmove', this.handlePressmove);
}

// handler for the movement of the mouse while it is
// engaged over an instance of the Circle object
Circle.prototype.handlePressmove = function(e) {
  // update the X and Y coordinates of the object using the
  // X and Y coordinates of the mouse relative to the stage area
  this.x = e.stageX;
  this.y = e.stageY;

  // update the stage so that the object actually moves!
  stage.update();
};

// create a couple of instances of the Circle object
var circleA = new Circle(40, 40, '#000', 40);
var circleB = new Circle(100, 100, 'orange', 30);

// add these objects to the stage
stage.addChild(circleA);
stage.addChild(circleB);

// draw the new objects on the stage
stage.update();

{% endhighlight %}

The important part of the code here is the `handlePressmove` method. What the problem boils down to is this:

1. Before a circle object is clicked, it has set X and Y coordinates (`this.x` and `this.y`). In the case of a circle, those coordinates are for the center point.
2. On click, `this.x` and `this.y` remain fixed.
3. When the clicked cursor moves, the `handlePressmove` method resets `this.x` and `this.y` to wherever the cursor happens to be within the easelJS stage using the `stageX` and `stageY` properties of the associated event. The center of the circle object will jump to those cursor coordinates (unless the user happened to click on the exact center of the circle before dragging).

A fix for this jump is to calculate the offset of the cursor relative to the center point of the object, and use this offset to adjust `this.x` and `this.y` when the cursor moves. The local `localX` and `localY` properties of an EaselJS mouse event give the mouse location relative to the coordinate system of the object being interacted with, rather than relative to the canvas or stage. These properties are available during the `pressmove` event. However, `localX`,`localY` update to 0,0 (the circle's center point) as soon as the object moves. What we need is to capture the `localX` and `localY` of the cursor on the object when the `mousedown` occurs.


### A Better Drag

To get a better drag, we utilize the `mousedown` event to capture `localX` and `localY` coordinates for the cursor (cursor coordinates relative to the center point of the object being clicked), then use these coordinates to calculate an offset for the update to `this.x` and `this.y` done in the `pressmove` handler. The majority of the code remains the same as above:

{% highlight javascript %}

// the Circle constructor
function Circle(xpos, ypos, color, radius) {
  // call super constructor ...
  // draw the circle ...

  this.localX = xpos;
  this.localY = ypos;

  // assign handlers
  this.on('mousedown', this.handleMousedown);
  this.on('pressmove', this.handlePressmove);
}

Circle.prototype.handleMousedown = function(e) {
  this.localX = e.localX;
  this.localY = e.localY;
};

Circle.prototype.handlePressmove = function(e) {
  this.x = e.stageX - this.localX;
  this.y = e.stageY - this.localY;

  stage.update();
};

{% endhighlight %}

Now when the mouse moves during a `pressmove` event, the update to the object's x and y coordinates are offset by the coordinates of where the object was clicked. No more jump on drag.
