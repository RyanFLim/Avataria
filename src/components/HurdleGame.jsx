import React, { useEffect, useRef, useState } from 'react';
import '../styles/stylehurdle.css';
import hurdleImg from '../assets/hurdle.png';
import animal from '../assets/AVATAR_ANIMAL.png';
import computer from '../assets/AVATAR_COMPUTER.png';
import female from '../assets/AVATAR_FEMALE.png';
import male from '../assets/AVATAR_MALE.png';

const AVATAR_IMAGES = {
  ANIMAL: animal,
  COMPUTER: computer,
  FEMALE: female,
  MALE: male,
};

function HurdleGame({ onBack }) {
  const charRef = useRef(null);
  const blockRef = useRef(null);

  // Ambil avatar sesuai pilihan user
  const avatarID = localStorage.getItem("selectedAvatar") || "ANIMAL";
  const avatarImg = AVATAR_IMAGES[avatarID] || animal;

  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [blockRight, setBlockRight] = useState(0);

  // Jump logic
  const jump = () => {
    if (isJumping) return;
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
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
  });

  // Collision detection
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const char = charRef.current;
      const block = blockRef.current;
      if (!char || !block) return;

      const charRect = char.getBoundingClientRect();
      const blockRect = block.getBoundingClientRect();

      // Simple collision logic
      if (
        blockRect.left < charRect.right - 20 &&
        blockRect.right > charRect.left + 20 &&
        blockRect.bottom > charRect.top + 20 &&
        blockRect.top < charRect.bottom - 20
      ) {
        setGameOver(true);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Reset game on game over
  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        alert("Coba lagi");
        setGameOver(false);
      }, 100);
    }
  }, [gameOver]);

  // Block movement
  useEffect(() => {
    if (gameOver) return;
    setBlockRight(0);
    const interval = setInterval(() => {
      setBlockRight(prev => (prev >= 400 ? 0 : prev + 4));
    }, 16);
    return () => clearInterval(interval);
  }, [gameOver]);

  return (
    <div id="game" style={{ position: "relative", width: 400, height: 200, margin: "auto" }}>
      <div
        id="char"
        ref={charRef}
        className={isJumping ? "animate" : ""}
        style={{
          position: "absolute",
          left: 50,
          bottom: 0,
          width: 50,
          height: 50,
          transition: isJumping ? "bottom 0.5s" : "none",
          bottom: isJumping ? 100 : 0,
        }}
      >
        <img
          id="avatarImg"
          src={avatarImg}
          alt="Avatar"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div
        id="block"
        ref={blockRef}
        style={{
          position: "absolute",
          right: blockRight,
          bottom: 0,
          width: 30,
          height: 50,
        }}
      >
        <img src={hurdleImg} alt="Hurdle" style={{ width: "100%", height: "100%" }} />
      </div>
      <button
        style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}
        onClick={onBack}
      >
        Kembali
      </button>
      <button
        style={{ position: "absolute", bottom: 10, left: 10, zIndex: 2 }}
        onClick={jump}
      >
        Lompat (Space/↑)
      </button>
    </div>
  );
}

export default HurdleGame;
