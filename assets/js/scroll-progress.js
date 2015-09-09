$(document).ready(function () {

  var requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {return setTimeout(callback, 1);};

  // Triangle animation variables
  var canvasR     = document.getElementById('progressBar'),
      ctxR        = canvasR.getContext('2d'),
      cHeight     = window.innerHeight - 5,
      doc_height  = document.body.offsetHeight,
      scrollableH = doc_height - cHeight,
      maxRows     = 40,
      d           = cHeight / (maxRows - 1),
      cWidth      = d,
      triangles   = [];


// ADD IN SCROLL EVENT HANDLER


  /*  The triangle scroll progress animation  **
  *********************************************/

  // set the canvas height and width
  canvasR.setAttribute('height', cHeight);
  canvasR.setAttribute('width', cWidth);

  function addTriangle(numRows){
    triangles[triangles.length] = new Triangle(numRows);
  }

  function Triangle(numRows){
    this.yFixedR = numRows * d;
    this.startYR = this.yFixedR - d;
    this.endYR = this.yFixedR + d;

    this.yValR = function(){
      if( this.startYR < this.endYR ){
        this.startYR += (this.endYR - this.startYR ) / 10;
      } else {
        if( this.startYR == this.endYR ){
          this.startYR = this.endYR;
        }
      }
      return this.startYR;
    };

    this.startLum = 0;
    this.endLum = 90;

    this.lum = function(){
      if( this.startLum < this.endLum ){
        this.startLum += (this.endLum - this.startLum) / 50;
      }
      return this.startLum;
    };

  }

  function drawTriangles(){
    for( var i = 0; i < triangles.length; i++ ){

      // if i is odd
      if( (i + 1) % 2 !== 0 ){
        ctxR.beginPath();
        ctxR.moveTo( d, triangles[i].yFixedR );
        ctxR.lineTo( 0, triangles[i].yFixedR - d );
        ctxR.lineTo( 0, triangles[i].yValR() );
        ctxR.lineTo( d, triangles[i].yFixedR );
        ctxR.closePath();
        ctxR.fillStyle = 'hsla( 0, 0%, ' + triangles[i].lum() + '%, 1)';
        ctxR.fill();
      }

      // if i is even
      if( (i + 1) % 2 === 0 ){
        ctxR.beginPath();
        ctxR.moveTo( 0, triangles[i].yFixedR );
        ctxR.lineTo( d, triangles[i].yFixedR - d );
        ctxR.lineTo( d, triangles[i].yValR() );
        ctxR.lineTo( 0, triangles[i].yFixedR );
        ctxR.closePath();
        ctxR.fillStyle = 'hsla( 0, 0%, ' + triangles[i].lum() + '%, 1)';
        ctxR.fill();
      }

    }
  }

  function scrollTriUpdate(){
    var scrollPos = window.scrollY;
    var scrollProp = scrollPos / scrollableH;
    var numRows = Math.ceil(scrollProp * maxRows);

    if(triangles.length > numRows){
      for( var i = triangles.length; i > numRows; i-- ){
        triangles.pop();
      }
    } else {
      if(triangles.length < numRows){
        for( var j = triangles.length; j < numRows; j++ ){
          addTriangle(j);
        }
      }
    }
  }

  $(window).scroll(function () {
    // Update the triangle array
    scrollTriUpdate();
  });

  /*  Draw the animations w/ requestAnimFrame  **
  **********************************************/
  function animate(){
    // clear out and redraw the triangles
    ctxR.clearRect( 0, 0, canvasR.width, canvasR.height );
    drawTriangles();

    requestAnimFrame(function(){
      animate();
    });
  }
  animate();

  function resizingFunctions() {
    // resetting of sizing and positioning vars
    doc_height          = document.body.offsetHeight;
    // resetting of triangle animation related vars
    cHeight     = window.innerHeight;
    scrollableH = doc_height - cHeight;
    d           = cHeight / (maxRows - 1);
    cWidth      = d;

    /* animation updates */
    canvasR.setAttribute('height', cHeight);
    canvasR.setAttribute('width', cWidth);
    triangles = [];
    scrollTriUpdate();
    animate();
  }

  var resizeTimer;
  $(window).resize(function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizingFunctions, 25);
  });

});
