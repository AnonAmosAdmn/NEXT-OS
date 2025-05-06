'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Rnd } from 'react-rnd';

export default function PaintCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [tool, setTool] = useState<'draw' | 'fill'>('draw');
  const [history, setHistory] = useState<string[]>([]); // Stores the history of canvas states
  const [historyIndex, setHistoryIndex] = useState<number>(-1); // Tracks the current history position

  // Function to save the canvas state to history
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = canvas.toDataURL();
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1); // Remove forward history if any
        newHistory.push(imageData);
        return newHistory;
      });
      setHistoryIndex((prevIndex) => prevIndex + 1);
    }
  }, [historyIndex]);

  // Resize canvas logic
  const resizeCanvas = useCallback((width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save current content
    const imgData = canvas.toDataURL();
    const img = new Image();
    img.src = imgData;

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
    };
  }, []);

  useEffect(() => {
    resizeCanvas(canvasSize.width, canvasSize.height);
  }, [canvasSize, resizeCanvas]);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    if (tool === 'fill') {
      floodFill(x, y, color);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveToHistory(); // Save state after each drawing action
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHistory([]); // Clear history on canvas clear
    setHistoryIndex(-1);
  };

  const saveAsPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const previousState = history[historyIndex - 1];
        const img = new Image();
        img.src = previousState;

        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          setHistoryIndex((prevIndex) => prevIndex - 1); // Move back in history
        };
      }
    }
  };

  const floodFill = (startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const targetColor = getColorAtPixel(data, startX, startY, canvas.width);
    const fillRgba = hexToRgba(fillColor);

    if (colorsMatch(targetColor, fillRgba)) return;

    const pixelStack = [[startX, startY]];

    while (pixelStack.length > 0) {
      const [x, y] = pixelStack.pop()!;
      const idx = (y * canvas.width + x) * 4;

      const currentColor = getColorAtPixel(data, x, y, canvas.width);
      if (!colorsMatch(currentColor, targetColor)) continue;

      setPixel(data, idx, fillRgba);
      if (x > 0) pixelStack.push([x - 1, y]);
      if (x < canvas.width - 1) pixelStack.push([x + 1, y]);
      if (y > 0) pixelStack.push([x, y - 1]);
      if (y < canvas.height - 1) pixelStack.push([x, y + 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const getColorAtPixel = (data: Uint8ClampedArray, x: number, y: number, width: number) => {
    const index = (y * width + x) * 4;
    return [data[index], data[index + 1], data[index + 2], data[index + 3]];
  };

  const colorsMatch = (a: number[], b: number[]) => {
    return a.every((val, i) => val === b[i]);
  };

  const hexToRgba = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255];
  };

  const setPixel = (data: Uint8ClampedArray, index: number, rgba: number[]) => {
    data[index] = rgba[0];
    data[index + 1] = rgba[1];
    data[index + 2] = rgba[2];
    data[index + 3] = rgba[3];
  };

  return (
    <Rnd
      default={{ x: 0, y: 0, width: 600, height: 550 }}
      minWidth={600}
      minHeight={500}
      dragHandleClassName="drag-handle"
      onResizeStop={(e, direction, ref) => {
        const newWidth = ref.offsetWidth - 60; 
        const newHeight = ref.offsetHeight - 140; 
        setCanvasSize({ width: newWidth, height: newHeight });
      }}
    >
      <div className="w-full h-full rounded-xl shadow-xl border border-gray-400 bg-gray-100 flex flex-col">
        {/* Header */}
        <div className="drag-handle cursor-move flex items-center justify-between px-4 py-2 bg-blue-600 text-white rounded-t-xl">
          <span className="font-semibold">Mini Paint</span>
          <div className="flex gap-1">
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 px-4 py-2 bg-white border-b border-gray-300">
          <label className="flex items-center gap-1 text-sm">
            🎨 Color:
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
          <label className="flex items-center gap-1 text-sm">
            🪣 Fill:
            <input
                type="checkbox"
                checked={tool === 'fill'}
                onChange={() => setTool(tool === 'fill' ? 'draw' : 'fill')}
            />
          </label>
          <label className="flex items-center gap-1 text-sm">
            🖌️ Size:
            <input
              type="range"
              min="1"
              max="30"
              value={brushSize}
              onChange={(e) => setBrushSize(+e.target.value)}
            />
          </label>

          <button
            onClick={undo}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Undo
          </button>
          <button
            onClick={clearCanvas}
            className="ml-auto px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Canvas
          </button>
          <button
            onClick={saveAsPNG}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save PNG
          </button>
        </div>

        {/* Canvas Area */}
        <div className="p-4 bg-gray-200 flex-grow overflow-hidden">
          <canvas
            ref={canvasRef}
            className="bg-white border border-gray-400 rounded shadow w-full h-full"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{ touchAction: 'none', cursor: 'crosshair' }}
          />
        </div>
      </div>
    </Rnd>
  );
}
