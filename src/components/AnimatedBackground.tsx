
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
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const particles: Particle[] = [];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        color: `rgba(155, 135, 245, ${Math.random() * 0.3 + 0.1})`,
        velocity: {
          x: Math.random() * 0.3 - 0.15,
          y: Math.random() * 0.3 - 0.15
        }
      });
    }
    
    const aiTools = [
      { name: "Claude AI", angle: 0, color: "rgba(155, 135, 245, 0.9)" },
      { name: "Code AI", angle: Math.PI / 3, color: "rgba(135, 155, 245, 0.9)" },
      { name: "Design AI", angle: 2 * Math.PI / 3, color: "rgba(245, 135, 155, 0.9)" },
      { name: "Video AI", angle: Math.PI, color: "rgba(135, 245, 155, 0.9)" },
      { name: "Chatbots", angle: 4 * Math.PI / 3, color: "rgba(245, 155, 135, 0.9)" },
      { name: "Writing AI", angle: 5 * Math.PI / 3, color: "rgba(155, 245, 235, 0.9)" }
    ];
    
    const getOrbitRadius = () => Math.min(canvas.width, canvas.height) * 0.25;
    const getCenterX = () => canvas.width / 2;
    const getCenterY = () => canvas.height / 3;
    
    let animationFrameId: number;
    let time = 0;
    
    let hoveredTool = -1;
    
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const orbitRadius = getOrbitRadius();
      const centerX = getCenterX();
      const centerY = getCenterY();
      
      hoveredTool = -1;
      aiTools.forEach((tool, index) => {
        const x = centerX + Math.cos(tool.angle + time * 0.1) * orbitRadius;
        const y = centerY + Math.sin(tool.angle + time * 0.1) * orbitRadius;
        
        const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));
        if (distance < 35) {
          hoveredTool = index;
        }
      });
      
      canvas.style.cursor = hoveredTool >= 0 ? 'pointer' : 'default';
    });
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const orbitRadius = getOrbitRadius();
      const centerX = getCenterX();
      const centerY = getCenterY();
      
      // Draw a subtle radial gradient background
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, canvas.width * 0.5
      );
      
      gradient.addColorStop(0, 'rgba(25, 25, 35, 0.3)');
      gradient.addColorStop(1, 'rgba(15, 15, 25, 0.05)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw particle connections
      ctx.strokeStyle = 'rgba(155, 135, 245, 0.08)';
      ctx.lineWidth = 0.2;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw the central logo
      ctx.beginPath();
      ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
      const logoGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 50
      );
      logoGradient.addColorStop(0, 'rgba(123, 92, 250, 0.95)');
      logoGradient.addColorStop(1, 'rgba(155, 135, 245, 0.85)');
      ctx.fillStyle = logoGradient;
      ctx.fill();
      
      // Draw a highlight on the logo
      ctx.beginPath();
      ctx.arc(centerX - 12, centerY - 12, 15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fill();
      
      // Draw the logo text
      ctx.font = 'bold 38px Inter';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('1', centerX, centerY);
      
      ctx.font = 'bold 16px Inter';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('ONE INTELLIGENT', centerX, centerY + 65);
      
      // Draw a pulsing ring around the logo
      const pulseSize = 2 + Math.sin(time * 2) * 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 56 + pulseSize, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(155, 135, 245, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 62 + pulseSize * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(155, 135, 245, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Draw AI tool nodes
      aiTools.forEach((tool, index) => {
        const x = centerX + Math.cos(tool.angle + time * 0.1) * orbitRadius;
        const y = centerY + Math.sin(tool.angle + time * 0.1) * orbitRadius;
        
        const isHovered = hoveredTool === index;
        const nodeSize = isHovered ? 32 : 28;
        
        // Draw glow effect for hovered nodes
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(x, y, nodeSize + 8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(155, 135, 245, 0.3)';
          ctx.fill();
        }
        
        // Draw node
        ctx.beginPath();
        ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
        
        const nodeGradient = ctx.createRadialGradient(
          x, y, 0,
          x, y, nodeSize
        );
        
        if (isHovered) {
          nodeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
          nodeGradient.addColorStop(1, tool.color);
        } else {
          nodeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
          nodeGradient.addColorStop(1, tool.color);
        }
        
        ctx.fillStyle = nodeGradient;
        ctx.fill();
        
        // Draw highlight on node
        ctx.beginPath();
        ctx.arc(x - nodeSize/3, y - nodeSize/3, nodeSize/3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
        
        // Draw connection to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        
        const lineGradient = ctx.createLinearGradient(centerX, centerY, x, y);
        lineGradient.addColorStop(0, 'rgba(155, 135, 245, 0.7)');
        lineGradient.addColorStop(1, tool.color.replace('0.9', '0.7'));
        
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.stroke();
        
        // Draw node label with text shadow for better visibility
        ctx.font = isHovered ? 'bold 16px Inter' : 'bold 14px Inter';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add text shadow for better readability
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(tool.name, x, y);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Add orbiting particles around each node
        const miniParticleCount = isHovered ? 6 : 3;
        const miniOrbitRadius = isHovered ? 40 : 32;
        for (let i = 0; i < miniParticleCount; i++) {
          const miniAngle = (i * (2 * Math.PI / miniParticleCount)) + time * (isHovered ? 3 : 2);
          const miniX = x + Math.cos(miniAngle) * miniOrbitRadius;
          const miniY = y + Math.sin(miniAngle) * miniOrbitRadius;
          
          ctx.beginPath();
          ctx.arc(miniX, miniY, isHovered ? 3.5 : 2.5, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
        }
        
        // Create particles flowing from nodes to center
        if (Math.random() < (isHovered ? 0.2 : 0.05)) {
          particles.push({
            x: x,
            y: y,
            radius: isHovered ? 2.5 : 2,
            color: tool.color,
            velocity: {
              x: (centerX - x) * 0.01,
              y: (centerY - y) * 0.01
            }
          });
          
          if (particles.length > particleCount + 15) {
            particles.splice(0, 1);
          }
        }
      });
      
      // Draw and update particles
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
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ 
        opacity: 1, 
        pointerEvents: 'auto',
        zIndex: 0
      }}
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
