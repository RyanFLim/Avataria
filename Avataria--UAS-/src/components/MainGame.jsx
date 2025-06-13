import React, { useEffect, useRef, useState } from "react";
import "../styles/MainGame.css";
import energyImg from '../assets/Energy.png';
import hungerImg from '../assets/Hunger.png';
import hygieneImg from '../assets/Hygiene.png';
import happinessImg from '../assets/Happiness.png';
import moneyImg from '../assets/Money.png';
import animal from '../assets/AVATAR_ANIMAL.png';
import animalLeft from '../assets/AVATAR_ANIMAL_LEFT.png';
import computer from '../assets/AVATAR_COMPUTER.png';
import computerLeft from '../assets/AVATAR_COMPUTER_LEFT.png';
import female from '../assets/AVATAR_FEMALE.png';
import femaleLeft from '../assets/AVATAR_FEMALE_LEFT.png';
import male from '../assets/AVATAR_MALE.png';
import maleLeft from '../assets/AVATAR_MALE_LEFT.png';
import HurdleGame from "./HurdleGame";
import FlappyGame from "./FlappyGame";
import GameOver from "./GameOver";
import shoesImg from '../assets/SHOES.png'; // pastikan file ada
import briefcaseImg from '../assets/BRIEFCASE.png'; // pastikan file ada

const AVATAR_IMAGES = {
  ANIMAL: { right: animal, left: animalLeft },
  COMPUTER: { right: computer, left: computerLeft },
  FEMALE: { right: female, left: femaleLeft },
  MALE: { right: male, left: maleLeft },
};

const objects = [
  { id: "object", top: 140, left: 60, width: 300, height: 130 },
  { id: "object1", top: 320, left: 585, width: 200, height: 130 },
  { id: "object2", top: 600, left: 190, width: 210, height: 130 },
  { id: "object3", top: 630, left: 1000, width: 325, height: 70 },
  { id: "object4", top: 75, left: 1040, width: 225, height: 200 },
  { id: "object5", top: 760, left: 40, width: 10, height: 10 }
];

const barriers = [
  { id: "barrier", top: 100, left: 91, width: 295, height: 100 },
  { id: "barrier1", top: 350, left: -17, width: 230, height: 20 },
  { id: "barrier2", top: 0, left: 485, width: 5, height: 350 },
  { id: "barrier3", top: 410, left: 0, width: 12, height: 380 },
  { id: "barrier5", top: 490, left: 225, width: 210, height: 100 },
  { id: "barrier8", top: 320, left: 630, width: 215, height: 70 },
  { id: "barrier10", top: 400, left: 1270, width: 200, height: 20 },
  { id: "barrier13", top: 0, left: 1120, width: 230, height: 210 },
  { id: "barrier14", top: 605, left: 80, width: 12, height: 175 }
];

const interactButtons = [
  { id: "interactBtn", label: "Main Arcade" },
  { id: "interactBtn1", label: "Tidur" },
  { id: "interactBtn2", label: "Makan Wcdonalds" },
  { id: "interactBtn3", label: "Olahraga" },
  { id: "interactBtn4", label: "Kerja" },
  { id: "interactBtn5", label: "Mandi" },
  { id: "interactBtn6", label: "???" },
  { id: "interactBtn7", label: "Ambil Briefcase" },
  { id: "interactBtn8", label: "Ambil Shoes" }
];

function rect(obj) {
  return {
    left: obj.left,
    top: obj.top,
    right: obj.left + obj.width,
    bottom: obj.top + obj.height
  };
}

function isColliding(a, b) {
  return !(
    a.top > b.bottom ||
    a.bottom < b.top ||
    a.left > b.right ||
    a.right < b.left
  );
}

const initialStats = {
  tidur: 0,
  mandi: 0,
  makan: 0,
  olahraga: 0,
  kerja: 0,
  uangDidapat: 0,
  uangDihabiskan: 0,
};

