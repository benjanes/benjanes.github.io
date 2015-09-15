---
layout: post
title:  "A Menu Underline with Canvas"
date:   2015-09-15 12:00:00
desc: Making an animated canvas menu underline
---

A while back I set out to make an animated underline for a menu (check out the one on this page, which you'll see if you hover over a menu item). The goal was to have an underline under the active menu item that would animate over to any hovered menu item but return to the active menu item when menu items were unhovered. I first thought of doing this with CSS transitions, but I anticipated some issues with using a single underline element and having multiple transition states. I also wanted to include a clicking animation where the underline would bow/bend in the center when a menu item was clicked, and I didn't see this going down easily in CSS. Seeing as I eventually ditched the bending animation, CSS transitions may have been the way to go. Oh well! Below is a runthrough of how I went about doing this with `canvas` (including the clicking/bending animation). I used jQuery to make this a bit easier. A working demo can be seen [here](http://codepen.io/benjanes/pen/PPqMaQ).


### Overview

Here are the steps:

1. [Set up a menu with a canvas absolutely positioned behind it.](#html-and-css-set-up)
2. [Set up the canvas and rAF.](#setting-up-raf-and-canvas)
3. [Get references to the links, make an empty array to store link measurements, find the index of the 'active' menu link.](#link-business)
4. [Prepare variables used to draw and update an underline on the canvas.](#underline-variables)
5. [Create event handlers for hovering and clicking menu links.](#create-event-handlers)
6. [Measure the links and store their x-coordinate and width, set initial position and width of the underline using the 'active' menu link's measurements.](#measure-links-and-set-underline)
7. [Set up the drawing and updating functions for the underline.](#drawing-and-updating-functions)
8. [Add an animate function.](#animate-function)
9. [Set everything in motion &mdash; assign event handlers, call the measure and set functions, animate!](#kick-things-off)


### HTML and CSS Set-up

Briefly, the menu is a relatively positioned `<nav>` element, and an absolutely positioned canvas element is nested within the `<nav>`. The canvas is set to `left: 0`, as drawing coordinates for the underline will be measured relative to the `<nav>`.

##### HTML
{% highlight html %}
<nav>
  <a href="#" class="menu-link active">home</a>
  <a href="#" class="menu-link">products</a>
  <a href="#" class="menu-link">services</a>
  <a href="#" class="menu-link">our philosophy</a>
  <canvas id="underline"></canvas>
</nav>
{% endhighlight %}

##### CSS
{% highlight css %}
nav {
  position: relative;
}

.menu-link {
  text-decoration: none;
  margin-right: 2em;
  font-size: 1.2em;
  color: #000;
  font-family: Montserrat, Helvetica, Sans-Serif;
}

.menu-link:hover {
  color: red;
}

canvas {
  position: absolute;
  left: 0;
  z-index: -1;
}
{% endhighlight %}



### Setting up rAF and Canvas

The animation is done using requestAnimationFrame, which we'll want to grab a reference to for convenience. Before the canvas can be drawn on, we need to get a reference to it and get a 2d context. The width of the canvas is set equal to the width of the `<nav>` element, so that the underline has sufficient space to roam.

{% highlight javascript %}
var requestAnimFrame, canvas, ctx;

// a reference to rAF
requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function(callback) {
    return setTimeout(callback, 1);
  };

canvas = document.getElementById('underline');
ctx = canvas.getContext('2d');
// set the width of the canvas equal to the width of the nav element
canvas.width = $('nav').outerWidth();
{% endhighlight %}


### Link Business

We'll next get a jQuery collection of the menu links, create an empty array to store measurements of those menu links, and create a variable to mark which menu link is currently active.

{% highlight javascript %}
var $links, link_collection, currentIndex;

// the links and an array to store their respective measurements
$links = $('.menu-link');
link_collection = [];
// the index of the currently active menu link
currentIndex = $links.index( $('.active') );
{% endhighlight %}


### Underline Variables

Several variables are used to draw the underline on the canvas. Updating these variables and redrawing the canvas will animate the underline.

{% highlight javascript %}
var hoverIndex, ulineCurveStart, ulineCurveEnd, ulineX,
    ulineWidth, ulineStroke;

// vars to update when drawing the underline
hoverIndex = currentIndex;
ulineCurveStart = 0;
ulineCurveEnd = 0;
ulineStroke = 'black';
{% endhighlight %}

The `hoverIndex` variable will be used in conjunction with the collection of link measurements (to be built out later) to grab a set of measurements corresponding to the hovered link and update the underline drawing. `ulineX` and `ulineWidth` are the variables that will actually be getting updated and fed into the drawing function. Likewise with `ulineCurveStart` and `ulineCurveEnd`, which describe the bounds of the underline's curvature. `ulineStroke` is simply the underline's color. These variables will make more sense once the drawing function is defined.


### Create Event Handlers

The hover and click events need to update the variables used to draw the underline in order for it to actually animate. We'll next add in the event handler functions.

{% highlight javascript %}
var hoverOn, hoverOff, mouseDown, mouseUp;

// Event handlers. Update vars used to draw the underline
hoverOn = function() {
  // update hoverIndex to the index of the hovered link, draw the
  // underline in red
  hoverIndex = $links.index($(this));
  ulineStroke = 'red';
};

hoverOff = function() {
  // revert the hoverIndex to the currently selected menu link,
  // revert to black underline
  hoverIndex = currentIndex;
  ulineStroke = 'black';
};

mouseDown = function() {
  // this is the curve offset; greater values give a greater curvature
  // on click
  ulineCurveEnd = 5;
};

mouseUp = function() {
  // revert to a straight line, update the active menu item and update
  // currentIndex to the index of the selected menu item
  ulineCurveEnd = 0;
  $links.removeClass('active');
  $(this).addClass('active');
  currentIndex = $links.index($(this));
};
{% endhighlight %}

All that the hover functions are doing is updating `hoverIndex` and the stroke color for the underline. Again, `hoverIndex` will be used to access the collection of link measurements when updating the drawing variables (specifically `ulineX` and `ulineWidth`). The click functions update the curve variables and reset the active link.


### Measure Links and Set Underline

The menu links need to be measured in order to know where to position the underline and how wide to make it. To do this, we loop through `$links` and measure the `position.left` and `outerWidth` of each, then store this information at a new index in `link_collection`. Now when a link is hovered, accessing `link_collection[hoverIndex]` will tell us what the left drawing coordinate and width of the underline should be. Because the currently active menu link should be underlined be default (and the underline will animate back to this position when other links are un-hovered), `ulineX` and `ulineWidth` can be set using `currentIndex`.

{% highlight javascript %}
var LinkMeasurement, measureLinks, setUnderline;

// constructor for adding a link to the collection
LinkMeasurement = function(x, width) {
  this.x = x;
  this.width = width;
};

// loop through the links and build out the collection of measurements
measureLinks = function() {
  $links.each( function(index) {
    // the 'round' lineCap combined with the lineWidth=3 on the
    // underline makes it 3 px longer on either side, so add 3 to
    // the left (x) coordinate to place the underline directly
    // underneath the text
    var x = $links.eq(index).position().left + 3;
    // likewise, subtract 6 from the text width to put the underline
    // right underneath the link text
    var width = $links.eq(index).outerWidth() - 6;
    // add these measurements to the collection of link measurements
    link_collection[index] = new LinkMeasurement( x, width );
  });
};

// set the underline measurements equal to the measurements for the
// currently selected menu link
setUnderline = function() {
  ulineX  = link_collection[currentIndex].x;
  ulineWidth = link_collection[currentIndex].width;
};
{% endhighlight %}


### Drawing and Updating Functions

The drawing function that paints the underline to the canvas utilizes the variables that are getting switched around by the event handler functions. Every time that `drawUnderline` is called, the canvas is first cleared and `updateUnderline` is called to recalculate the drawing variables (if they need recalculation).

{% highlight javascript %}
var drawUnderline, updateUnderline;

drawUnderline = function() {
  ctx.beginPath();
  // using round linecap and lineWidth = 3, adjust as desired...
  // changing these may require updating measureLinks function
  ctx.lineCap = 'round';
  ctx.lineWidth = 3;
  // x coordinate is variable ulineX, y coordinate can be adjusted to
  // change height of underline relative to the menu links
  ctx.moveTo( ulineX, 40 );
  // using a curve to draw the underline in order to allow for the
  // curvature animation on link click
  ctx.bezierCurveTo( ulineX, 40 + ulineCurveStart, ulineX + ulineWidth, 40 + ulineCurveStart, ulineX + ulineWidth, 40 );
  ctx.strokeStyle = ulineStroke;
  ctx.stroke();
};

updateUnderline = function() {
  // update underline x position
  if( ulineX !== link_collection[hoverIndex].x ) {

    if( ulineX < link_collection[hoverIndex].x ) {
      // if the underline is left of where it should be, move it right
      ulineX += (link_collection[hoverIndex].x - ulineX) / 10;
    } else if( ulineX > link_collection[hoverIndex].x ) {
      // if underline is right of where it should be, move it left
      ulineX -= (ulineX - link_collection[hoverIndex].x) / 10;
    }

  }

  // update underline width
  if( ulineWidth !== link_collection[hoverIndex].width ) {

    if( ulineWidth < link_collection[hoverIndex].width ) {
      // if underline is narrower than it should be, widen it
      ulineWidth += (link_collection[hoverIndex].width - ulineWidth) / 15;
    } else if( ulineWidth > link_collection[hoverIndex].width ) {
      // if wider than it should be, narrow it
      ulineWidth -= (ulineWidth - link_collection[hoverIndex].width) / 15;
    }

  }

  // update underline curve
  if( ulineCurveStart !== ulineCurveEnd ) {

    if( ulineCurveStart < ulineCurveEnd ) {
      // bend the center of the underline down
      ulineCurveStart += (ulineCurveEnd - ulineCurveStart) / 5;
    } else if( ulineCurveStart > ulineCurveEnd ) {
      // straighten the underline
      ulineCurveStart -= (ulineCurveStart - ulineCurveEnd) / 5;
    }

  }
};
{% endhighlight %}


### Animate Function

The `animate` function uses the reference to `requestAnimationFrame` to call itself when it can. Three things are happening when `animate` gets called &mdash; the canvas is cleared out, the underline drawing variables are recalculated, and the underline is redrawn using the current drawing variables.

{% highlight javascript %}
var animate;

animate = function(){
  // clear out what is drawn already
  ctx.clearRect( 0, 0, canvas.width, canvas.height );
  // update variables and redraw
  updateUnderline();
  drawUnderline();

  requestAnimFrame(function(){
    animate();
  });
};
{% endhighlight %}


### Kick Things Off

Now that everything is in place, all that remains to be done is to assign the event handlers to `$links`, call `measureLinks` to collect measurements for the links on the page, call `setUnderline` to have the default underline position and width set to that of the 'active' menu link, and set the underline in motion with `animate`.

{% highlight javascript %}
// assign event handlers
$links
  .hover(hoverOn, hoverOff)
  .on('mousedown', mouseDown)
  .on('mouseup', mouseUp);

measureLinks();
setUnderline();
animate();
{% endhighlight %}


### Hold Up! Loading Web Fonts

The link text needs to be rendered before it can be measured. If you are using a web font for the links and `$(document).ready` to delay page scripts until after the content is ready, an initial rendering of unstyled text will occur and measurement will take place before the styled, web font text is in place. If your web font text has different character sizing/spacing than the unstyled text (and it almost definitely does), the measurements used to draw the underline will be off!

Luckily, using Web Font Loader &mdash; a project jointly developed by Google and Typekit &mdash; makes watching for the loading of your web fonts really easy (check it out [here](https://github.com/typekit/webfontloader)).

After referencing the Web Font Loader library, a callback function can be added when loading in a font that will fire when that font is active (*i.e.* when it has been applied to the page).

##### HTML
{% highlight html %}
<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.5.18/webfont.js"></script>
{% endhighlight %}

##### JS
{% highlight javascript %}
var fontLoaded;

// create a callback list
fontLoaded = $.Callbacks();

// add to the callback list... everything is dependent on measureLinks
// having proper DOM measurements, and want to delay this until after
// the font-face is rendered
fontLoaded.add(function() {
  measureLinks();
  setUnderline();
  animate();
});

// see github.com/typekit/webfontloader for more info on
// Web Font Loader
WebFont.load({

  // using Montserrat font
  google: {
    families: ['Montserrat:400']
  },

  // when Montserrat:400 is ready, fire the callback list
  active: function(){
    fontLoaded.fire();
  }
});
{% endhighlight %}
