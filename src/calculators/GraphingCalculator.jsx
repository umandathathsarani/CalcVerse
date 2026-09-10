import { useState, useEffect, useRef, useCallback } from 'react';
import * as math from 'mathjs';
import styles from './GraphingCalculator.module.css';

export default function GraphingCalculator() {
  const canvasRef = useRef(null);
  
  const colors = ['#B88947', '#4789B8', '#B84747', '#47B86E', '#8E47B8'];
  const [equations, setEquations] = useState([
    { id: 1, text: 'x^2 - 4', color: colors[0], visible: true },
    { id: 2, text: 'sin(x)', color: colors[1], visible: true }
  ]);
  const [activeEqId, setActiveEqId] = useState(1);
  
  // Viewport state
  const [bounds, setBounds] = useState({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10
  });

  const updateEquation = (id, text) => {
    setEquations(prev => prev.map(eq => eq.id === id ? { ...eq, text } : eq));
  };
  
  const toggleVisibility = (id) => {
    setEquations(prev => prev.map(eq => eq.id === id ? { ...eq, visible: !eq.visible } : eq));
  };
  
  const deleteEquation = (id) => {
    setEquations(prev => prev.filter(eq => eq.id !== id));
  };
  
  const addEquation = () => {
    const newId = Date.now();
    const color = colors[equations.length % colors.length];
    setEquations(prev => [...prev, { id: newId, text: '', color, visible: true }]);
    setActiveEqId(newId);
  };
  
  const insertText = (text) => {
    setEquations(prev => prev.map(eq => {
      if (eq.id === activeEqId) {
        const appendText = ['sin', 'cos', 'tan', 'log'].includes(text) ? `${text}(` : text;
        return { ...eq, text: eq.text + appendText };
      }
      return eq;
    }));
  };

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Clear canvas based on physical pixels (handling DPR)
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, width * dpr, height * dpr);
    
    // Calculate scales
    const scaleX = width / (bounds.xMax - bounds.xMin);
    const scaleY = height / (bounds.yMax - bounds.yMin);
    
    // Origin pixel coordinates
    const originX = -bounds.xMin * scaleX;
    const originY = bounds.yMax * scaleY;
    
    // Style settings based on theme
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? '#3A3B39' : '#D1D5DB';
    const axisColor = isDark ? '#888986' : '#6B7280';

    const getNiceStepForPixelTarget = (scale, targetPixels) => {
      const rawStep = targetPixels / scale;
      const mag = Math.floor(Math.log10(rawStep));
      const magPow = Math.pow(10, mag);
      const norm = rawStep / magPow;
      let niceStep;
      if (norm < 2) niceStep = 1;
      else if (norm < 5) niceStep = 2;
      else niceStep = 5;
      return niceStep * magPow;
    };
    
    // Target ~70 pixels between grid lines
    const xStep = getNiceStepForPixelTarget(scaleX, 70);
    const yStep = getNiceStepForPixelTarget(scaleY, 70);
    
    // Draw Grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    const firstX = Math.ceil(bounds.xMin / xStep) * xStep;
    for (let x = firstX; x <= bounds.xMax; x += xStep) {
      const px = originX + x * scaleX;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    const firstY = Math.ceil(bounds.yMin / yStep) * yStep;
    for (let y = firstY; y <= bounds.yMax; y += yStep) {
      const py = originY - y * scaleY;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }
    
    // Draw Axes
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    
    // X Axis
    if (originY >= 0 && originY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      ctx.stroke();
    }
    
    // Y Axis
    if (originX >= 0 && originX <= width) {
      ctx.beginPath();
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, height);
      ctx.stroke();
    }

    // Draw Axis Labels
    ctx.fillStyle = axisColor;
    ctx.font = '11px "JetBrains Mono", monospace';
    
    // X Axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const labelFirstX = Math.ceil(bounds.xMin / xStep) * xStep;
    for (let x = labelFirstX; x <= bounds.xMax; x += xStep) {
      if (Math.abs(x) < 1e-10) continue; // Skip 0 to avoid overlapping
      const px = originX + x * scaleX;
      // Formatted label (avoid floating point noise)
      const label = parseFloat(x.toPrecision(7)).toString();
      // If axis is off-screen, draw at the bottom
      const labelY = (originY >= 0 && originY <= height) ? originY + 14 : height - 5;
      ctx.fillText(label, px, labelY);
    }
    
    // Y Axis labels
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const labelFirstY = Math.ceil(bounds.yMin / yStep) * yStep;
    for (let y = labelFirstY; y <= bounds.yMax; y += yStep) {
      if (Math.abs(y) < 1e-10) continue;
      const py = originY - y * scaleY;
      const label = parseFloat(y.toPrecision(7)).toString();
      // If axis is off-screen, draw at the left edge
      const labelX = (originX >= 0 && originX <= width) ? originX + 5 : 5;
      ctx.fillText(label, labelX, py);
    }
    
    // Draw Equations
    equations.forEach(eq => {
      if (!eq.visible || !eq.text.trim()) return;
      
      let expr;
      try {
        expr = math.compile(eq.text);
      } catch (e) {
        return; // skip invalid equations quietly
      }
      
      ctx.strokeStyle = eq.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      
      let isDrawing = false;
      
      for (let px = 0; px <= width; px += 2) {
        const mathX = (px - originX) / scaleX;
        
        try {
          const mathY = expr.evaluate({ x: mathX });
          const py = originY - mathY * scaleY;
          
          // Skip drawing if y is NaN, Infinity, or insanely large
          if (!isFinite(py)) {
            isDrawing = false;
            continue;
          }
          
          if (!isDrawing) {
            ctx.moveTo(px, py);
            isDrawing = true;
          } else {
            ctx.lineTo(px, py);
          }
        } catch (e) {
          isDrawing = false;
        }
      }
      ctx.stroke();
    });
    
  }, [equations, bounds]);

  useEffect(() => {
    // Handle canvas resizing to match container size without stretching
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        const { width, height } = canvas.parentElement.getBoundingClientRect();
        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        drawGraph();
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawGraph]);

  // Re-draw when equation or bounds change
  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  const zoom = (factor) => {
    setBounds(prev => {
      const cx = (prev.xMin + prev.xMax) / 2;
      const cy = (prev.yMin + prev.yMax) / 2;
      const rx = (prev.xMax - prev.xMin) / 2;
      const ry = (prev.yMax - prev.yMin) / 2;
      return {
        xMin: cx - rx * factor,
        xMax: cx + rx * factor,
        yMin: cy - ry * factor,
        yMax: cy + ry * factor
      };
    });
  };

  const zoomIn = () => zoom(0.75);
  const zoomOut = () => zoom(1.25);
  
  const resetZoom = () => {
    setBounds({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  };

  // Panning functionality
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    
    const scaleX = (bounds.xMax - bounds.xMin) / canvas.width;
    const scaleY = (bounds.yMax - bounds.yMin) / canvas.height;
    
    const mathDx = dx * scaleX;
    const mathDy = dy * scaleY;
    
    setBounds(prev => ({
      xMin: prev.xMin - mathDx,
      xMax: prev.xMax - mathDx,
      yMin: prev.yMin + mathDy, // Canvas Y is inverted
      yMax: prev.yMax + mathDy
    }));
  };

  const handlePointerUp = (e) => {
    isDragging.current = false;
    e.target.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheelNative = (e) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.25 : 0.75;
      
      setBounds(prev => {
        const cx = (prev.xMin + prev.xMax) / 2;
        const cy = (prev.yMin + prev.yMax) / 2;
        const rx = (prev.xMax - prev.xMin) / 2;
        const ry = (prev.yMax - prev.yMin) / 2;
        
        if (rx * factor < 1e-10 || rx * factor > 1e10) return prev;
        
        return {
          xMin: cx - rx * factor,
          xMax: cx + rx * factor,
          yMin: cy - ry * factor,
          yMax: cy + ry * factor
        };
      });
    };

    canvas.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleWheelNative);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.grapher}>
        
        <div className={styles.controls}>
          <div className={styles.equationsList}>
            {equations.map(eq => (
              <div 
                key={eq.id} 
                className={styles.equationItem} 
                style={{ borderColor: activeEqId === eq.id ? 'var(--accent)' : 'var(--border)' }}
                onClick={() => setActiveEqId(eq.id)}
              >
                <div className={styles.colorIndicator} style={{ backgroundColor: eq.color }}></div>
                <input 
                  type="text" 
                  className={styles.eqInput}
                  value={eq.text}
                  onChange={(e) => updateEquation(eq.id, e.target.value)}
                  onFocus={() => setActiveEqId(eq.id)}
                  placeholder="f(x) ="
                  spellCheck="false"
                />
                <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); toggleVisibility(eq.id); }} title="Toggle Visibility">
                  {eq.visible ? '👁' : '🙈'}
                </button>
                <button className={`${styles.iconBtn} ${styles.danger}`} onClick={(e) => { e.stopPropagation(); deleteEquation(eq.id); }} title="Delete Equation">
                  ✕
                </button>
              </div>
            ))}
            <button className={styles.addBtn} onClick={addEquation}>+ Add Equation</button>
          </div>
          
          <div className={styles.keypad}>
            {['sin', 'cos', 'tan', 'log'].map(k => (
               <button key={k} className={`${styles.keyBtn} ${styles.action}`} onClick={() => insertText(k)}>{k}</button>
            ))}
            {['7', '8', '9', '/'].map(k => (
               <button key={k} className={styles.keyBtn} onClick={() => insertText(k)}>{k}</button>
            ))}
            {['4', '5', '6', '*'].map(k => (
               <button key={k} className={styles.keyBtn} onClick={() => insertText(k)}>{k}</button>
            ))}
            {['1', '2', '3', '-'].map(k => (
               <button key={k} className={styles.keyBtn} onClick={() => insertText(k)}>{k}</button>
            ))}
            {['0', '.', '^', '+'].map(k => (
               <button key={k} className={styles.keyBtn} onClick={() => insertText(k)}>{k}</button>
            ))}
            {['(', ')', 'pi', 'e'].map(k => (
               <button key={k} className={`${styles.keyBtn} ${styles.action}`} onClick={() => insertText(k)}>{k}</button>
            ))}
            {['x', 'y', 'E', 'sqrt'].map(k => (
               <button key={k} className={`${styles.keyBtn} ${styles.action}`} onClick={() => insertText(k)}>{k}</button>
            ))}
          </div>
          
          <div className={styles.controlGroup} style={{ marginTop: 'auto' }}>
            <div className={styles.btnGroup}>
              <button className={styles.btn} onClick={zoomOut}>Zoom Out</button>
              <button className={styles.btn} onClick={zoomIn}>Zoom In</button>
            </div>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={resetZoom}>Reset View</button>
          </div>
        </div>

        <div className={styles.canvasContainer}>
          <canvas 
            ref={canvasRef} 
            className={styles.canvas}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ touchAction: 'none' }}
          ></canvas>
        </div>
        
      </div>
    </div>
  );
}
