'use client';

import { useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';

const CELL_SIZE = 20;
const WIDTH = 400;
const HEIGHT = 400;

export default function SnakeGameWindow() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState([{ x: 160, y: 160 }]);
  const [direction, setDirection] = useState({ x: CELL_SIZE, y: 0 });
  const [food, setFood] = useState({ x: 200, y: 200 });
  const [gameOver, setGameOver] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': setDirection({ x: 0, y: -CELL_SIZE }); break;
        case 'ArrowDown': setDirection({ x: 0, y: CELL_SIZE }); break;
        case 'ArrowLeft': setDirection({ x: -CELL_SIZE, y: 0 }); break;
        case 'ArrowRight': setDirection({ x: CELL_SIZE, y: 0 }); break;
      }
    };

    window.addEventListener('keydown', handleKey);

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        if (
          newHead.x < 0 || newHead.y < 0 ||
          newHead.x >= WIDTH || newHead.y >= HEIGHT ||
          prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setGameOver(true);
          setGameRunning(false);
          clearInterval(interval);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * (WIDTH / CELL_SIZE)) * CELL_SIZE,
            y: Math.floor(Math.random() * (HEIGHT / CELL_SIZE)) * CELL_SIZE,
          });
          setScore((prevScore) => prevScore + 1);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 100);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKey);
    };
  }, [direction, food, gameRunning, gameOver]);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = 'green';
    snake.forEach(part => context.fillRect(part.x, part.y, CELL_SIZE, CELL_SIZE));
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, CELL_SIZE, CELL_SIZE);
    context.fillStyle = 'black';
    context.font = '20px Arial';
    context.fillText(`Score: ${score}`, 10, 30);
  }, [snake, food, score]);

  const startGame = () => {
    setGameRunning(true);
    setGameOver(false);
    setScore(0);
    setSnake([{ x: 160, y: 160 }]);
    setDirection({ x: CELL_SIZE, y: 0 });
    setFood({ x: 200, y: 200 });
  };

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setSnake([{ x: 160, y: 160 }]);
    setDirection({ x: CELL_SIZE, y: 0 });
    setFood({ x: 200, y: 200 });
  };

  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: 460,
        height: 550,
      }}
      minWidth={460}
      minHeight={550}
      dragHandleClassName="drag-handle"
    >
      <div className="rounded-xl shadow-xl border border-gray-400 bg-gray-100 flex flex-col h-full">
        {/* Header */}
        <div className="drag-handle flex items-center justify-between px-4 py-2 bg-green-600 text-white rounded-t-xl cursor-move">
          <span className="font-semibold">Snake Game</span>
          <div className="flex gap-1">
          </div>
        </div>

        {/* Game Content */}
        <div className="flex flex-col items-center justify-center flex-grow p-4">
          <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="border border-gray-700" />
          {gameOver && <p className="text-red-500 mt-2"></p>}
          {!gameRunning ? (
            <button
              onClick={startGame}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Play
            </button>
          ) : (
            <button
              onClick={restartGame}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Restart
            </button>
          )}
        </div>
      </div>
    </Rnd>
  );
}
