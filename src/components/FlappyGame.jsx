import React, { useEffect, useRef, useState } from 'react';
import '../styles/styleflapy.css';
import burung from '../assets/burung.png';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const BLOCK_WIDTH = 50;
const HOLE_HEIGHT = 130;
const GRAVITY = 3;
const JUMP_HEIGHT = 60;

function getRandomHoleTop() {
  return Math.floor(Math.random() * (GAME_HEIGHT - HOLE_HEIGHT - 100)) + 50;
}

function FlappyGame({ onBack }) {
  const [characterTop, setCharacterTop] = useState(200);
  const [blockLeft, setBlockLeft] = useState(GAME_WIDTH);
  const [holeTop, setHoleTop] = useState(getRandomHoleTop());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [jumping, setJumping] = useState(false);

  // Gravity and movement
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setCharacterTop(prev => {
        if (!jumping) {
          const next = prev + GRAVITY;
          return next > GAME_HEIGHT - 20 ? GAME_HEIGHT - 20 : next;
        }
        return prev;
      });
      setBlockLeft(prev => {
        if (prev <= -BLOCK_WIDTH) {
          setScore(s => s + 1);
          setHoleTop(getRandomHoleTop());
          return GAME_WIDTH;
        }
        return prev - 2;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [jumping, gameOver]);

  // Collision detection
  useEffect(() => {
    if (gameOver) return;
    // Block collision
    if (
      blockLeft < 50 &&
      blockLeft + BLOCK_WIDTH > 0 &&
      (characterTop < holeTop || characterTop > holeTop + HOLE_HEIGHT)
    ) {
      setGameOver(true);
    }
    // Ground/floor collision
    if (characterTop >= GAME_HEIGHT - 20) {
      setGameOver(true);
    }
  }, [characterTop, blockLeft, holeTop, gameOver]);

  // Reset game after game over
  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        alert(`Game Over. Score: ${score}`);
        setCharacterTop(200);
        setBlockLeft(GAME_WIDTH);
        setHoleTop(getRandomHoleTop());
        setScore(0);
        setGameOver(false);
      }, 100);
    }
  }, [gameOver, score]);

  // Jump handler
  const jump = () => {
    if (gameOver) return;
    setJumping(true);
    let jumpCount = 0;
    const jumpInterval = setInterval(() => {
      setCharacterTop(prev => {
        if (jumpCount < 15 && prev > 6) {
          return prev - (JUMP_HEIGHT / 15);
        }
        return prev;
      });
      jumpCount++;
      if (jumpCount > 15) {
        clearInterval(jumpInterval);
        setJumping(false);
      }
    }, 10);
  };

  // Keyboard event
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.key === " " || e.key === "ArrowUp") {
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [gameOver]);

  return (
    <div
      id="game"
      style={{
        position: "relative",
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        margin: "40px auto",
        background: "#aeefff",
        overflow: "hidden",
        border: "2px solid #333",
        borderRadius: 10,
      }}
    >
      {/* Block */}
      <div
        id="block"
        style={{
          position: "absolute",
          left: blockLeft,
          width: BLOCK_WIDTH,
          height: GAME_HEIGHT,
          top: 0,
          background: "transparent",
        }}
      >
        {/* Top wall */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: BLOCK_WIDTH,
            height: holeTop,
            background: "#228B22",
            borderRadius: "0 0 20px 20px",
          }}
        />
        {/* Hole */}
        <div
          id="hole"
          style={{
            position: "absolute",
            left: 0,
            top: holeTop,
            width: BLOCK_WIDTH,
            height: HOLE_HEIGHT,
            background: "transparent",
          }}
        />
        {/* Bottom wall */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: holeTop + HOLE_HEIGHT,
            width: BLOCK_WIDTH,
            height: GAME_HEIGHT - (holeTop + HOLE_HEIGHT),
            background: "#228B22",
            borderRadius: "20px 20px 0 0",
          }}
        />
      </div>
      {/* Character */}
      <div
        id="character"
        style={{
          position: "absolute",
          left: 30,
          top: characterTop,
          width: 40,
          height: 40,
          zIndex: 2,
        }}
      >
        <img src={burung} alt="Burung" style={{ width: "100%", height: "100%" }} />
      </div>
      {/* Score */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          color: "#333",
          fontWeight: "bold",
          fontSize: 20,
          zIndex: 3,
        }}
      >
        Score: {score}
      </div>
      {/* Tombol kembali */}
      <button
        id="balik"
        onClick={onBack}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 3,
          padding: "6px 16px",
          borderRadius: 6,
          border: "none",
          background: "#ffb347",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Kembali
      </button>
      {/* Tombol lompat */}
      <button
        onClick={jump}
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          zIndex: 3,
          padding: "6px 16px",
          borderRadius: 6,
          border: "none",
          background: "#4fc3f7",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        Lompat (Space/↑)
      </button>
    </div>
  );
}

export default FlappyGame;
