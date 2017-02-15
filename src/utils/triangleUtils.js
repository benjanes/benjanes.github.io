export function Triangle(numRows, d) {
  this.yFixedR = numRows * d;
  this.startYR = this.yFixedR - d;
  this.endYR = this.yFixedR + d;

  this.yValR = function(){
    if ( this.startYR < this.endYR ) {
      this.startYR += (this.endYR - this.startYR ) / 10;
    } else {
      if ( this.startYR == this.endYR ) {
        this.startYR = this.endYR;
      }
    }
    return this.startYR;
  };

  this.startLum = 0;
  this.endLum = 90;

  this.lum = function() {
    if ( this.startLum < this.endLum ) {
      this.startLum += (this.endLum - this.startLum) / 50;
    }
    return this.startLum;
  };
}

export function drawTriangles(triangles, ctx, d) {
  for( var i = 0; i < triangles.length; i++ ){

    // if i is odd
    if( (i + 1) % 2 !== 0 ){
      ctx.beginPath();
      ctx.moveTo( d, triangles[i].yFixedR );
      ctx.lineTo( 0, triangles[i].yFixedR - d );
      ctx.lineTo( 0, triangles[i].yValR() );
      ctx.lineTo( d, triangles[i].yFixedR );
      ctx.closePath();
      ctx.fillStyle = 'hsla( 0, 0%, ' + triangles[i].lum() + '%, 1)';
      ctx.fill();
    }

    // if i is even
    if( (i + 1) % 2 === 0 ){
      ctx.beginPath();
      ctx.moveTo( 0, triangles[i].yFixedR );
      ctx.lineTo( d, triangles[i].yFixedR - d );
      ctx.lineTo( d, triangles[i].yValR() );
      ctx.lineTo( 0, triangles[i].yFixedR );
      ctx.closePath();
      ctx.fillStyle = 'hsla( 0, 0%, ' + triangles[i].lum() + '%, 1)';
      ctx.fill();
    }
  }
}