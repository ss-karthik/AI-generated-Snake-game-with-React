import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const SPEED = 100;

type Point = { x: number; y: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAME_OVER'>('IDLE');

  const state = useRef({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    direction: { x: 0, y: -1 },
    nextDirection: { x: 0, y: -1 },
    food: { x: 5, y: 5 },
    particles: [] as Particle[],
    shakeTime: 0,
    lastMoveTime: 0,
    score: 0
  });

  const requestRef = useRef<number>(0);

  const spawnParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 15; i++) {
      state.current.particles.push({
        x: x * CELL_SIZE + CELL_SIZE / 2,
        y: y * CELL_SIZE + CELL_SIZE / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        maxLife: Math.random() * 20 + 10,
        color
      });
    }
  };

  const resetGame = () => {
    state.current = {
      snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
      direction: { x: 0, y: -1 },
      nextDirection: { x: 0, y: -1 },
      food: { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) },
      particles: [],
      shakeTime: 0,
      lastMoveTime: performance.now(),
      score: 0
    };
    setScore(0);
    setGameState('PLAYING');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameState !== 'PLAYING') resetGame();
        return;
      }

      const { direction } = state.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y !== 1) state.current.nextDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y !== -1) state.current.nextDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x !== 1) state.current.nextDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x !== -1) state.current.nextDirection = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = (time: number) => {
      requestRef.current = requestAnimationFrame(loop);

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      if (gameState === 'PLAYING') {
        const dt = time - state.current.lastMoveTime;
        if (dt >= SPEED) {
          state.current.lastMoveTime = time;
          state.current.direction = state.current.nextDirection;

          const head = state.current.snake[0];
          const newHead = {
            x: head.x + state.current.direction.x,
            y: head.y + state.current.direction.y
          };

          if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
            setGameState('GAME_OVER');
            state.current.shakeTime = 15;
            setHighScore(prev => Math.max(prev, state.current.score));
            spawnParticles(head.x, head.y, '#FF00FF');
          }
          else if (state.current.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
            setGameState('GAME_OVER');
            state.current.shakeTime = 15;
            setHighScore(prev => Math.max(prev, state.current.score));
            spawnParticles(head.x, head.y, '#FF00FF');
          } else {
            state.current.snake.unshift(newHead);

            if (newHead.x === state.current.food.x && newHead.y === state.current.food.y) {
              state.current.score += 10;
              setScore(state.current.score);
              spawnParticles(newHead.x, newHead.y, '#00FFFF');
              state.current.shakeTime = 5;
              
              let newFood;
              while (true) {
                newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
                if (!state.current.snake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
              }
              state.current.food = newFood;
            } else {
              state.current.snake.pop();
            }
          }
        }
      }

      ctx.save();
      if (state.current.shakeTime > 0) {
        const dx = (Math.random() - 0.5) * 15;
        const dy = (Math.random() - 0.5) * 15;
        ctx.translate(dx, dy);
        state.current.shakeTime--;
      }

      ctx.strokeStyle = '#00FFFF22';
      for(let i=0; i<=GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i*CELL_SIZE, 0);
        ctx.lineTo(i*CELL_SIZE, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i*CELL_SIZE);
        ctx.lineTo(CANVAS_SIZE, i*CELL_SIZE);
        ctx.stroke();
      }

      ctx.fillStyle = '#FF00FF';
      ctx.fillRect(state.current.food.x * CELL_SIZE + 2, state.current.food.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

      state.current.snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#FFFFFF' : '#00FFFF';
        ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      });

      state.current.particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 1 - (p.life / p.maxLife);
        ctx.fillRect(p.x, p.y, 4, 4);
        if (p.life >= p.maxLife) {
          state.current.particles.splice(i, 1);
        }
      });
      ctx.globalAlpha = 1.0;

      ctx.restore();
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex justify-between w-full max-w-[400px] border-2 border-[#FF00FF] bg-black p-2 font-pixel text-xs sm:text-sm">
        <div className="text-[#00FFFF]">SCORE:{score.toString().padStart(4, '0')}</div>
        <div className="text-[#FF00FF]">HI:{highScore.toString().padStart(4, '0')}</div>
      </div>
      
      <div className="relative border-4 border-[#00FFFF] bg-black p-1 shadow-[0_0_20px_#00FFFF]">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="w-full max-w-[400px] aspect-square bg-black block"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {gameState !== 'PLAYING' && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col gap-4 border-2 border-[#FF00FF] m-1">
            <div className="text-[#FF00FF] font-pixel text-xl sm:text-2xl text-center glitch-text" data-text={gameState === 'GAME_OVER' ? 'FATAL_ERROR' : 'AWAITING_INPUT'}>
              {gameState === 'GAME_OVER' ? 'FATAL_ERROR' : 'AWAITING_INPUT'}
            </div>
            <div className="text-[#00FFFF] font-vt text-xl animate-pulse">
              [PRESS SPACE TO EXECUTE]
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
