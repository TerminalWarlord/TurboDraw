"use client";

import React, { useRef, useEffect, useState } from 'react';

const PannableCanvas = () => {
  const canvasRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Example drawing function
  const drawContent = (ctx, offsetX, offsetY, scale) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Apply translation and scaling
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Draw some example shapes
    ctx.fillStyle = 'blue';
    ctx.fillRect(100, 100, 200, 100);
    
    ctx.fillStyle = 'red';
    ctx.fillRect(300, 300, 150, 150);

    ctx.restore();
  };

  // Handle mouse down to start panning
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsPanning(true);
    setPanStart({ x, y });
  };

  // Handle mouse move for panning
  const handleMouseMove = (e) => {
    if (!isPanning) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate pan delta
    const deltaX = x - panStart.x;
    const deltaY = y - panStart.y;

    // Update offset
    setOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    // Update pan start
    setPanStart({ x, y });

    // Redraw with new offset
    drawContent(ctx, offset.x + deltaX, offset.y + deltaY, scale);
  };

  // Handle mouse up to stop panning
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Handle wheel for zooming
  const handleWheel = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Adjust scale
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = scale * scaleChange;
    setScale(newScale);

    // Redraw with new scale
    drawContent(ctx, offset.x, offset.y, newScale);
  };

  // Initial drawing and setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initial draw
    drawContent(ctx, offset.x, offset.y, scale);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
    />
  );
};

export default PannableCanvas;