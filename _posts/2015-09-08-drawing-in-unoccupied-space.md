---
year: "2015"
month: "09"
day: "08"
filename: "drawing-in-unoccupied-space"
title:  "Drawing in Unoccupied Space"
date:   2015-09-08 12:00:00
desc: Drawing words randomly on a canvas without overlap.
tags: ["canvas", "JavaScript", "algorithms", "HTML5"]
---

I wanted to draw a series of randomly positioned words with variable size on a canvas element, such that the words wouldn’t overlap on the canvas. Now, I knew there was probably (definitely) a really smart way to do this, but I wanted to go through and see what I could come up with myself. So fair warning, this probably (definitely) isn’t the best way to go about doing this.

### The Overview

1. Go through each word and measure its dimensions as it will appear on the canvas, storing its width and height.
2. Randomly select a position for the largest word.
3. Randomly select a position for the next largest word. When drawn on the canvas, if the area occupied by this word overlaps with the last word drawn, find a new position from which to draw.
4. Repeat the selection process for all words.
5. Draw the words.

### Measuring Words

The first challenge was to measure text as drawn on the canvas. The canvas API has a handy native method for measuring text width, `measureText`. However, there is no such method for measuring text height. Because fonts vary wildly in character height and character position relative to the baseline, there wasn’t an easy way to measure height given the characters in a string. Figuring this out seemed way too complicated, so I went the grossly oversimplified route and just used the font px size that would be used when drawing the word to get a vague estimation of word height.

A string’s width on the canvas can be determined without actually drawing it onto the canvas. Once a 2d `context` has been established, string width is measured by first setting the `context.font` to the desired font size and font family, then passing the string of interest to the `measureText` method. In this case, `measureText` was called for a bunch of word objects in a collection, and the result for each string was stored in the respective object.

```
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

// an object that will later be defined and used to draw the canvas
var canvasDimensions = {};

// the collection of word objects, built elsewhere...
var wordList = [
    {
        word: 'word',
        font: '30px Arial',
        fontHeight: 30,
        color: 'RGBA(0,0,0,1)'
    },
    {
        word: 'cannotthinkofone',
        font: '10px Roboto',
        fontHeight: 10,
        color: 'RGBA(255,0,0,1)'
    },
    // … etc.
];

// find the width of a word and save it as fillWidth
var calculateWidths = function(value, index, array) {
    context.font = value.font;
    value.fillWidth = context.measureText(value.word).width;
};

wordList.map(calculateWidths);
```

### Finding Drawing Coordinates

Steps 2 through 4 were wrapped in a single function to which I could pass the collection of word objects. Within this function, I wanted to loop through the collection and find drawing coordinates for each word. The loop needed to build out a list of occupied spaces on the canvas for each word to be drawn, and this growing list needed to be accessible to each subsequent iteration of the loop. I started with an empty array to store the collection of occupied spaces within the wrapper, then made an occupied space constructor.

```
// set-up canvas context, measure words in wordList

var findDrawingCoordinates = function(array) {

    // the collection of occupied spaces
    var occupiedZones = [];

    function OccupiedZone(minX, maxX, minY, maxY) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    // the rest…
};
```

The next step was to write the function that would loop through the passed array and actually find a location for each word. This point selection function first randomly selects a rotation for the word to be drawn, then randomly selects a starting X and starting Y coordinate from which to draw the selected word. The corners of the rectangular space occupied by the given word are determined by the rotation value. To keep things simple (and clean looking in the final drawn canvas), I limited the possible word rotations to 90 degree increments (excluding upside down words), such that words would either be oriented pointing down, pointed up, or reading LTR. The corner locations and midpoints of each of the four sides of the word’s rectangle are then used to test whether there is overlap between this randomly selected word location and any spaces already occupied by preceding words. To break that down:

