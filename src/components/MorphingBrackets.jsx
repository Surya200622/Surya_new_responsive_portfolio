'use client';

import { useEffect, useRef } from 'react';

export default function MorphingBrackets() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let mouse = { x: -9999, y: -9999, radius: 100 };
    
    // Config
    const fontSize = Math.min(window.innerWidth / 2, 400); // Responsive font size
    const text = "{}";
    const particleSpacing = 4; // Lower = more particles

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    class Particle {
      constructor(x, y, color) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.destX = x;
        this.destY = y;
        this.size = 2;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
        this.color = color;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        // Distance between mouse and particle destination
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          // Return to original pos
          if (this.x !== this.destX) {
            let dx = this.x - this.destX;
            this.x -= dx / 10;
          }
          if (this.y !== this.destY) {
            let dy = this.y - this.destY;
            this.y -= dy / 10;
          }
        }
        this.draw();
      }
    }

    const init = () => {
      particles = [];
      // Draw text to offscreen canvas to get pixel data
      ctx.fillStyle = "white";
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      
      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < textCoordinates.height; y += particleSpacing) {
        for (let x = 0; x < textCoordinates.width; x += particleSpacing) {
          // Check alpha channel
          if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
            // Give a gradient color (purple to blue based on X position)
            const ratio = x / canvas.width;
            const r = Math.floor(139 * (1 - ratio) + 59 * ratio); // 139 to 59 (purple to blue)
            const g = Math.floor(92 * (1 - ratio) + 130 * ratio); // 92 to 130
            const b = Math.floor(246 * (1 - ratio) + 246 * ratio); // 246 to 246
            const color = `rgb(${r},${g},${b})`;
            particles.push(new Particle(x, y, color));
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      requestAnimationFrame(animate);
    };

    // Events
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });
    window.addEventListener('touchmove', (e) => {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    });

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', null);
      window.removeEventListener('touchmove', null);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="hidden lg:block"
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.8
      }} 
    />
  );
}
