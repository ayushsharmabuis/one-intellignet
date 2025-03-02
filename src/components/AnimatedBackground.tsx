
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
      pulseSpeed: number;
      pulseDirection: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 2 + 0.1;
        this.size = this.baseSize;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.6 + 0.1;
        this.pulseSpeed = Math.random() * 0.01 + 0.005;
        this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
        
        // More vibrant colors with weighted randomization
        const colorRandom = Math.random();
        let hue;
        if (colorRandom > 0.85) {
          // Purple - accent color (higher chance)
          hue = '123, 92, 250';
        } else if (colorRandom > 0.75) {
          // Light purple/pink
          hue = '155, 135, 245';
        } else if (colorRandom > 0.65) {
          // Blue-purple
          hue = '130, 110, 220';
        } else {
          // Darker accent variations
          hue = '100, 80, 220';
        }
        
        this.color = `rgba(${hue}, ${this.opacity})`;
      }
      
      update() {
        // Movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
        
        // Pulse animation - size oscillation
        this.size += this.pulseSpeed * this.pulseDirection;
        if (this.size > this.baseSize * 1.5 || this.size < this.baseSize * 0.7) {
          this.pulseDirection *= -1;
        }
        
        // Interactive effect when near mouse
        const dx = mousePosition.current.x - this.x;
        const dy = mousePosition.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          // Enlarge particle near mouse and increase brightness
          this.size = this.baseSize * (1 + (150 - distance) / 150 * 1.5);
          
          // Move away from mouse with increasing force as they get closer
          const angle = Math.atan2(dy, dx);
          const repelForce = (150 - distance) / 1500;
          this.x -= Math.cos(angle) * repelForce * 2;
          this.y -= Math.sin(angle) * repelForce * 2;
          
          // Speed up slightly when near mouse
          this.speedX = this.speedX * 1.01;
          this.speedY = this.speedY * 1.01;
          
          // Cap the maximum speed
          const maxSpeed = 2;
          if (Math.abs(this.speedX) > maxSpeed) this.speedX = this.speedX > 0 ? maxSpeed : -maxSpeed;
          if (Math.abs(this.speedY) > maxSpeed) this.speedY = this.speedY > 0 ? maxSpeed : -maxSpeed;
        } else {
          // Gradually return to normal speed when away from mouse
          this.speedX *= 0.995;
          this.speedY *= 0.995;
        }
      }
      
      draw() {
        if (!ctx) return;
        
        // Gradient fill for particles
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        const colorBase = this.color.slice(0, -4); // Remove the alpha value
        gradient.addColorStop(0, `${colorBase}, ${this.opacity * 1.5})`);
        gradient.addColorStop(1, `${colorBase}, 0)`);
        
        ctx.fillStyle = gradient;
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
          
          if (distance < 150) {
            if (!ctx) return;
            const opacity = 1 - (distance / 150);
            ctx.strokeStyle = `rgba(155, 135, 245, ${opacity * 0.3})`;
            ctx.lineWidth = opacity * 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Draw connecting lines to mouse position
    function connectToMouse() {
      if (!ctx) return;
      const { x, y } = mousePosition.current;
      
      // Only draw connections if mouse is moving
      if (x > 0 && y > 0) {
        let closestParticles = particles
          .map((particle, index) => {
            const dx = x - particle.x;
            const dy = y - particle.y;
            return { 
              distance: Math.sqrt(dx * dx + dy * dy),
              index
            };
          })
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 6);  // Connect to nearest 6 particles
        
        closestParticles.forEach(({ distance, index }) => {
          if (distance < 200) {
            const opacity = 1 - (distance / 200);
            const particle = particles[index];
            
            // Create gradient line
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y, x, y
            );
            gradient.addColorStop(0, `rgba(123, 92, 250, ${opacity * 0.2})`);
            gradient.addColorStop(1, `rgba(155, 135, 245, ${opacity * 0.6})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = opacity * 1.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // Draw small glow at intersection with mouse
            ctx.fillStyle = `rgba(155, 135, 245, ${opacity * 0.8})`;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
    }
    
    // Draw dynamic glow effects
    function drawGlowEffects() {
      if (!ctx) return;
      
      // Random glow spots - with varied intensity and colors
      if (Math.random() > 0.97) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 150 + 50;
        
        // Randomly choose between purple and blue hues
        const hue = Math.random() > 0.5 ? '123, 92, 250' : '155, 135, 245';
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${hue}, 0.15)`);
        gradient.addColorStop(0.5, `rgba(${hue}, 0.05)`);
        gradient.addColorStop(1, `rgba(${hue}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Occasional wave effect
      if (Math.random() > 0.995) {
        drawWaveEffect();
      }
    }
    
    // Draw an expanding wave effect
    function drawWaveEffect() {
      if (!ctx) return;
      
      const waveX = Math.random() * canvas.width;
      const waveY = Math.random() * canvas.height;
      let currentRadius = 0;
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.8;
      const expandSpeed = 15;
      
      const drawExpandingWave = () => {
        currentRadius += expandSpeed;
        
        if (currentRadius <= maxRadius) {
          ctx.strokeStyle = `rgba(123, 92, 250, ${1 - currentRadius / maxRadius})`;
          ctx.lineWidth = 2 * (1 - currentRadius / maxRadius);
          ctx.beginPath();
          ctx.arc(waveX, waveY, currentRadius, 0, Math.PI * 2);
          ctx.stroke();
          
          requestAnimationFrame(drawExpandingWave);
        }
      };
      
      drawExpandingWave();
    }
    
    // Animation loop with motion blur effect
    const animate = () => {
      // Create motion blur effect
      ctx.fillStyle = 'rgba(15, 15, 19, 0.2)'; // Semi-transparent black for trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
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
      className={`fixed top-0 left-0 w-full h-full -z-10 opacity-80 ${className}`}
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(20, 20, 35, 1), rgba(10, 10, 20, 1))'
      }}
    />
  );
};

export default AnimatedBackground;
