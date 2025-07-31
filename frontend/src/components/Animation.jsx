import React, { useRef, useEffect } from 'react';

const AnimatedLinesCircle = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  let width = 0;
  let height = 0;

  const easeInOut = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const resize = (canvas, ctx) => {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.resetTransform?.(); // for browsers that support it
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const totalDuration = 2000; // ms
    resize(canvas, ctx);
    window.addEventListener('resize', () => resize(canvas, ctx));

    const draw = (now) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = (now - startTimeRef.current) % totalDuration; // 0..totalDuration

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineCap = 'round';

      // parameters (use CSS pixels for drawing after scaling)
      const logicalWidth = window.innerWidth;
      const logicalHeight = window.innerHeight;

      if (elapsed < 1000) {
        // extend toward center
        const t = easeInOut(elapsed / 1000);
        const leftEndX = logicalWidth * 0.5 * t;
        const rightEndX = logicalWidth - logicalWidth * 0.5 * t;
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(0,200,255,0.9)';
        ctx.beginPath();
        ctx.moveTo(0, logicalHeight * 0.5);
        ctx.lineTo(leftEndX, logicalHeight * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(logicalWidth, logicalHeight * 0.5);
        ctx.lineTo(rightEndX, logicalHeight * 0.5);
        ctx.stroke();
      } else if (elapsed < 2000) {
        // retract back outward
        const t = easeInOut((elapsed - 1000) / 1000); // 0..1
        const leftStartX = logicalWidth * 0.5 * (1 - t);
        const leftEndX = -logicalWidth * 0.2 * t;
        const rightStartX = logicalWidth - logicalWidth * 0.5 * (1 - t);
        const rightEndX = logicalWidth + logicalWidth * 0.2 * t;
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(0,200,255,0.9)';
        ctx.beginPath();
        ctx.moveTo(leftStartX, logicalHeight * 0.5);
        ctx.lineTo(leftEndX, logicalHeight * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(rightStartX, logicalHeight * 0.5);
        ctx.lineTo(rightEndX, logicalHeight * 0.5);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', () => resize(canvas, ctx));
    };
  }, []);

  return (
    <canvas
      aria-hidden="true"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-20"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default AnimatedLinesCircle;