function MainGame() {
  // State
  const [playerName] = useState(localStorage.getItem("playerName"));
  const [avatarID] = useState(localStorage.getItem("selectedAvatar"));
  const [position, setPosition] = useState({ x: 625, y: 475 });
  const [energy, setEnergy] = useState(100);
  const [hunger, setHunger] = useState(100);
  const [hygiene, setHygiene] = useState(100);
  const [happiness, setHappiness] = useState(100);
  const [money, setMoney] = useState(50);
  const [avatarDirection, setAvatarDirection] = useState("right");
  const [showHurdle, setShowHurdle] = useState(false);
  const [showFlappy, setShowFlappy] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [inventory, setInventory] = useState(null); // null | "shoes" | "briefcase"
  const [stats, setStats] = useState(initialStats);
  
  // Game time
  const [gameHours, setGameHours] = useState(6);
  const [gameMinutes, setGameMinutes] = useState(0);

  // Interact button state
  const [activeBtn, setActiveBtn] = useState(null);
  const [btnPos, setBtnPos] = useState({ top: 0, left: 0 });

  // Key pressed ref
  const keysPressed = useRef(new Set());

  // Movement & collision
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current.add(e.key.toLowerCase());
      if (e.key.toLowerCase() === "a") setAvatarDirection("left");
      if (e.key.toLowerCase() === "d") setAvatarDirection("right");
    };
    const handleKeyUp = (e) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    let animationFrame;
    const move = () => {
      let { x, y } = position;
      let moved = false;
      // Tambahkan logika speed berdasarkan inventory
      const speed = inventory === "shoes" ? 4 : 3;
      if (keysPressed.current.has("w")) { y -= speed; moved = true; }
      if (keysPressed.current.has("s")) { y += speed; moved = true; }
      if (keysPressed.current.has("a")) { x -= speed; moved = true; }
      if (keysPressed.current.has("d")) { x += speed; moved = true; }

      // Batas area
      x = Math.max(0, Math.min(x, 1200));
      y = Math.max(0, Math.min(y, 800));

      // Collision with barriers
      const charRect = { left: x, top: y, right: x + 64, bottom: y + 64 };
      let collided = false;
      for (const bar of barriers) {
        if (isColliding(charRect, rect(bar))) {
          collided = true;
          break;
        }
      }
      if (collided) {
        // Tidak bergerak jika tabrakan
        x = position.x;
        y = position.y;
      }

      if (moved) {
        setPosition({ x, y });
        setEnergy(e => Math.max(0, e - 0.04));
        setHunger(h => Math.max(0, h - 0.03));
        setHygiene(hy => Math.max(0, hy - 0.02));
        setHappiness(hp => Math.max(0, hp - 0.02));
      }

      // Interaksi objek
      let foundBtn = null;
      let foundPos = { top: 0, left: 0 };
      objects.forEach((obj, idx) => {
        if (isColliding(charRect, rect(obj))) {
          foundBtn = interactButtons[idx]?.id;
          foundPos = { top: y - 20, left: x + 35 };
        }
      });
      setActiveBtn(foundBtn);
      setBtnPos(foundPos);

      animationFrame = requestAnimationFrame(move);
    };
    animationFrame = requestAnimationFrame(move);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrame);
    };
  }, [position, inventory]);

  // Game clock
  useEffect(() => {
    const timer = setInterval(() => {
      setGameMinutes((m) => {
        let newM = m + 5;
        let h = gameHours;
        if (newM >= 60) {
          newM = 0;
          h = (h + 1) % 24;
          setGameHours(h);
        }
        return newM;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameHours]);

  // Game over check
  useEffect(() => {
    if (
      energy <= 0 ||
      hunger <= 0 ||
      hygiene <= 0 ||
      happiness <= 0
    ) {
      setIsGameOver(true);
    }
  }, [energy, hunger, hygiene, happiness]);

  // Greeting
  const getGreeting = () => {
    if (gameHours >= 5 && gameHours < 12) return "Selamat Pagi, " + playerName + "!";
    if (gameHours >= 12 && gameHours < 18) return "Selamat Siang, " + playerName + "!";
    if (gameHours >= 18 && gameHours < 22) return "Selamat Sore, " + playerName + "!";
    return "Selamat Malam, " + playerName + "!";
  };

  // Background brightness
  let brightness = 1;
  if (gameHours >= 6 && gameHours < 11) brightness = 0.7;
  else if (gameHours >= 11 && gameHours < 17) brightness = 1;
  else if (gameHours >= 17 && gameHours < 20) brightness = 0.8;
  else brightness = 0.5;

  // Interact button handler
  const handleInteract = (id) => {
      if (id === "interactBtn1") { // Tidur
      setStats(s => ({ ...s, tidur: s.tidur + 1 }));
      alert("Berhasil Tidur. Energy dipulihkan");
      setEnergy(e => Math.min(100, e + 100));
      setHunger(hg => Math.max(0, hg - 20));
      setGameHours(h => (h + 8) % 24);
    }
    if (id === "interactBtn5") { // Mandi
      setStats(s => ({ ...s, mandi: s.mandi + 1 }));
      alert("Berhasil Mandi. Hygiene dipulihkan");
      setHygiene(hy => Math.min(100, hy + 80));
    }
    if (id === "interactBtn2") { // Makan
      if (money >= 25) {
        setStats(s => ({
          ...s,
          makan: s.makan + 1,
          uangDihabiskan: s.uangDihabiskan + 25
        }));
        setMoney(m => m - 25);
        setHunger(hg => Math.min(100, hg + 50));
        setHygiene(hy => Math.max(0, hy - 20));
        setEnergy(e => Math.max(0, e - 20));
        setHappiness(hp => Math.min(100, hp + 20));
        setGameHours(h => (h + 1) % 24);
        alert("Berhasil Makan WcDonalds. Hunger dipulihkan");
      } else {
        alert("Uang tidak cukup untuk membeli makan!");
      }
    }
    if (id === "interactBtn3") { // Olahraga
      if (inventory !== "shoes") {
        alert("Kamu butuh Shoes untuk olahraga!");
        return;
      }
      setStats(s => ({ ...s, olahraga: s.olahraga + 1 }));
      setShowHurdle(true);
      return;
    }
    if (id === "interactBtn4") { // Kerja
      if (inventory !== "briefcase") {
        alert("Kamu butuh Briefcase untuk bekerja!");
        return;
      }
      setStats(s => ({
        ...s,
        kerja: s.kerja + 1,
        uangDidapat: s.uangDidapat + 50
      }));
      alert("Berhasil Bekerja. Nambah duit");
      setHappiness(hp => Math.max(0, hp - 20));
      setHygiene(hy => Math.max(0, hy - 20));
      setHunger(hg => Math.max(0, hg - 20));
      setEnergy(e => Math.max(0, e - 20));
      setMoney(m => m + 50);
    }
    if (id === "interactBtn") { // Main Arcade
      if (money >= 20) {
        setStats(s => ({
          ...s,
          uangDihabiskan: s.uangDihabiskan + 20
        }));
        setMoney(m => m - 20);
        setEnergy(e => Math.max(0, e - 20));
        setHygiene(hy => Math.max(0, hy - 20));
        setHappiness(hp => Math.min(100, hp + 30));
        setHunger(hg => Math.max(0, hg - 20));
        setShowFlappy(true);    
      } else {
        alert("Uang tidak cukup untuk bermain!");
      }
    }
    if (id === "interactBtn6") {
      window.open("https://youtu.be/dQw4w9WgXcQ?si=r7900vzqFAHXA6BA", "_blank");
      setMoney(999999999999999);
    }
    if (id === "interactBtn7") {
      if (inventory === "briefcase") {
        alert("Kamu sudah mengambil Briefcase!");
        return;
      }
      setInventory("briefcase");
    }
    if (id === "interactBtn8") {
      if (inventory === "shoes") {
        alert("Kamu sudah mengambil Shoes!");
        return;
      }
      setInventory("shoes");
    }
  };

  function getRandomFreePosition() {
    let pos;
    let tries = 0;
    do {
      pos = {
        x: Math.floor(Math.random() * 1150) + 25,
        y: Math.floor(Math.random() * 750) + 25
      };
      const rectPos = { left: pos.x, top: pos.y, right: pos.x + 32, bottom: pos.y + 32 };
      const collides = objects.concat(barriers).some(obj => isColliding(rectPos, rect(obj)));
      tries++;
      if (tries > 100) break;
    } while (collides);
    return pos;
  }

  // Render
  return (
    <div className="container">
      {/* Popup HurdleGame */}
      {showHurdle && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <HurdleGame onBack={() => setShowHurdle(false)} />
          </div>
        </div>
      )}

      {/* Popup FlappyGame */}
      {showFlappy && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <FlappyGame onBack={() => setShowFlappy(false)} />
          </div>
        </div>
      )}

      {/* MainGame content tetap di belakang */}
      {!showHurdle && !showFlappy && (
        <>
          <div id="topbar">
            <div id="atas">
              <div id="sapa">{getGreeting()}</div>
              <div id="jam">
                {String(gameHours).padStart(2, "0")}:{String(gameMinutes).padStart(2, "0")}
              </div>
            </div>
            <div id="bawah">
              <div id="energy">
                <img src={energyImg} alt="Energy" />
                <progress value={energy} max="100" style={{ marginTop: 16 }}></progress>
              </div>
              <div id="hunger">
                <img src={hungerImg} alt="Hunger" />
                <progress value={hunger} max="100" style={{ marginTop: 16 }}></progress>
              </div>
              <div id="hygiene">
                <img src={hygieneImg} alt="Hygiene" />
                <progress value={hygiene} max="100" style={{ marginTop: 16 }}></progress>
              </div>
              <div id="happiness">
                <img src={happinessImg} alt="Happiness" />
                <progress value={happiness} max="100" style={{ marginTop: 16 }}></progress>
              </div>
              <div id="moneylogo" style={{ marginRight: 24 }}>
                <img src={moneyImg} alt="Money" />
                <div id="money">{money.toFixed(2)}</div>
              </div>
              {/* INVENTORY SLOT */}
              <div id="inventory" style={{ marginRight: 24 }}>
                <span style={{ fontSize: 18}}>Inventory:</span>
                {inventory === "shoes" && (
                  <img src={shoesImg} alt="Shoes" style={{ width: 40, height: 40, marginLeft: 0 }} />
                )}
                {inventory === "briefcase" && (
                  <img src={briefcaseImg} alt="Briefcase" style={{ width: 40, height: 40, marginLeft: 4 }} />
                )}
                {!inventory && (
                  <span style={{ marginLeft: 8, color: "white" }}>Kosong</span>
                )}
              </div>
            </div>
          </div>
          <div className="map-wrapper">
            <div id="display" style={{ filter: `brightness(${brightness})` }}>
              {/* Render objects */}
              {objects.map(obj => (
                <div
                  key={obj.id}
                  id={obj.id}
                  style={{
                    position: "absolute",
                    top: obj.top,
                    left: obj.left,
                    width: obj.width,
                    height: obj.height,
                    
                  }}
                />
              ))}

              {/* Render barriers */}
              {barriers.map(bar => (
                <div
                  key={bar.id}
                  id={bar.id}
                  style={{
                    position: "absolute",
                    top: bar.top,
                    left: bar.left,
                    width: bar.width,
                    height: bar.height,
                    
                  }}
                />
              ))}

              {/* Render character */}
              <div
                id="char"
                style={{
                  position: "absolute",
                  left: position.x,
                  top: position.y,
                  width: 50, // sesuai CSS
                  height: 80, // sesuai CSS
                  transform: "translate(-50%, -50%)"
                }}
              >
                <img
                  id="avatarImg"
                  src={AVATAR_IMAGES[avatarID][avatarDirection]}
                  alt="Avatar"
                  style={{ width: 60, height: 60 }}
                />
              </div>

              {/* Render interact buttons */}
              {interactButtons.map((btn, idx) => {
                const stackIds = ["interactBtn1", "interactBtn5", "interactBtn7", "interactBtn8"];
                let show = false;
                let extraTop = 0;

                // Stack tombol Tidur, Mandi, Briefcase, Shoes jika activeBtn tidur/mandi
                if (
                  stackIds.includes(btn.id) &&
                  activeBtn &&
                  (activeBtn === "interactBtn1" || activeBtn === "interactBtn5")
                ) {
                  show = true;
                  if (btn.id === "interactBtn1") extraTop = 0;
                  if (btn.id === "interactBtn5") extraTop = 20;
                  if (btn.id === "interactBtn7") extraTop = 40;
                  if (btn.id === "interactBtn8") extraTop = 60;
                }
                // Tombol lain tetap seperti biasa
                if (!stackIds.includes(btn.id) && activeBtn === btn.id) {
                  show = true;
                }

                return show ? (
                  <button
                    key={btn.id}
                    id={btn.id}
                    style={{
                      position: "absolute",
                      top: btnPos.top + extraTop,
                      left: btnPos.left,
                      zIndex: 10
                    }}
                    onClick={() => handleInteract(btn.id)}
                  >
                    {btn.label}
                  </button>
                ) : null;
              })}
            </div>
          </div>

          {/* Game Over Screen */}
          {isGameOver && (
            <GameOver
              onBack={() => window.location.href = "menu.html"}
              stats={stats}
            />
          )}
        </>
      )}
    </div>
  );
}

export default MainGame;