```
// set-up canvas context, measure words in wordList

var findDrawingCoordinates = function(array) {

    // occupiedZones code

    // the function that will be used in a forEach for the collection of word objects
    var selectPoint = function(value, index, array) {

        // the range from which random x and y values are to be selected
        var SPAN = 100;
        var dimensionSpan = SPAN;

        // a random rotation, limited to -90, 0, or 90 degrees
        var rotation = (1 - Math.floor(Math.random() * 3)) * 90;

        // get a new set of test coordinates using a random x and random y
        var newXY = function(){
            var randomX = Math.floor((0.5 - Math.random()) * dimensionSpan);
            var randomY = Math.floor((0.5 - Math.random()) * dimensionSpan);
            return calculateTestCoordinates(randomX, randomY);
        };

        // The rotation determines the minimum and maximum values of x and y, because text is
        // draw on the canvas with the origin at the text's bottom left. If the canvas is rotated
        // 90 degrees, that origin is now at the top left, etc.
        var calculateTestCoordinates(testX, testY) {
            var testCoords = {};

            testCoords.x = testX;
            testCoords.y = testY;

            if (rotation === -90) {
                testCoords.minX = testX - value.fontHeight;
                testCoords.maxX = testX;
                testCoords.minY = testY - value.fillWidth;
                testCoords.maxY = testY;
            } else if (rotation === 90) {
                testCoords.minX = testX;
                testCoords.maxX = testX + value.fontHeight;
                testCoords.minY = testY;
                testCoords.maxY = testY + value.fillWidth;
            } else {
                testCoords.minX = testX;
                testCoords.maxX = testX + value.fillWidth;
                testCoords.minY = testY - value.fontHeight;
                testCoords.maxY = testY;
            }

            testCoords.mid1 = { x: testCoords.minX, y: (testCoords.maxY - testCoords.minY) / 2 };
            testCoords.mid2 = { x: (testCoords.maxX - testCoords.minX) / 2, y: testCoords.minY };
            testCoords.mid3 = { x: testCoords.maxX, y: (testCoords.maxY - testCoords.minY) / 2 };
            testCoords.mid4 = { x: (testCoords.maxX - testCoords.minX) / 2, y: testCoords.maxY };

            return testCoords;
        };

    };

    // the rest…
};
```

The important things to note here are that the rotation is only calculated once, and new test coordinates (which depend on the rotation) can be easily calculated whenever a new random point (random X and random Y coordinates) is selected. The origin for text drawn on a 2d canvas context is the lower left corner of the text string. If the canvas is rotated -90 degrees so that text is read from bottom to top, the origin of the drawn word is now on the bottom right. If rotated 90 degrees, the origin is now on the top left. These differences dictate the disparity in calculating the test coordinates amongst the various rotation values.

A final step before actually going through and finding an unoccupied space in which to draw a word in the list is to establish a way to add a new occupied space to the collection of occupied zones.

```
// set-up canvas context, measure words in wordList

var findDrawingCoordinates = function(array) {

    // occupiedZones code here

    // the function that will be used in a forEach for the collection of word objects
    var selectPoint = function(value, index, array) {

        // rotation, newXY, and calculateTestCoordinates code here

        var addOccupiedZone = function(x, y) {
            if (rotation === -90) {
                occupiedZones.push(new OccupiedZone(
                    x - value.fontHeight,
                    x,
                    y - value.fillWidth,
                    y
                ));
            } else if (rotation === 90) {
                occupiedZones.push(new OccupiedZone(
                    x,
                    x + value.fontHeight,
                    y,
                    y+ value.fillWidth
                ));
            } else {
                occupiedZones.push(new OccupiedZone(
                    x,
                    x + value.fillWidth,
                    y - value.fontHeight,
                    y
                ));
            }
        };

    };

    // the rest…
};
```

With this structure in place, the loop to test the area occupied by a randomly selected set of coordinates can be set-up.

