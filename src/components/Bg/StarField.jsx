import React, { useEffect, useRef } from "react";

const StarField = ({ theme = "dark" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const stars = [];
    const STAR_COUNT = 180;

    const pastelColors = [
      "rgba(255, 99, 132, OPACITY)", // soft red
      "rgba(96, 165, 250, OPACITY)", // blue
      "rgba(167, 139, 250, OPACITY)", // purple
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.4 + 0.05,
        opacity: Math.random() * 0.6 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        colorIndex: Math.floor(Math.random() * pastelColors.length),
      });
    }

    function drawBackground() {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );

      if (theme === "dark") {
        gradient.addColorStop(0, "#040710");
        gradient.addColorStop(0.4, "#071022");
        gradient.addColorStop(1, "#102644");
      } else {
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(0.6, "#f5f7fb");
        gradient.addColorStop(1, "#eef1f7");
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();

      stars.forEach((star) => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity >= 1 || star.opacity <= 0.3) {
          star.twinkleSpeed *= -1;
        }

        ctx.beginPath();

        if (theme === "dark") {
          ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
          ctx.shadowColor = "white";
        } else {
          ctx.fillStyle = pastelColors[star.colorIndex].replace(
            "OPACITY",
            star.opacity
          );
          ctx.shadowColor = ctx.fillStyle;
        }

        ctx.shadowBlur = 8;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        star.x += star.speed;
        if (star.x > canvas.width) {
          star.x = 0;
          star.y = Math.random() * canvas.height;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
      }}
    />
  );
};

export default StarField;
