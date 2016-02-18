---
layout: post
title:  "How do you wipe?"
date:   2016-02-14 12:00:00
desc: Text wipe transition animation techniques at the copy block or character level.
tags: ["Greensock", "animation", "CSS", "JavaScript", "wipe transition"]
---

The text wipe animation is a familiar means of introducing text to a frame, or, alternatively, removing text before transitioning the next bit of copy into a frame. Typically the text position remains static while it is apparently wiped away from one direction or another. So how to go about achieving a clean wipe?

When going for a wipe effect, I had until recently focused on one techique. I'll call this the "hidden overflow container" technique. Basically, the text is held in a container with hidden overflow. When you are ready to wipe, the container gets translated in one direction, while the text gets translated in an equal and opposite direction.

This technique gives you a wipe with a very clean boundary, which may be precisely what you're looking for. However, if the purpose of your wipe is merely to have an elegant means of transitioning text without just using a simple fade or a fly-off, then this other technique may be for you. I'll call this the "character wrap" technique. In this case, individual characters are identified in the markup so that they can be animated off the page one at a time, giving the appearance of a subtler wipe effect.

Both of these techniques have their advantages and disadvantages, but the bottom line is that they don't look the same. In the first case, the control of the animation and how it looks happens at the scale of the block of copy, whereas in the latter case it is at the scale of the character.