```
// set-up canvas context, measure words in wordList

var findDrawingCoordinates = function(array) {

    // occupiedZones code

    // the function that will be used in a forEach for the collection of word objects
    var selectPoint = function(value, index, array) {

        // rotation, newXY, calculateTestCoordinates, and addOccupiedZone code here

        // keep track of how many times testLoop has run for a given word
        var testIncrementer = 0;

        var testLoop = function() {
            var testArea = newXY();

            if (occupiedZones.length > 0) {

                for (var i = 0; i < occupiedZones.length; i++) {
                    if ((testArea.minX > occupiedZones[i].maxX || testArea.minX < occupiedZones[i].minX || testArea.maxY > occupiedZones[i].maxY || testArea.maxY < occupiedZones[i].minY) &&
                        (testArea.minX > occupiedZones[i].maxX || testArea.minX < occupiedZones[i].minX || testArea.minY > occupiedZones[i].maxY || testArea.minY < occupiedZones[i].minY) &&
                        (testArea.maxX > occupiedZones[i].maxX || testArea.maxX < occupiedZones[i].minX || testArea.maxY > occupiedZones[i].maxY || testArea.maxY < occupiedZones[i].minY) &&
                        (testArea.maxX > occupiedZones[i].maxX || testArea.maxX < occupiedZones[i].minX || testArea.minY > occupiedZones[i].maxY || testArea.minY < occupiedZones[i].minY) &&
                        (testArea.mid1.x > occupiedZones[i].maxX || testArea.mid1.x < occupiedZones[i].minX || testArea.mid1.y > occupiedZones[i].maxY || testArea.mid1.y < occupiedZones[i].minY) &&
                        (testArea.mid2.x > occupiedZones[i].maxX || testArea.mid2.x < occupiedZones[i].minX || testArea.mid2.y > occupiedZones[i].maxY || testArea.mid2.y < occupiedZones[i].minY) &&
                        (testArea.mid3.x > occupiedZones[i].maxX || testArea.mid3.x < occupiedZones[i].minX || testArea.mid3.y > occupiedZones[i].maxY || testArea.mid3.y < occupiedZones[i].minY) &&
                        (testArea.mid4.x > occupiedZones[i].maxX || testArea.mid4.x < occupiedZones[i].minX || testArea.mid4.y > occupiedZones[i].maxY || testArea.mid4.y < occupiedZones[i].minY)
                    ) {
                        if (i === occupiedZones.length - 1) {
                            value.xCoord = testArea.x;
                            value.yCoord = testArea.y;
                            value.rotation = rotation;
                            addOccupideZone(testArea.x, testArea.y);
                            dimensionSpan = SPAN;
                            break;
                        } else {
                            continue;
                        }
                    } else {
                        testIncrementer++;

                        // if the test loop is run 500 times without success, increase the range from which random
                        // values of x and y are being selected
                        if (testIncrementer >= 500) {
                            dimensionSpan += 10;
                            testIncrementer = 0;
                        }
                        return testLoop();
                    }
                }

            } else {
                value.xCoord = testArea.x;
                value.yCoord = testArea.y;
                value.rotation = rotation;
                addOccupiedZone(testArea.x, testArea.y);
            }
        };

        testLoop();
    };

    // the rest
};
```

This is the meat of the code right here. If there aren’t any occupied zones defined (`occupiedZones.length === 0`), the selected rotation, x, and y are assigned to the current word object being iterated over in the collection, and the rectangular space that will be occupied by this word is added to the `occupiedZones` array. If there are occupied zones defined, however, the selected rotation, x, and y for the current value are tested to see if they will cause an overlap with any previously defined occupied zones. If an overlap is detected, `testLoop()` is called again for the current word object. This process is repeated until a suitable point from which to draw is found. Once such a point is found, the area that will be occupied by the word when drawn from this point is added to the `occupiedZones` collection to be tested against for the next word object in the `wordList` collection.

Now the point selection can actually be performed for the list of words:

```
// set-up canvas context, measure words in wordList

var findDrawingCoordinates = function(array) {

    // occupiedZones code
    // selectPoint code

    array.forEach(selectPoint);

    // the rest
};
```

