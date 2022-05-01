(function() {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.offsetWidth * 2;
	const height = width;
	canvas.width = width;
	canvas.height = height;

  // ctx.fillStyle = '#000';
  // ctx.fillRect(0, 0, width, height);
  ctx.lineCap = 'round';

  const steps = 8;
  const step = width / steps;
  const maxR = step / 2;
  const opts = { angle: Math.PI * 0, triSize: 0.7 };

  TweenMax.ticker.addEventListener('tick', draw)
  TweenMax.to(opts, 70, { angle: Math.PI * (3.82 * 3), ease: Power1.easeInOut });
  TweenMax.to(opts, 70, { angle: Math.PI * 0, ease: Power1.easeInOut, delay: 70 })


  function draw() {
    // ctx.fillStyle = '#502cc4';
    // ctx.fillStyle = 'transparent';
    // ctx.fillRect(0, 0, width, height);

    ctx.clearRect(0, 0, width, height)

    const cols = [];
    const rows = [];

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--theme');


    // using triangle
    for (let y = 0; step * y < height - (step * 2); y++) {
      cols.push([]);

      for (let x = 0; step * x < width - (step * 2); x++) {
        if (!rows[x]) {
          rows.push([]);
        }

        const corner = { x: x * step + step / 2, y: y * step + step / 2 };
        const cellCenter = { x: corner.x + maxR, y: corner.y + (maxR * 2) };

        let correctionLTR = (x + y) / (steps - 1);
        if (correctionLTR > 1) {
          correctionLTR = 1 - (correctionLTR - 1);
        }

        // correctionLTR = 1 - correctionLTR;

        let correctionRTL = (steps - x + y) / steps;
        if (correctionRTL > 1) {
          correctionRTL = 1 - (correctionRTL - 1);
        }

        // correctionRTL = 1 - correctionRTL;

        // rotate gray circle around black, vary size of each.
        // use correction LTR to get an angle from 0 - 360deg
        // find size using correction RTL
        // rotate about the center of the square using size and angle
        const angle = opts.angle * Math.PI * correctionRTL * 2;
        const trianglePt1 = {
          x: cellCenter.x + (maxR * 1),
          y: cellCenter.y,
        };

        const rotTrianglePt1 = rotatePoint(trianglePt1, angle, cellCenter);

        cols[cols.length - 1].push(rotTrianglePt1);
        rows[x].push(rotTrianglePt1);
      }
    }

    ctx.lineWidth = 4;

    // const color = getComputedStyle(document.documentElement).getPropertyValue('--theme');
    // // ctx.strokeStyle = 'rgb(0,0,0)';
    // ctx.strokeStyle = color;


    rows.forEach(row => {
      // ctx.strokeStyle = '#6666ff';
      // ctx.strokeStyle = 'rgb(255,255,255)';
      ctx.beginPath();
      ctx.moveTo(row[0].x, row[0].y);
      row.forEach(col => {
        ctx.lineTo(col.x, col.y);
      })
      ctx.stroke();
      ctx.closePath();
    })

    cols.forEach(col => {
      // ctx.strokeStyle = '#ff6666';
      // ctx.strokeStyle = 'rgb(255,255,255)';

      ctx.beginPath();
      ctx.moveTo(col[0].x, col[0].y);
      col.forEach(row => {
        ctx.lineTo(row.x, row.y);
      })
      ctx.stroke();
      ctx.closePath();
    })
  }

  /* rotate from 1d space into 2d space */
  function rotate(distance, pointOfRotation, angle) {
    return {
      x: Math.cos(angle) * distance + pointOfRotation.x,
      y: Math.sin(angle) * distance + pointOfRotation.y,
    };
  }

  function circle(cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  function rotatePoint(point, angle, center) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const deltaX = point.x - center.x;
    const deltaY = point.y - center.y;
    const x = (cos * deltaX) - (sin * deltaY) + center.x;
    const y = (cos * deltaY) + (sin * deltaX) + center.y;
    return { x, y };
  };
})();