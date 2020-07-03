(function() {
  const canvas = document.querySelector('canvas');
  const width = 2000;
  const height = 2000;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const center = { x: width / 2, y: height / 2 };

  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.strokeStyle = '#fff';
  const pointCount = 20;
  const connectionCount = 6;
  const circleRadius = width / 2;
  const dotRadius = 8;
  const haloRadius = 30;
  const minLineWidth = 3;
  const maxLineWidth = 8;

  const pointAnimationDuration = 3;
  const opacityFadeDuration = pointAnimationDuration * 0.1;
  const connectionAnimationDurations = [0.25, 0.5, 1, 1.25].map(x => x / 1.5);

  const minRadius = circleRadius / 8;
  const startBasePoint = { ...center, x: center.x + circleRadius };
  const connectionBasePoints = connectionAnimationDurations.map(dur => ({
    ...center, x: center.x + (circleRadius - ((circleRadius - minRadius) * (dur / pointAnimationDuration)))
  }))
  const endBasePoint = { ...center, x: center.x + minRadius };
  const angleStep = Math.PI * 2 / pointCount;

  const points = [makeArr(pointCount), makeArr(pointCount)].map((arr, arrIdx) => {
    const angleAdjust = arrIdx ? 0 : angleStep / 2;
    // each time one of these tls completes, reform connections
    const tl = new TimelineMax({
      repeat: -1,
      delay: arrIdx ? 0 : pointAnimationDuration / 2,
      onRepeat: () => {
        formConnections(connections, arrIdx);
      },
    });

    return arr.map((_, ptIdx) => {
      const angle = (angleStep * ptIdx) + angleAdjust;
      const { x, y } = rotatePoint(startBasePoint, angle, center);
      const finalPoint = rotatePoint(endBasePoint, angle, center);
      const ptsOfConnection = connectionBasePoints.map(cbp => rotatePoint(cbp, angle, center));
      
      const pt = {
        initialX: x,
        initialY: y,
        finalX: finalPoint.x,
        finalY: finalPoint.y,
        connection: null,
        opacity: 0,
        drawHalo: false,
        lineWidth: minLineWidth,
        ptsOfConnection,
        x,
        y,
      };

      tl.to(pt, opacityFadeDuration, { opacity: 1 }, 0)
        .fromTo(pt, pointAnimationDuration, { x: pt.initialX, y: pt.initialY }, { x: pt.finalX, y: pt.finalY, ease: Power0.easeNone }, 0)
        .to(pt, opacityFadeDuration, { opacity: 0 }, pointAnimationDuration - opacityFadeDuration);
      return pt;
    });
  });

  const connections = initializeConnections();
  const rotation = { angle: 0 };

  TweenMax.ticker.addEventListener('tick', draw);
  TweenMax.fromTo(rotation, 25, { angle: 0 }, { angle: 2 * Math.PI, repeat: -1, ease: Power0.easeNone });

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(rotation.angle);
    ctx.translate(-center.x, -center.y);
    
    points.forEach(arr => arr.forEach(({ x, y, initialX, initialY, opacity, lineWidth, drawHalo }) => {
      const color = `rgba(255,255,255,${opacity})`;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      drawLine(initialX, initialY, x, y);

      drawCircle(x, y, dotRadius);

      if (drawHalo) {
        ctx.lineWidth = minLineWidth;
        drawCircle(x, y, haloRadius, true);
      }
    }));
    
    // ctx.strokeStyle = 'rgb(120,120,120)';
    ctx.lineWidth = minLineWidth;
    connections.forEach(({ ptA, ptB, unconnectedX, unconnectedY, drawUnconnectedLine }) => {
      if (drawUnconnectedLine) {
        drawLine(unconnectedX, unconnectedY, ptB.x, ptB.y);
      } else {
        drawLine(ptA.x, ptA.y, ptB.x, ptB.y);
      }
    });

    ctx.restore();
  }

  function initializeConnections() {
    const connections = makeArr(connectionCount).map(() => {
      // index connection points by ptsArrIdx
      // put the connection on the point so there is a bi-directional reference for updating
      return {
        ptA: null,
        ptB: null,
        unconnectedX: null,
        unconnectedY: null,
        drawUnconnectedLine: false,
      };
    });
    formConnections(connections, 0);
    formConnections(connections, 1, true);
    return connections;
  }

  function formConnections(connections, ptsArrIdx, noSwap) {
    const availableIdxs = makeArr(pointCount).map((_, i) => i);
    connections.forEach(connection => {
      // grab a random idx from availableIdxs and remove it
      const randomIdx = availableIdxs.splice(Math.floor(Math.random() * availableIdxs.length), 1);

      // just get ptB populated
      if (noSwap) {
        connection.ptB = points[ptsArrIdx][randomIdx];
        points[ptsArrIdx][randomIdx].connection = connection;
        connection.unconnectedX = connection.ptB.x;
        connection.unconnectedY = connection.ptB.y;
        connection.ptB.lineWidth = maxLineWidth;
      // perform a swap where ptA becomes ptB (if ptB is set). use ptB to set unconnected vals before overwriting it.
      } else {
        if (!connection.ptA) {
          connection.ptA = points[ptsArrIdx][randomIdx];
          points[ptsArrIdx][randomIdx].connection = connection;
          connection.ptA.lineWidth = maxLineWidth;
        } else {
          connection.unconnectedX = connection.ptB.x;
          connection.unconnectedY = connection.ptB.y;
          connection.ptB.lineWidth = minLineWidth;
          connection.ptB.drawHalo = false;
          connection.ptB = connection.ptA;
          connection.ptA = points[ptsArrIdx][randomIdx];
          points[ptsArrIdx][randomIdx].connection = connection;
          connection.drawUnconnectedLine = true;

          const connectionDurIdx = Math.floor(Math.random() * connectionAnimationDurations.length);
          const connectionDur = connectionAnimationDurations[connectionDurIdx];
          const connectionPt = connection.ptA.ptsOfConnection[connectionDurIdx];

          // console.log(connectionDur - opacityFadeDuration)

          TweenMax.to(connection.ptA, opacityFadeDuration, { lineWidth: maxLineWidth, delay: connectionDur });
          TweenMax.to(connection, connectionDur, { unconnectedX: connectionPt.x, unconnectedY: connectionPt.y, ease: Circ.easeInOut, onComplete: () => {
            connection.drawUnconnectedLine = false;
            connection.ptA.drawHalo = true;
          }});
        }
      }
    })
  }

  function makeArr(n) {
    return Array(n).fill(null);
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

  function drawCircle(x, y, r, noFill = false) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    if (noFill) {
      ctx.stroke();
    } else {
      ctx.fill();
    }
    ctx.closePath();
  }

  function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  }

})();