### Canvas Size and Origin
The final step before drawing is to glean some additional info from the `occupiedZones` array to help set up the canvas. The minimum X and Y are used to determine the origin of the canvas, and those values along with the maximum X and Y are used to calculate the canvas dimensions. Finding these four values can be achieved with a series of sorts on the occupiedZones collection.

```
// set-up canvas context, measure words in wordList

var findDrawingCoordinates = function(array) {

    // occupiedZones code
    // selectPoint code

    array.forEach(selectPoint);

    // find smallest x in occupied area
    occupiedZones.sort(function(a, b) { return a.minX - b.minX; });
    var xCanvasOrigin = Math.floor(occupiedZones[0].minX);

    // find smallest y in occupied area
    occupiedZones.sort(function(a, b){ return a.minY - b.minY; });
    var yCanvasOrigin = Math.floor(occupiedZones[0].minY);

    // find largest x, calculate width of canvas
    occupiedZones.sort(function(a, b){ return b.maxX - a.maxX; });
    var canvasWidth = Math.ceil(occupiedZones[0].maxX) - xCanvasOrigin;

    // find largest y, calculate height of canvas
    occupiedZones.sort(function(a, b){ return b.maxY - a.maxY; });
    var canvasHeight = Math.ceil(occupiedZones[0].maxY) - yCanvasOrigin;

    canvasDimensions = {
        minX: xCanvasOrigin,
        minY: yCanvasOrigin,
        width: canvasWidth,
        height: canvasHeight
    };

    return array;
};
```

### Drawing the Words
Finally, everything needed has been collected, and step 5 &mdash; drawing the words on the canvas &mdash; can be tackled. This part consists of a function which will accept the `wordList` collection from earlier and the `canvasDimensions` object as arguments. Within this wrapper will be a function for drawing individual words, which will again be used to loop through the `wordList` array.

```
// set-up canvas context, measure words in wordList
// findDrawingCoordinates code

var drawWordCloud = function(wordArray, canvasSizingObject) {

    var drawWord = function(word) {
        context.translate(word.xCoord, word.yCoord);
        context.rotate(word.rotation * Math.PI / 180);
        context.font = word.font;
        context.fillStyle = word.color;
        context.fillText(word.word, 0, 0);
        context.rotate(-(word.rotation) * Math.PI / 180); // un-rotate the context
        context.translate(-(word.xCoord), -(word.yCoord)); // un-translate the context
    };

    var xTranslation = Math.abs(canvasSizingObject.minX) + 5; // add a little padding to the canvas
    var yTranslation = Math.abs(canvasSizingObject.minY) + 5;

    canvas.height = canvasSizingObject.height + 10;
    canvas.width = canvasSizingObject.width + 10;

    context.translate(xTranslation, yTranslation);
    wordArray.forEach(drawWord);
};
```

And last but not least, the collection of word objects can be passed into the written functions, finding the location for each word and drawing the whole collection to the canvas, hopefully with a minimum of overlap!

```
// set-up canvas context, measure words in wordList
// findDrawingCoordinates code
// drawWordCloud code

var drawingCoordinates = findDrawingCoordinates(wordList);
drawWordCloud(drawingCoordinates, canvasDimensions);
```

### Closing Thoughts

After putting this together in [an app](http://www.benjanes.com/WordCloud/), I allowed myself to look for other (better) techniques for doing this. `getImageData` seems to be the way to go for looking for pixel-level overlaps in drawing space. However, looking through individual pixels could be a very expensive process. Adapting a technique like the one I implemented above can help to narrow down the area in which pixels are being checked.

Check out [O'Reilly's canvas book section](http://chimera.labs.oreilly.com/books/1234000001654/ch04.html#using_pixel_data_to_detect_object_collis) on the topic. Also check out Timothy Guan-tin Chien's [HTML5 Word Cloud](https://github.com/timdream/wordcloud).
