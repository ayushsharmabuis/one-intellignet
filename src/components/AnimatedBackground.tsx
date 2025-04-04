import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Performance detection - use simpler rendering on mobile/low-end devices
    const isMobile = window.innerWidth < 768;
    
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * 2 * dpr; // Reduced height for better performance
      ctx.scale(dpr, dpr); // Scale for retina displays
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight * 2}px`;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Particle configuration - reduce count on mobile
    const particles: Particle[] = [];
    const particleCount = isMobile ? 50 : 100; // Reduced from 150
    
    // Create ripple effects - fewer on mobile
    const ripples: Ripple[] = [];
    const maxRipples = isMobile ? 2 : 4; // Reduced from 5
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.8, // Slightly reduced size
        color: `rgba(155, 135, 245, ${Math.random() * 0.4 + 0.2})`,
        velocity: {
          x: Math.random() * 0.3 - 0.15, // Slower movement
          y: Math.random() * 0.3 - 0.15
        },
        // Reduce animation complexity - fewer pulsing particles
        pulse: {
          active: !isMobile && Math.random() > 0.8, // Fewer pulsing particles, none on mobile
          size: Math.random() * 0.3 + 0.1, // Smaller pulse
          speed: Math.random() * 0.01 + 0.005, // Slower speed
          phase: Math.random() * Math.PI * 2
        }
      });
    }
    
    // Function to create a new ripple
    const createRipple = () => {
      if (ripples.length < maxRipples) {
        ripples.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * (window.innerHeight * 0.7) + window.innerHeight * 0.15,
          radius: 0,
          maxRadius: Math.random() * 100 + 80, // Smaller ripples
          speed: Math.random() * 0.5 + 0.3, // Slower expansion
          opacity: 0.8,
          color: Math.random() > 0.5 ? 'rgba(155, 135, 245, 0.1)' : 'rgba(123, 92, 250, 0.1)'
        });
      }
    };
    
    // Create initial ripples
    for (let i = 0; i < maxRipples / 2; i++) {
      createRipple();
    }
    
    // Create new ripples less frequently
    const rippleInterval = setInterval(() => {
      if (ripples.length < maxRipples && Math.random() > 0.8) {
        createRipple();
      }
    }, isMobile ? 5000 : 4000); // Longer interval
    
    let animationFrameId: number;
    let time = 0;
    let lastRenderTime = 0;
    
    const animate = (currentTime: number) => {
      // Throttle rendering for better performance - especially on mobile
      if (isMobile && currentTime - lastRenderTime < 40) { // ~25fps on mobile
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      lastRenderTime = currentTime;
      time += 0.005; // Slower time progression
      
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight * 2);
      
      // Simpler background with gradient - avoids expensive radial gradient on every frame
      if (!isMobile) {
        // Higher-end devices get a gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
        gradient.addColorStop(0, 'rgba(25, 25, 35, 0.4)');
        gradient.addColorStop(1, 'rgba(15, 15, 25, 0.1)');
        ctx.fillStyle = gradient;
      } else {
        // Mobile gets a flat color
        ctx.fillStyle = 'rgba(20, 20, 30, 0.2)';
      }
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight * 2);
      
      // Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += ripple.speed;
        ripple.opacity -= ripple.speed / (ripple.maxRadius * 2);
        
        if (ripple.radius >= ripple.maxRadius || ripple.opacity <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ripple.color.replace(/[\d.]+\)$/, `${ripple.opacity})`);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Update and draw particles
      particles.forEach((particle) => {
        // Update pulse animation
        let currentRadius = particle.radius;
        
        if (!isMobile && particle.pulse.active) {
          particle.pulse.phase += particle.pulse.speed;
          const pulseFactor = Math.sin(particle.pulse.phase) * particle.pulse.size + 1;
          currentRadius = particle.radius * pulseFactor;
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Simplified movement - less trigonometry
        if (!isMobile) {
          // Only non-mobile gets wave movement
          particle.x += particle.velocity.x + Math.sin(time + particle.y * 0.005) * 0.05;
        } else {
          particle.x += particle.velocity.x;
        }
        particle.y += particle.velocity.y;
        
        // Boundary check with wrap-around
        const bufferArea = 20; // Smaller buffer
        if (particle.x < -bufferArea) particle.x = window.innerWidth + bufferArea;
        if (particle.x > window.innerWidth + bufferArea) particle.x = -bufferArea;
        if (particle.y < -bufferArea) particle.y = window.innerHeight * 2 + bufferArea;
        if (particle.y > window.innerHeight * 2 + bufferArea) particle.y = -bufferArea;
      });
      
      // Draw connecting lines - but only when not on mobile to improve performance
      if (!isMobile) {
        ctx.strokeStyle = 'rgba(155, 135, 245, 0.08)';
        ctx.lineWidth = 0.2;
        
        // Use spatial partitioning for efficiency - only check nearby particles
        const cellSize = 150;
        const grid: {[key: string]: Particle[]} = {};
        
        // Place particles in grid cells
        particles.forEach(p => {
          const cellX = Math.floor(p.x / cellSize);
          const cellY = Math.floor(p.y / cellSize);
          const key = `${cellX},${cellY}`;
          if (!grid[key]) grid[key] = [];
          grid[key].push(p);
        });
        
        // Check neighboring cells for connections
        particles.forEach(p1 => {
          const cellX = Math.floor(p1.x / cellSize);
          const cellY = Math.floor(p1.y / cellSize);
          
          // Check current cell and neighbors
          for (let nx = cellX - 1; nx <= cellX + 1; nx++) {
            for (let ny = cellY - 1; ny <= cellY + 1; ny++) {
              const key = `${nx},${ny}`;
              const cell = grid[key];
              
              if (cell) {
                cell.forEach(p2 => {
                  if (p1 !== p2) {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) { // Reduced connection distance
                      ctx.beginPath();
                      ctx.moveTo(p1.x, p1.y);
                      ctx.lineTo(p2.x, p2.y);
                      const opacity = 0.08 * (1 - distance / 100);
                      ctx.strokeStyle = `rgba(155, 135, 245, ${opacity})`;
                      ctx.stroke();
                    }
                  }
                });
              }
            }
          }
        });
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      clearInterval(rippleInterval);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
};

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: {
    x: number;
    y: number;
  };
  pulse: {
    active: boolean;
    size: number;
    speed: number;
    phase: number;
  };
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  opacity: number;
  color: string;
}

export default AnimatedBackground;
