import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 2.5; // Increased height for better coverage
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Reduced particle count for better text visibility
    const particles: Particle[] = [];
    const particleCount = 80; 
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5, // Slightly smaller particles
        color: `rgba(155, 135, 245, ${Math.random() * 0.5 + 0.2})`, // Lower opacity
        velocity: {
          x: Math.random() * 0.4 - 0.2,
          y: Math.random() * 0.4 - 0.2
        }
      });
    }
    
    // AI Tools nodes that will orbit around the center
    const aiTools = [
      { name: "Chatbot AI", angle: 0, distance: 0, color: "rgba(155, 135, 245, 0.8)" },
      { name: "Code AI", angle: Math.PI / 3, distance: 0, color: "rgba(135, 155, 245, 0.8)" },
      { name: "Image AI", angle: 2 * Math.PI / 3, distance: 0, color: "rgba(245, 135, 155, 0.8)" },
      { name: "Video AI", angle: Math.PI, distance: 0, color: "rgba(135, 245, 155, 0.8)" },
      { name: "Design AI", angle: 4 * Math.PI / 3, distance: 0, color: "rgba(245, 155, 135, 0.8)" },
      { name: "Text AI", angle: 5 * Math.PI / 3, distance: 0, color: "rgba(155, 245, 235, 0.8)" }
    ];
    
    const orbitRadius = Math.min(canvas.width, canvas.height) * 0.15;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 3;
    
    let animationFrameId: number;
    let time = 0;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        canvas.width * 0.7
      );
      
      gradient.addColorStop(0, 'rgba(25, 25, 35, 0.5)');
      gradient.addColorStop(1, 'rgba(15, 15, 25, 0.2)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update background particles
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.velocity.x *= -1;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.velocity.y *= -1;
        }
      });
      
      // Draw connecting lines with reduced connection distance
      ctx.strokeStyle = 'rgba(155, 135, 245, 0.15)';
      ctx.lineWidth = 0.3;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 180) { // Reduced connection distance
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw logo in the center
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
      const logoGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        40
      );
      logoGradient.addColorStop(0, 'rgba(123, 92, 250, 0.9)');
      logoGradient.addColorStop(1, 'rgba(155, 135, 245, 0.7)');
      ctx.fillStyle = logoGradient;
      ctx.fill();
      
      // Add text "1" to the logo
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('1', centerX, centerY);
      
      // Draw pulsing ring around the logo
      const pulseSize = 3 + Math.sin(time * 2) * 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 45 + pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(155, 135, 245, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Update and draw AI tool nodes orbiting around the center
      aiTools.forEach((tool, index) => {
        // Update position with different speeds for each tool
        tool.angle += 0.002 + (index * 0.0005);
        
        // Calculate coordinates
        const x = centerX + Math.cos(tool.angle) * orbitRadius;
        const y = centerY + Math.sin(tool.angle) * orbitRadius;
        
        // Draw node
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = tool.color;
        ctx.fill();
        
        // Draw connection line to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(155, 135, 245, ${0.3 + Math.sin(time + index) * 0.2})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Draw text label
        ctx.font = '12px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tool.name, x, y);
        
        // Draw small orbiting particles around each tool node
        const miniParticleCount = 3;
        const miniOrbitRadius = 25;
        for (let i = 0; i < miniParticleCount; i++) {
          const miniAngle = tool.angle + (i * (2 * Math.PI / miniParticleCount)) + time;
          const miniX = x + Math.cos(miniAngle) * miniOrbitRadius;
          const miniY = y + Math.sin(miniAngle) * miniOrbitRadius;
          
          ctx.beginPath();
          ctx.arc(miniX, miniY, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fill();
        }
      });
      
      // Draw flying particles that move from tools toward the center
      if (Math.random() < 0.05) {
        const sourceIndex = Math.floor(Math.random() * aiTools.length);
        const sourceAngle = aiTools[sourceIndex].angle;
        const sourceX = centerX + Math.cos(sourceAngle) * orbitRadius;
        const sourceY = centerY + Math.sin(sourceAngle) * orbitRadius;
        
        particles.push({
          x: sourceX,
          y: sourceY,
          radius: 3,
          color: aiTools[sourceIndex].color,
          velocity: {
            x: (centerX - sourceX) * 0.01,
            y: (centerY - sourceY) * 0.01
          }
        });
        
        // Remove a random particle to keep the count stable
        if (particles.length > particleCount + 10) {
          particles.splice(Math.floor(Math.random() * particles.length), 1);
        }
      }
      
      time += 0.01;
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-70" 
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
}

export default AnimatedBackground;
