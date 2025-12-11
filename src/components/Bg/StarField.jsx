import React, { useEffect, useRef } from "react";

const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // create stars
    const stars = [];
    const STAR_COUNT = 180;

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 🌌 Dark space gradient (blackish-blue)
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#040710"); // almost black
      gradient.addColorStop(0.4, "#071022"); // deep navy
      gradient.addColorStop(0.75, "#0b1a33"); // space blue
      gradient.addColorStop(1, "#102644"); // dark blue glow
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw stars
      stars.forEach((star) => {
        // twinkling effect
        star.opacity += star.twinkleSpeed;
        if (star.opacity >= 1 || star.opacity <= 0.2) {
          star.twinkleSpeed *= -1;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;

        // ⭐ glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = "white";

        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // drifting movement
        star.x += star.speed;
        if (star.x > canvas.width) {
          star.x = 0;
          star.y = Math.random() * canvas.height;
        }

        // reset glow
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    }

    animate();

    // resize canvas automatically
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    />
  );
};

export default StarField;
