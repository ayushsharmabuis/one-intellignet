
import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation particles
    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 150);
    
    class Particle {
      x: number;
      y: number;
      size: number;
      baseSize: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 1.5 + 0.1;
        this.size = this.baseSize;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.6 + 0.1;
        
        // Random selection between purple and blue hues
        const hue = Math.random() > 0.7 ? '155, 135, 245' : '123, 92, 250';
        this.color = `rgba(${hue}, ${this.opacity})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
        
        // Interactive effect when near mouse
        const dx = mousePosition.current.x - this.x;
        const dy = mousePosition.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          // Enlarge particle near mouse
          this.size = this.baseSize * (1 + (120 - distance) / 120);
          
          // Move away from mouse slightly
          const angle = Math.atan2(dy, dx);
          const repelForce = (120 - distance) / 1200;
          this.x -= Math.cos(angle) * repelForce;
          this.y -= Math.sin(angle) * repelForce;
        } else {
          this.size = this.baseSize;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Connect particles with lines if they are close
    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            if (!ctx) return;
            const opacity = 1 - (distance / 120);
            ctx.strokeStyle = `rgba(155, 135, 245, ${opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Draw occasional connecting lines to mouse position
    function connectToMouse() {
      if (!ctx) return;
      const { x, y } = mousePosition.current;
      
      // Only draw connections if mouse is moving
      if (x > 0 && y > 0) {
        particles.forEach(particle => {
          const dx = x - particle.x;
          const dy = y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Connect some particles to mouse cursor
          if (distance < 150 && Math.random() > 0.9) {
            const opacity = 1 - (distance / 150);
            ctx.strokeStyle = `rgba(123, 92, 250, ${opacity * 0.4})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(x, y);
            ctx.stroke();
          }
        });
      }
    }
    
    // Draw occasional glow effects
    function drawGlowEffects() {
      if (!ctx) return;
      
      // Random glow spots
      if (Math.random() > 0.98) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 100 + 50;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(123, 92, 250, 0.15)');
        gradient.addColorStop(1, 'rgba(123, 92, 250, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawGlowEffects();
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      connectParticles();
      connectToMouse();
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed top-0 left-0 w-full h-full -z-10 opacity-70 ${className}`}
    />
  );
};

export default AnimatedBackground;
