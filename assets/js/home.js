(function() {
  const canvas = document.querySelector('#homeAnimationCanvas');
  const ctx = canvas.getContext('2d');
  const width = 3000;
	const height = 3000;
	canvas.width = width;
  canvas.height = height;
  ctx.lineWidth = 4;

  const nSquares = 10;
  const rotationAngle = Math.PI;

  ctx.fillStyle = 'rgba(245,245,245,1)';
  ctx.strokeStyle = 'rgba(255,255,255,1)';
  ctx.lineWidth = 0;

  const copyPt = pt => ({ ...pt });

  class Square {
    constructor(x, y, d) {
      this.rotation = 0;
      this.indexOfRotation = 0;
      this.pts = [
        { x: x, y: y },
        { x: x + d, y: y },
        { x: x + d, y: y + d },
        { x: x, y: y + d },
      ];
      this.rotatedPts = [
        { x: x, y: y },
        { x: x + d, y: y },
        { x: x + d, y: y + d },
        { x: x, y: y + d },
      ];
    }

    rotate(a) {
      const ptOfRotation = this.pts[this.indexOfRotation];
      this.rotatedPts = this.pts.map(pt => rotatePoint(pt, a, ptOfRotation));
    }

    resetPtsArray(ptIdx) {
      // ensure that the last rotation is done on the current frame before we reset
      this.rotate(this.rotation);

      this.rotation = 0;
      this.pts = this.rotatedPts.slice(ptIdx).concat(this.rotatedPts.slice(0, ptIdx)).map(copyPt);
      this.rotatedPts = this.pts.map(copyPt);
    }

    draw() {
      this.rotate(this.rotation);
      const [p1, p2, p3, p4] = this.rotatedPts;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.stroke();
      // ctx.fill();
    }
  }

  const squaresInSquare = 1;
  const offset = 1;

  const squares = [];
  const sqrsArr = Array(squaresInSquare).fill(null);
  const squareW = canvas.width / nSquares * 1;

  const distanceStep = canvas.width / nSquares;
  squares.push(sqrsArr.map(_ => new Square(distanceStep * ((nSquares / 2) - 1) - (distanceStep / 2), distanceStep * ((nSquares / 2) - 1) - (distanceStep / 2), squareW)))
  squares.push(sqrsArr.map(_ => new Square(distanceStep * ((nSquares / 2) + 1) - (distanceStep / 2), distanceStep * ((nSquares / 2) - 1) - (distanceStep / 2), squareW)))
  squares.push(sqrsArr.map(_ => new Square(distanceStep * ((nSquares / 2) + 1) - (distanceStep / 2), distanceStep * ((nSquares / 2) + 1) - (distanceStep / 2), squareW)))
  squares.push(sqrsArr.map(_ => new Square(distanceStep * ((nSquares / 2) - 1) - (distanceStep / 2), distanceStep * ((nSquares / 2) + 1) - (distanceStep / 2), squareW)))
  
  squares.push(sqrsArr.map(_ => new Square(distanceStep * ((nSquares / 2) - 1) - (distanceStep / 2), distanceStep * ((nSquares / 2) + 3) - (distanceStep / 2), squareW)))
  squares.push(sqrsArr.map(_ => new Square(distanceStep * ((nSquares / 2) + 1) - (distanceStep / 2), distanceStep * ((nSquares / 2) + 3) - (distanceStep / 2), squareW)))
  squares.push(sqrsArr.map(_ => new Square(distanceStep * ((nSquares / 2) - 1) - (distanceStep / 2), distanceStep * ((nSquares / 2) - 3) - (distanceStep / 2), squareW)))
  squares.push(sqrsArr.map(_ => new Square(distanceStep * ((nSquares / 2) + 1) - (distanceStep / 2), distanceStep * ((nSquares / 2) - 3) - (distanceStep / 2), squareW)))

  const dur = 2;

  squares.forEach((ss, idx) => {
    const tl = new TimelineMax({ repeat: -1 });

    if (idx == 0) {
      addRotationSequence(tl, ss, 2, 1, 0, dur);
    } else if (idx == 1) {
      addRotationSequence(tl, ss, 3, 0, 0, dur / 2);
    } else if (idx == 2) {
      addRotationSequence(tl, ss, 0, 1, 0, dur);
    } else if (idx == 3) {
      addRotationSequence(tl, ss, 1, 0, 0, dur / 2);
    } else if (idx == 4) {
      addRotationSequence(tl, ss, 1, 0, 0, dur / 1);
    } else if (idx == 5) {
      addRotationSequence(tl, ss, 0, 1, 0, dur / 2);
    } else if (idx == 6) {
      addRotationSequence(tl, ss, 2, 1, 0, dur / 2);
    } else if (idx == 7) {
      addRotationSequence(tl, ss, 3, 0, 0, dur / 1);
    }

  });

  // each square needs its own tl
  function addRotationSequence(tl, squares, indexOfRotation, dir, startTime, dur) {
    let nextZeroIdx = 1;
    if (dir) nextZeroIdx = 3;
    tl
      .call(() => {
        squares.forEach(s => s.indexOfRotation = indexOfRotation);
      }, [], startTime)

    squares.forEach((s, i) => {
      tl.to(s, dur, { rotation: dur ? rotationAngle : -rotationAngle, ease: Back.easeInOut.config(2), onComplete: () => {
        s.resetPtsArray(nextZeroIdx)
      }}, startTime + (offset * i))
    })
  }

  TweenMax.ticker.addEventListener('tick', draw);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    squares.forEach(ss => ss.forEach(s => s.draw()));
  }

  function rotatePoint(point, angle, center) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const deltaX = point.x - center.x;
    const deltaY = point.y - center.y;
    const x = (cos * deltaX) - (sin * deltaY) + center.x;
    const y = (cos * deltaY) + (sin * deltaX) + center.y;
    return { x, y };
  }
})();
