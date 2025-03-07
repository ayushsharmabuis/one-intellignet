
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
      canvas.height = window.innerHeight * 2.5;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Reduced particle count for better visibility
    const particles: Particle[] = [];
    const particleCount = 60;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        color: `rgba(155, 135, 245, ${Math.random() * 0.3 + 0.1})`, // Lower opacity
        velocity: {
          x: Math.random() * 0.3 - 0.15,
          y: Math.random() * 0.3 - 0.15
        }
      });
    }
    
    // AI Tools nodes that will orbit around the center in a perfect circle
    const aiTools = [
      { name: "Claude AI", angle: 0, color: "rgba(155, 135, 245, 0.9)" },
      { name: "Code AI", angle: Math.PI / 3, color: "rgba(135, 155, 245, 0.9)" },
      { name: "Design AI", angle: 2 * Math.PI / 3, color: "rgba(245, 135, 155, 0.9)" },
      { name: "Video AI", angle: Math.PI, color: "rgba(135, 245, 155, 0.9)" },
      { name: "Chatbots", angle: 4 * Math.PI / 3, color: "rgba(245, 155, 135, 0.9)" },
      { name: "Writing AI", angle: 5 * Math.PI / 3, color: "rgba(155, 245, 235, 0.9)" }
    ];
    
    // Dynamic sizing based on viewport
    const getOrbitRadius = () => Math.min(canvas.width, canvas.height) * 0.18;
    const getCenterX = () => canvas.width / 2;
    const getCenterY = () => canvas.height / 3;
    
    let animationFrameId: number;
    let time = 0;
    
    // Track hover state
    let hoveredTool = -1;
    
    // Add mouse interaction
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const orbitRadius = getOrbitRadius();
      const centerX = getCenterX();
      const centerY = getCenterY();
      
      // Check if mouse is over any AI tool node
      hoveredTool = -1;
      aiTools.forEach((tool, index) => {
        const x = centerX + Math.cos(tool.angle + time * 0.1) * orbitRadius;
        const y = centerY + Math.sin(tool.angle + time * 0.1) * orbitRadius;
        
        const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));
        if (distance < 30) {
          hoveredTool = index;
        }
      });
      
      // Change cursor style
      canvas.style.cursor = hoveredTool >= 0 ? 'pointer' : 'default';
    });
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get dynamic values
      const orbitRadius = getOrbitRadius();
      const centerX = getCenterX();
      const centerY = getCenterY();
      
      // Create gradient background
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        canvas.width * 0.6
      );
      
      gradient.addColorStop(0, 'rgba(25, 25, 35, 0.4)');
      gradient.addColorStop(1, 'rgba(15, 15, 25, 0.1)');
      
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
      
      // Draw connecting lines between particles with reduced connection distance
      ctx.strokeStyle = 'rgba(155, 135, 245, 0.1)';
      ctx.lineWidth = 0.2;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw logo in the center with more prominence
      ctx.beginPath();
      ctx.arc(centerX, centerY, 48, 0, Math.PI * 2);
      const logoGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        48
      );
      logoGradient.addColorStop(0, 'rgba(123, 92, 250, 0.95)');
      logoGradient.addColorStop(1, 'rgba(155, 135, 245, 0.85)');
      ctx.fillStyle = logoGradient;
      ctx.fill();
      
      // Add glossy effect to logo
      ctx.beginPath();
      ctx.arc(centerX - 10, centerY - 10, 15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fill();
      
      // Add text "1" to the logo
      ctx.font = 'bold 38px Inter';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('1', centerX, centerY);
      
      // Draw "ONE INTELLIGENT" text below the logo
      ctx.font = 'bold 16px Inter';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('ONE INTELLIGENT', centerX, centerY + 65);
      
      // Draw pulsing ring around the logo
      const pulseSize = 3 + Math.sin(time * 2) * 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 54 + pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(155, 135, 245, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw second pulsing ring for more effect
      ctx.beginPath();
      ctx.arc(centerX, centerY, 60 + pulseSize * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(155, 135, 245, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Update and draw AI tool nodes in fixed positions around the center
      aiTools.forEach((tool, index) => {
        // Fixed positions in a circle
        const x = centerX + Math.cos(tool.angle + time * 0.1) * orbitRadius;
        const y = centerY + Math.sin(tool.angle + time * 0.1) * orbitRadius;
        
        // Check if this tool is being hovered
        const isHovered = hoveredTool === index;
        const nodeSize = isHovered ? 35 : 30;
        
        // Draw node with larger size and better visibility - glow effect on hover
        ctx.beginPath();
        ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
        
        // Create gradient for the node
        const nodeGradient = ctx.createRadialGradient(
          x, y, 0,
          x, y, nodeSize
        );
        
        if (isHovered) {
          nodeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          nodeGradient.addColorStop(1, tool.color);
          
          // Draw outer glow for hovered node
          ctx.beginPath();
          ctx.arc(x, y, nodeSize + 5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(155, 135, 245, 0.3)';
          ctx.fill();
        } else {
          nodeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
          nodeGradient.addColorStop(1, tool.color);
        }
        
        ctx.beginPath();
        ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = nodeGradient;
        ctx.fill();
        
        // Draw glossy effect
        ctx.beginPath();
        ctx.arc(x - nodeSize/3, y - nodeSize/3, nodeSize/3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
        
        // Draw connection line to center with better visibility
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        
        // Create gradient for connection line
        const lineGradient = ctx.createLinearGradient(centerX, centerY, x, y);
        lineGradient.addColorStop(0, 'rgba(155, 135, 245, 0.9)');
        lineGradient.addColorStop(1, tool.color);
        
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.stroke();
        
        // Draw text label with better visibility and contrast
        ctx.font = isHovered ? 'bold 16px Inter' : 'bold 14px Inter';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw text with shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(tool.name, x, y);
        ctx.shadowBlur = 0;
        
        // Draw small orbiting particles around each tool node
        const miniParticleCount = isHovered ? 5 : 3;
        const miniOrbitRadius = isHovered ? 35 : 30;
        for (let i = 0; i < miniParticleCount; i++) {
          const miniAngle = tool.angle + (i * (2 * Math.PI / miniParticleCount)) + time * (isHovered ? 3 : 2);
          const miniX = x + Math.cos(miniAngle) * miniOrbitRadius;
          const miniY = y + Math.sin(miniAngle) * miniOrbitRadius;
          
          ctx.beginPath();
          ctx.arc(miniX, miniY, isHovered ? 4 : 3, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
        }
      });
      
      // Draw flying particles that move from tools toward the center
      if (Math.random() < 0.05) {
        const sourceIndex = Math.floor(Math.random() * aiTools.length);
        const sourceAngle = aiTools[sourceIndex].angle + time * 0.1;
        const sourceX = centerX + Math.cos(sourceAngle) * orbitRadius;
        const sourceY = centerY + Math.sin(sourceAngle) * orbitRadius;
        
        particles.push({
          x: sourceX,
          y: sourceY,
          radius: 2.5,
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
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-90" 
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