See below for some examples on how these look and work. All but the first example use the amazing [Greensock animation library](https://greensock.com/).


### Wiping with an `overflow: hidden` container

Again, the idea here is to have your text in a container with `overflow: hidden`. To show or hide the text, translate the text into or out of the container while translating the container an equal distance in the opposite direction. The text should appear to remain still on the page while being 'wiped' away.

If you remove the `overflow` property on your wipe container, the wipe text should be positioned exactly where you want it to appear in the frame. You can more easily visualize the relative positions of the wipe container and the wipe text by removing the `overflow` property on the container and giving it a `background-color`.

In the demo below, the first animation container has its `overflow` property set to `hidden`. That is the only difference between this and the second animation container, which has `overflow` set to `visible`. The third container has `overflow: hidden` with no bg colors on the text or the container. This is the 'wipe' effect we're going for!

<p data-height="268" data-theme-id="0" data-slug-hash="LGqwqY" data-default-tab="result" data-user="benjanes" class='codepen'>See the Pen <a href='http://codepen.io/benjanes/pen/LGqwqY/'>Wipe Visualization</a> by Ben Janes (<a href='http://codepen.io/benjanes'>@benjanes</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## Angled edge wiping

What if we want the leading edge of the wipe to be set at an angle? Applying a skew to the container gives the container edge an angle. We need to remember to give the text a commensurate skew in the opposite direction in order for the text to appear unskewed.

<p data-height="268" data-theme-id="0" data-slug-hash="rxqKpw" data-default-tab="result" data-user="benjanes" class='codepen'>See the Pen <a href='http://codepen.io/benjanes/pen/rxqKpw/'>Angled Wipe</a> by Ben Janes (<a href='http://codepen.io/benjanes'>@benjanes</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## Wipe on, Wipe off

We can wipe onto a frame just as easily as we can wipe off. Just be aware that the starting position of your wipe container should be offset in the direction from which you want your wipe to occur. In the below example, the container for the text getting wiped off the screen has a green background to make it a little more clear what is going on.

<p data-height="268" data-theme-id="0" data-slug-hash="dGgaEa" data-default-tab="result" data-user="benjanes" class='codepen'>See the Pen <a href='http://codepen.io/benjanes/pen/dGgaEa/'>Wiping on, wiping off</a> by Ben Janes (<a href='http://codepen.io/benjanes'>@benjanes</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## Bidirectional wipe

Getting fancier, we could wipe in two directions. This is surprisingly more difficult than you might expect at first. The idea is to have two wipe containers with the same text in each, with half of the text being shown in one container and half in the other. The containers need to be absolutely positioned so they can move around each other without affecting each other's positioning. An outer container is needed for each wipe so that the wiping of the text container doesn't actually reveal the remaining text that is positioned outside of the text container (remove `overflow: hidden` on the `.wipe-outer` element to see what I mean).

<p data-height="268" data-theme-id="0" data-slug-hash="ZQqRve" data-default-tab="result" data-user="benjanes" class='codepen'>See the Pen <a href='http://codepen.io/benjanes/pen/ZQqRve/'>Bi-directional wipe</a> by Ben Janes (<a href='http://codepen.io/benjanes'>@benjanes</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## Multidirectional wipe, AKA the TV set power-down

How about a wipe coming in from all sides, like the way TV screens used to look when turn you turned one off? One way to do this would be to make a set-up like above for the last demo, but for 4 containers instead of 2. That sounds like a lot of work and a lot of room for errors. An easier &mdash; though not perfect &mdash; alternative is to do opposing zooms on the container and the text. If you want to zoom your container down to `scale: 0.1`, you'd want your text to get zoomed to the inverse of 0.1 (1 / 0.1 = 10). Now, the endpoint scales are opposite each other. The reason this technique doesn't work perfectly is that the scales for the text and the container won't be each other's inverses at every point during the tween. To compensate for this, you can play around with the easing for the respective tweens to try to get them to more closely correspond to an inverse relationship. There is probably a formula you could use to figure out the correct tweens to use, but I'm not that invested in figuring this out!

<p data-height="268" data-theme-id="0" data-slug-hash="gPBKvJ" data-default-tab="result" data-user="benjanes" class='codepen'>See the Pen <a href='http://codepen.io/benjanes/pen/gPBKvJ/'>4-sided wipe</a> by Ben Janes (<a href='http://codepen.io/benjanes'>@benjanes</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

### Wiping via character wrapping

If we want to move the animation from the text container scale to the character scale, we need to wrap each individual character so that we can target it in the animation. Rather than actually going through and wrapping each character in a `<span>` tag manually, I added some jQuery to wrap the characters we want when the page loads. This could just as easily be done with vanilla javascript. Or, if you're a masochist, it could be done by wrapping each character by hand.

## Wiping with opacity

The `staggerTo`, `staggerFrom`, and `staggerFromTo` functions in the Greensock library are your friends when doing a series of the same animations on a bunch of elements that need to be slightly offset in your animation timeline. Animating a bunch of characters to achieve a 'wipe' effect is a perfect use case for these functions. Below, I've used `staggerTo` to fade each character in order.

With the list of 'stagger' functions, what you want to pay attention to if you're trying for a certain kind of wipe effect are the second and fourth parameters you pass in (second and fifth parameters in the case of `staggerFromTo`). The former of these is the duration of your animation, the latter is the offset time before the next element in your list will begin its animation. Try playing around with these values in the below demos to see how they work. 

Below is a wipe done by fading out each character individually. It makes the wipe look sort of like it has a blurred edge.

<p data-height="268" data-theme-id="0" data-slug-hash="OMdKYg" data-default-tab="result" data-user="benjanes" class='codepen'>See the Pen <a href='http://codepen.io/benjanes/pen/OMdKYg/'>Character Fade Wipe</a> by Ben Janes (<a href='http://codepen.io/benjanes'>@benjanes</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## Falling Down (not the Michael Douglas movie)

The next demo drops each character down in a series by scaling it down, then fading it out once it is scaled very small.

<p data-height="268" data-theme-id="0" data-slug-hash="WrPVWM" data-default-tab="result" data-user="benjanes" class='codepen'>See the Pen <a href='http://codepen.io/benjanes/pen/WrPVWM/'>Character Fall Wipe</a> by Ben Janes (<a href='http://codepen.io/benjanes'>@benjanes</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## 90 degree turn wipe

Another example of an animation you can do at the character level to get your text off the screen.

<p data-height="268" data-theme-id="0" data-slug-hash="OMaXJP" data-default-tab="result" data-user="benjanes" class='codepen'>See the Pen <a href='http://codepen.io/benjanes/pen/OMaXJP/'>Character Rotate Wipe</a> by Ben Janes (<a href='http://codepen.io/benjanes'>@benjanes</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## Multiline wipe &mdash; faking an angled wipe

To me, where this method starts to look especially slick is where you have your text on multiple lines. You can make what looks like an angled wipe on your multi-line copy by carefully considering your duration and offset parameters. Generally, having a higher animation duration and a shorter timing offset seem to give more of an 'angled wipe' appearance.

<p data-height="268" data-theme-id="0" data-slug-hash="rxPXgP" data-default-tab="result" data-user="benjanes" class='codepen'>See the Pen <a href='http://codepen.io/benjanes/pen/rxPXgP/'>Multi-line Character Wipe (faking an angled wipe)</a> by Ben Janes (<a href='http://codepen.io/benjanes'>@benjanes</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Alternatively, you could wrap each line, then wrap each character within a line. If you stagger when the character animations happen for each line, you could easily get a nice, angled look for your wipe.

### Further Considerations

In the character wrapping method, you may encounter situations where you want to do this animation but can't actually serve up the font you want to use in your animation (this happens all the time when developing banner ads). You could go about cutting out .png's of all of your characters, or spriting them into your animation container. If you have the font on hand, though, you could also make an SVG of the font, place it inline in your animation container, and animate the paths for each character you want to target. If characters are in more than one `<path>` element, group them together with a `<g>`. This isn't as accessible as text (or SVG text), but sometimes it is the best you can do!
