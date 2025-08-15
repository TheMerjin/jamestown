import React, { useState, useEffect, useRef } from "react";
import InputForm from "./inputForm.jsx";

const MAX_RESOURCE = 20;

const styles = {
  container: {
    maxWidth: 420,
    margin: "2rem auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fef6e4",
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    padding: "1.5rem 2rem",
    textAlign: "center",
    userSelect: "none",
    whiteSpace: "pre-wrap",
    fontFamily: "monospace, monospace",
  },
  header: {
    marginBottom: "1rem",
    fontWeight: "700",
    fontSize: "1.8rem",
    color: "#5a3e1b",
  },
  resourceRow: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "1rem",
  },
  resourceItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    fontWeight: "600",
    fontSize: "1.1rem",
    color: "#3c2f1e",
  },
  asciiArtBox: {
    fontSize: "0.8rem",
    lineHeight: "1rem",
    color: "#4b3f2f",
    marginBottom: "1rem",
    minHeight: "7rem",
    whiteSpace: "pre",
    userSelect: "none",
  },
  messageBox: {
    minHeight: "3.2rem",
    fontStyle: "italic",
    fontWeight: "600",
    color: "#5a4d3a",
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.6rem",
  },
  progressBarContainer: {
    width: "100%",
    height: 12,
    backgroundColor: "#ddd6c9",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: "1.5rem",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#a97c50",
    borderRadius: 6,
    transition: "width 0.4s ease",
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "0.6rem",
  },
  actionButton: {
    padding: "0.5rem 1.1rem",
    fontWeight: "600",
    fontSize: "1rem",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#d8b56a",
    color: "#422f0f",
    boxShadow: "0 3px 6px rgba(102, 78, 36, 0.35)",
    transition: "transform 0.15s ease, background-color 0.3s ease",
    userSelect: "none",
  },
  disabledButton: {
    backgroundColor: "#e3dcc6",
    color: "#999",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  restartButton: {
    marginTop: "1.5rem",
    padding: "0.6rem 1.4rem",
    fontWeight: "700",
    fontSize: "1.1rem",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#7a5e2a",
    color: "#fff",
    boxShadow: "0 4px 8px rgba(64, 47, 13, 0.6)",
    transition: "background-color 0.3s ease",
    userSelect: "none",
  },
  minigameOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  minigameBox: {
    backgroundColor: "#fff",
    padding: "1.5rem 2rem",
    borderRadius: 12,
    maxWidth: 320,
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  reactionButton: {
    padding: "1rem 2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#4caf50",
    color: "#fff",
    userSelect: "none",
    marginTop: "1rem",
    transition: "background-color 0.3s ease",
  },
  guessInput: {
    width: "60px",
    padding: "0.4rem",
    fontSize: "1.1rem",
    textAlign: "center",
    borderRadius: 6,
    border: "1px solid #aaa",
    marginTop: "1rem",
  },
  guessButton: {
    padding: "0.5rem 1rem",
    marginLeft: "0.6rem",
    fontWeight: "600",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#1976d2",
    color: "#fff",
    userSelect: "none",
  },
  seqButton: {
    margin: "0.3rem",
    padding: "0.6rem 1rem",
    fontWeight: "700",
    fontSize: "1rem",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#b8860b",
    color: "#fff",
    userSelect: "none",
  },
  diceButton: {
    marginTop: "1rem",
    padding: "0.6rem 1.2rem",
    fontWeight: "700",
    fontSize: "1.1rem",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#c94c4c",
    color: "#fff",
    userSelect: "none",
  }
};
async function addScore(playerName, score) {
  const { data, error } = await supabase
    .from('scores')
    .insert([{ player_name: playerName, score }]);

  if (error) {
    console.error('Error adding score:', error);
    return null;
  }
  return data;
}

const emojis = {
  food: "🍎",
  health: "❤️",
  morale: "😄",
  win: "🎉",
  lose: "⚠️",
};

// Simple ASCII character based on health/morale
function getAsciiArt(health, morale) {
  if (health > 14 && morale > 14) {
    return `
  (•_•)
  <)   )╯  Strong and happy!
   /    \\
`;
  } else if (health > 8 && morale > 8) {
    return `
  (•_•)
  <)   )   Holding steady.
   /    \\
`;
  } else if (health > 0 && morale > 0) {
    return `
  (x_x)
  <)   )   Struggling...
   /    \\
`;
  } else {
    return `
  (✖_✖)
  <)   )   Game Over
   /    \\
`;
  }
}

export default function SurviveJamestown({ startDay = 1, goalDays = 10 }) {
  
  const getInitialState = () => ({
    day: startDay,
    food: 10,
    health: 10,
    morale: 10,
    gameOver: false,
    message: `Survive for ${goalDays} days.`,
    messageEmoji: "🎯",
    minigame: null, // 'hunt', 'gather', 'rest', 'trade', 'dragon' or null
    // For rest sequence minigame
    restSequence: [],
    restPlayerSequence: [],
    restStep: 0,
    gatherGuess: "",
    tradeRoll: null,
  });

  const [state, setState] = useState(getInitialState);
  const [showInputForm, setShowInputForm] = useState(false); 
  const [wonTime, setWonTime] = useState(100000000000);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // === Game Logic updates ===
  function updateGameResources({ day, food, health, morale, message, emoji, gameOver = false, minigame = null }) {
    setState((s) => ({
      ...s,
      day,
      food: clamp(food, 0, MAX_RESOURCE),
      health: clamp(health, 0, MAX_RESOURCE),
      morale: clamp(morale, 0, MAX_RESOURCE),
      message,
      messageEmoji: emoji,
      gameOver,
      minigame,
      restSequence: [],
      restPlayerSequence: [],
      restStep: 0,
      gatherGuess: "",
      tradeRoll: null,
    }));
  }

  // === Minigame starters ===
  function startHuntMinigame() {
    setState((s) => ({
      ...s,
      minigame: "hunt",
      message: "Get ready to click when the button turns green!",
      messageEmoji: "🏹",
    }));
  }

  function startGatherMinigame() {
    setState((s) => ({
      ...s,
      minigame: "gather",
      message: "Guess a number between 1 and 5 to gather food!",
      messageEmoji: "🌾",
      gatherGuess: "",
    }));
  }

  function startRestMinigame() {
    // Generate random sequence of 3-5 numbers 1-4 for buttons to press
    const length = 3 + Math.floor(Math.random() * 3);
    const seq = Array.from({ length }, () => 1 + Math.floor(Math.random() * 4));
    setState((s) => ({
      ...s,
      minigame: "rest",
      restSequence: seq,
      restPlayerSequence: [],
      restStep: 0,
      message: "Repeat the sequence by clicking buttons in order!",
      messageEmoji: "🛌",
    }));
  }

  function startTradeMinigame() {
    setState((s) => ({
      ...s,
      minigame: "trade",
      message: "Roll a die! Higher rolls get better morale bonuses.",
      messageEmoji: "🤝",
      tradeRoll: null,
    }));
  }

  // === Called when player chooses an action ===
  function onActionClick(action) {
    if (state.gameOver) return;

    if (action === "hunt") {
      startHuntMinigame();
    } else if (action === "gather") {
      startGatherMinigame();
    } else if (action === "rest") {
      if (state.food < 2) {
        updateGameResources({
          ...state,
          message: "Not enough food to rest.",
          emoji: "⚠️",
        });
        return;
      }
      startRestMinigame();
    } else if (action === "trade") {
      if (state.food < 3) {
        updateGameResources({
          ...state,
          message: "Not enough food to trade.",
          emoji: "⚠️",
        });
        return;
      }
      startTradeMinigame();
    }
  }

  // --- Hunt minigame logic ---
  function HuntMinigame({ onComplete }) {
    const [buttonState, setButtonState] = useState("wait"); // wait -> go -> clicked -> timeout
    const timeoutId = useRef(null);
    const startTime = useRef(null);

    useEffect(() => {
      const delay = 1000 + Math.random() * 2000;
      timeoutId.current = setTimeout(() => {
        setButtonState("go");
        startTime.current = Date.now();
      }, delay);

      const failTimeout = setTimeout(() => {
        if (buttonState !== "clicked") {
          setButtonState("timeout");
          onComplete(null);
        }
      }, delay + 2000);

      return () => {
        clearTimeout(timeoutId.current);
        clearTimeout(failTimeout);
      };
    }, []);

    function onClick() {
      if (buttonState !== "go") return;
      const reactionTime = Date.now() - startTime.current;
      setButtonState("clicked");
      onComplete(reactionTime);
    }

    return (
      <div style={styles.minigameOverlay} role="dialog" aria-modal="true" aria-label="Hunt reaction minigame">
        <div style={styles.minigameBox}>
          <h3>Hunt Minigame</h3>
          <p>Click the button as fast as you can once it turns green!</p>
          <button
            onClick={onClick}
            disabled={buttonState !== "go"}
            style={{
              ...styles.reactionButton,
              backgroundColor: buttonState === "go" ? "#4caf50" : "#888",
              cursor: buttonState === "go" ? "pointer" : "not-allowed",
            }}
          >
            {buttonState === "go" ? "Click me!" : buttonState === "wait" ? "Get Ready..." : "..."}
          </button>
          {buttonState === "timeout" && <p style={{ color: "red" }}>Too slow! You failed.</p>}
        </div>
      </div>
    );
  }

  // --- Gather minigame logic ---
  function GatherMinigame({ onComplete }) {
    const [guess, setGuess] = useState("");

    function submitGuess() {
      const num = parseInt(guess);
      if (isNaN(num) || num < 1 || num > 5) {
        alert("Please enter a number between 1 and 5.");
        return;
      }
      onComplete(num);
    }

    return (
      <div style={styles.minigameOverlay} role="dialog" aria-modal="true" aria-label="Gather guess minigame">
        <div style={styles.minigameBox}>
          <h3>Gather Minigame</h3>
          <p>Guess a number between 1 and 5.</p>
          <input
            type="number"
            min={1}
            max={5}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            style={styles.guessInput}
          />
          <button onClick={submitGuess} style={styles.guessButton}>
            Guess
          </button>
        </div>
      </div>
    );
  }

  // --- Rest minigame logic: sequence memory ---
  function RestMinigame({ sequence, onComplete }) {
    const [playerSeq, setPlayerSeq] = useState([]);
    const [showSequence, setShowSequence] = useState(true);
    const [displayIndex, setDisplayIndex] = useState(0);

    // Show sequence animation
    useEffect(() => {
      if (!showSequence) return;

      if (displayIndex < sequence.length) {
        const timer = setTimeout(() => setDisplayIndex(displayIndex + 1), 800);
        return () => clearTimeout(timer);
      } else {
        // End show sequence phase
        setShowSequence(false);
      }
    }, [displayIndex, showSequence, sequence]);

    function onButtonClick(num) {
      if (showSequence) return; // ignore clicks while showing

      const newSeq = [...playerSeq, num];
      setPlayerSeq(newSeq);

      // Check if wrong button pressed early
      if (sequence[newSeq.length - 1] !== num) {
        onComplete(false);
        return;
      }

      // Check if sequence complete
      if (newSeq.length === sequence.length) {
        onComplete(true);
      }
    }

    return (
      <div style={styles.minigameOverlay} role="dialog" aria-modal="true" aria-label="Rest sequence minigame">
        <div style={styles.minigameBox}>
          <h3>Rest Minigame</h3>
          <p>{showSequence ? "Watch the sequence:" : "Repeat the sequence by clicking buttons in order."}</p>
          <div style={{ marginBottom: "1rem" }}>
            {showSequence
              ? `🔸 ${sequence.slice(0, displayIndex).join(" ")}`
              : `🔹 Your input: ${playerSeq.join(" ")}`}
          </div>
          <div>
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => onButtonClick(num)}
                style={styles.seqButton}
                disabled={showSequence}
                aria-label={`Sequence button ${num}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Trade minigame logic: dice roll ---
  function TradeMinigame({ onComplete, tradeRoll }) {
    const [rolling, setRolling] = useState(false);

    function rollDice() {
      if (rolling) return;
      setRolling(true);
      setTimeout(() => {
        const roll = 1 + Math.floor(Math.random() * 6);
        onComplete(roll);
        setRolling(false);
      }, 1000);
    }

    return (
      <div style={styles.minigameOverlay} role="dialog" aria-modal="true" aria-label="Trade dice roll minigame">
        <div style={styles.minigameBox}>
          <h3>Trade Minigame</h3>
          <p>Roll the die for morale bonus! Higher is better.</p>
          <button onClick={rollDice} disabled={rolling} style={styles.diceButton}>
            {rolling ? "Rolling..." : "Roll Die 🎲"}
          </button>
          {tradeRoll !== null && <p>Your roll: {tradeRoll}</p>}
        </div>
      </div>
    );
  }
function useAudioFade(url, play, fadeDuration = 3000) {
  const audioRef = useRef(null);
  const volumeRef = useRef(0);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.loop = true;
      audioRef.current.volume = 0;
    }
  }, [url]);

  useEffect(() => {
    if (!audioRef.current) return;

    let fadeInterval;
    const stepTime = 50; // ms, update interval
    const steps = fadeDuration / stepTime;

    if (play) {
      audioRef.current.play();

      // Fade in
      volumeRef.current = 0;
      audioRef.current.volume = 0;

      fadeInterval = setInterval(() => {
        volumeRef.current += 1 / steps;
        if (volumeRef.current >= 1) {
          volumeRef.current = 1;
          audioRef.current.volume = 1;
          clearInterval(fadeInterval);
        } else {
          audioRef.current.volume = volumeRef.current;
        }
      }, stepTime);
    } else {
      // Fade out
      volumeRef.current = audioRef.current.volume;

      fadeInterval = setInterval(() => {
        volumeRef.current -= 1 / steps;
        if (volumeRef.current <= 0) {
          volumeRef.current = 0;
          audioRef.current.volume = 0;
          audioRef.current.pause();
          clearInterval(fadeInterval);
        } else {
          audioRef.current.volume = volumeRef.current;
        }
      }, stepTime);
    }

    return () => clearInterval(fadeInterval);
  }, [play, fadeDuration]);

  return audioRef.current;
}
  function DragonHuntMinigame({ onComplete }) {
    const [canShoot, setCanShoot] = React.useState(true);
    const [time, setTime] = useState(0);
    const [seconds, setSeconds] = useState(0);
    // milliseconds cooldown between shots

  const [playerY, setPlayerY] = React.useState(1); // 0=top,1=middle,2=bottom lane
  const [fireballs, setFireballs] = React.useState([]); // array of {x: number, y: lane}
  const [playerShots, setPlayerShots] = React.useState([]); // array of {x: number, y: lane}
  const [dragonHits, setDragonHits] = React.useState(0);
  const [playerHits, setPlayerHits] = React.useState(0);
  const [gameState, setGameState] = React.useState("start");
  const [dragonY, setDragonY] = React.useState(1);
  const lastShotTime = useRef(0); // keeps value across renders but doesn't trigger re-renders
  const fireCooldown = 400; // ms between shots
   // start, playing, won, lost

  const lanes = 5; // vertical lanes: 0,1,2

  // Sprites URLs
  const hunterSprite =
    "/images/pixel-art-cowboy-riding-horse-retro-video-game-character-8-bit-style-with-green-hat_1292377-14344.jpg";
  const dragonSprite =
    "/images/pixel-art-flying-dragon-dragon-pixel-illustration-cartoon-monster-pixel-design-free-vector.jpg"
  const fireballSprite =
    "images/fire-pixel-art_158677-1816.png";

  // Game dimensions
  const gameWidth = 800;
  const gameHeight = 550;
   const laneHeight = gameHeight / lanes;
  useAudioFade("/waterflame/Glorious Morning.mp3", true, 3000);

  // Start game when clicking start
  function startGame() {
    setGameState("playing");
    setDragonHits(0);
    setPlayerHits(0);
    setFireballs([]);
    setPlayerShots([]);
    setPlayerY(1);
   }
   React.useEffect(() => {
     if (gameState !== "playing") return;
     
     

  const intervalId = setInterval(() => {
    const newLane = Math.floor(Math.random() * lanes);
    setDragonY(newLane);
  }, 500); // every 500 ms, change lane

  return () => clearInterval(intervalId);
}, [gameState, lanes]);
useEffect(() => {
    // Create an interval to increment the timer every second
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts or rerenders
    return () => clearInterval(interval);
  }, []);
  // Keyboard controls
  React.useEffect(() => {
    function handleKeyDown(e) {
      if (gameState !== "playing") return;
      if (e.key === "ArrowUp") {
        setPlayerY(y => (Math.max(0, y - 1)));
      } else if (e.key === "ArrowDown") {
        setPlayerY((y) => Math.min(lanes - 1, y + 1));
      } else if (e.key === " " || e.key === "Spacebar") {
        // Shoot
        shoot();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);
  const playerYRef = React.useRef(playerY);

  React.useEffect(() => {
  playerYRef.current = playerY;
}, [playerY]);
  // Shoot player shot
  function shoot() {
    if (gameState !== "playing") return;
    if (canShoot == false) return;
    const now = Date.now();
    if (now - lastShotTime.current < fireCooldown) {
      return; // still cooling down
    }
    lastShotTime.current = now;
    console.log(playerYRef.current);
    setPlayerShots((shots) => [...shots, { x: 50, y: playerYRef.current }]);
    }
   React.useEffect(() => {
  if (gameState !== "playing") return;

  const timer = setInterval(() => {
    setTime((t) => +(t + 0.1).toFixed(1));
    console.log(time);// increments time, triggers re-render
  }, 100);

  return () => clearInterval(timer);
}, [gameState]);

  // Game loop: update fireballs and shots position every 50ms
  React.useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setFireballs((fbs) =>
        fbs
          .map((fb) => ({ ...fb, x: fb.x - fb.increment })) // move left
          .filter((fb) => fb.x > 0) // remove if off screen
      );
      setPlayerShots((shots) =>
        shots
          .map((s) => ({ ...s, x: s.x + 20 })) // move right
          .filter((s) => s.x < gameWidth)
      );
    }, 25);

    return () => clearInterval(interval);
  }, [gameState]);

  // Dragon shoots fireballs randomly every 600-1200ms
  React.useEffect(() => {
    if (gameState !== "playing") return;
    const randNum = Math.floor(Math.random() * 5) + 1;
    setDragonY(randNum);
    let timeoutId;
    function shootFireball() {
      let lane = Math.floor(Math.random() * 6) + 1;
      if (lane > 5) {
        lane = playerYRef.current;
      }
      if (Math.random() > 0.7) {
        const player_pos = playerYRef.current;
        let above = (player_pos - 1) % 5;
        let below = (player_pos + 1) % 5;
        setFireballs((fbs) => [...fbs, { x: gameWidth - 60, y: above, increment: 20 }]);
        setFireballs((fbs) => [...fbs, { x: gameWidth - 60, y: below, increment : 20}]);
        
      }
      
      function randNormal(mean = 1, stddev = 0.3) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random(); // Convert [0,1) to (0,1)
        while (v === 0) v = Math.random();
        let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stddev + mean;
}
      const randNormalNum = Math.max(0.3, randNormal());
      setFireballs((fbs) => [...fbs, { x: gameWidth - 60, y: lane, increment : randNormalNum* 20}]);
      timeoutId = setTimeout(shootFireball, 50 +  Math.random()*500);
    }
    shootFireball();

    return () => clearTimeout(timeoutId);
  }, [gameState]);

  // Collision detection every 50ms
  React.useEffect(() => {
    if (gameState !== "playing") return;

    function checkCollisions() {
      let newFireballs = [...fireballs];
      let newShots = [...playerShots];
      let hitsToDragon = 0;
      let hitsToPlayer = 0;

      // Check player shot hits dragon (dragon is on x ~ 260, y = 1 middle lane)
      newShots = newShots.filter((shot) => {
        // if shot close to dragon's x and lane 1
        if (shot.x >= 700 && shot.y === dragonY) {
          hitsToDragon++;
          return false; // remove shot
        }
        return true;
      });

      // Check fireball hits player (player x ~ 20, playerY)
      newFireballs = newFireballs.filter((fb) => {
        // if fireball x < 40 and fb.y == playerY => hit
        if (fb.x <= 40 && fb.y === playerY) {
          hitsToPlayer++;
          return false; // remove fireball
        }
        return true;
      });

      if (hitsToDragon > 0) setDragonHits((h) => h + hitsToDragon);
      if (hitsToPlayer > 0) setPlayerHits((h) => h + hitsToPlayer);

      setFireballs(newFireballs);
      setPlayerShots(newShots);

      // Check win/loss condition
      if (dragonHits + hitsToDragon >= 20) {
        setGameState("won");
      } else if (playerHits + hitsToPlayer >= 100000) {
        setGameState("lost");
      }
    }
    const collisionInterval = setInterval(checkCollisions, 20);

    return () => clearInterval(collisionInterval);
  }, [fireballs, playerShots, playerY, dragonHits, playerHits, gameState]);

  // When game ends, wait 2 seconds then call onComplete with result
  React.useEffect(() => {
    if (gameState === "won") {
      const t = setTimeout(() => onComplete(true, seconds), 2000);
      return () => clearTimeout(t);
      
    } else if (gameState === "lost") {
      const t = setTimeout(() => onComplete(false), 2000);

      return () => clearTimeout(t);
    }
  }, [gameState]);

  return (
    <div
      style={{
        ...styles.minigameOverlay,
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingTop: 20,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Dragon Hunt minigame"
      tabIndex={-1}
    >
      <div
        style={{
          position: "relative",
          width: gameWidth,
          height: gameHeight,
          backgroundColor: "#f5f5f5ff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 0 12px #e25822",
          userSelect: "none",
        }}
      >
        {/* Hunter sprite */}
        <img
          src={hunterSprite}
          alt="Hunter riding horse"
          style={{
            position: "absolute",
            left: 10,
            top: playerY * laneHeight + laneHeight / 8,
            width: 100,
            height: laneHeight * 0.8,
            filter: gameState !== "playing" ? "grayscale(70%)" : "none",
            transition: "top 0.15s ease",
          }}
        />

        {/* Dragon sprite */}
        <img
          src={dragonSprite}
          alt="Flying dragon"
          style={{
            position: "absolute",
            right: 10,
            top: dragonY * laneHeight + laneHeight / 8,
            width: 80,
            height: laneHeight * 0.8,
            filter: gameState !== "playing" ? "grayscale(70%)" : "none",
          }}
        />

        {/* Fireballs */}
        {fireballs.map((fb, i) => (
          <img
            key={"fb" + i}
            src={fireballSprite}
            alt="Fireball"
            style={{
              position: "absolute",
              width: 30,
              height: 20,
              left: fb.x,
              top: fb.y * laneHeight + laneHeight / 3,
              pointerEvents: "none",
              filter: gameState !== "playing" ? "grayscale(70%)" : "none",
            }}
          />
        ))}

        {/* Player shots */}
        {playerShots.map((ps, i) => (
          <div
            key={"ps" + i}
            style={{
              position: "absolute",
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "cyan",
              left: ps.x,
              top: ps.y * laneHeight + laneHeight / 2 - 5,
              pointerEvents: "none",
              boxShadow: "0 0 8px cyan",
            }}
          />
        ))}

        {/* Status text */}
        <div
          style={{
            position: "absolute",
            bottom: 4,
            left: 10,
            color: "#fff",
            fontWeight: "700",
            fontSize: "0.85rem",
            textShadow: "0 0 6px #000",
            userSelect: "none",
          }}
        >
          Hits to dragon: {dragonHits} / 20 &nbsp;&nbsp; Hits to player: {playerHits} / 5 Timer: {seconds}
        </div>
      </div>

      {gameState === "start" && (
        <div style={{ marginTop: 20 }}>
          <p style={{ color: "#eee", fontWeight: "600", fontSize: "1.1rem" }}>
            Use ↑ and ↓ keys to move up and down lanes. Press Space to shoot!
          </p>
          <button
            onClick={startGame}
            style={{
              marginTop: 10,
              padding: "0.6rem 1.2rem",
              fontWeight: "700",
              fontSize: "1rem",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              backgroundColor: "#c94c4c",
              color: "#fff",
              userSelect: "none",
            }}
            aria-label="Start dragon hunt"
          >
            Start Dragon Hunt!
          </button>
        </div>
      )}

      {gameState === "won" && (
        <div style={{ marginTop: 20, color: "lime", fontWeight: "700", fontSize: "1.4rem" }}>
          You defeated the dragon! 🐉🎉
          <InputForm/>
        </div>
        
        
      )}
      {gameState === "lost" && (
        <div style={{ marginTop: 20, color: "tomato", fontWeight: "700", fontSize: "1.4rem" }}>
          You were burned by the dragon's fire! Game Over.
        </div>
      )}
    </div>
  );
}
  // === Main game logic on minigame complete ===
  function onMinigameComplete(result) {
    if (state.minigame === "hunt") {
      if (typeof result === "number") {
        // reaction time in ms, reward health + morale depending on speed
        let healthBonus = 3;
        let moraleBonus = 2;
        if (result < 400) {
          healthBonus = 5;
          moraleBonus = 4;
        } else if (result > 1500) {
          healthBonus = 1;
          moraleBonus = 1;
        }
        updateGameResources({
          ...state,
          health: state.health + healthBonus,
          morale: state.morale + moraleBonus,
          food: state.food - 3,
          day: state.day + 1,
          message: `You hunted successfully! (+${healthBonus} health, +${moraleBonus} morale, -3 food)`,
          emoji: "🏹",
          minigame: null,
        });
      } else {
        // failed or timeout
        updateGameResources({
          ...state,
          morale: state.morale - 2,
          day: state.day + 1,
          message: "You failed to hunt in time. (-2 morale)",
          emoji: "⚠️",
          minigame: null,
        });
      }
    } else if (state.minigame === "gather") {
      // correct guess is random 1-5
      const correct = 1 + Math.floor(Math.random() * 5);
      if (result === correct) {
        updateGameResources({
          ...state,
          food: state.food + 4,
          day: state.day + 1,
          message: `Correct! You gathered 4 food. (+4 food)`,
          emoji: "🌾",
          minigame: null,
        });
      } else {
        updateGameResources({
          ...state,
          morale: state.morale - 1,
          day: state.day + 1,
          message: `Wrong guess! The correct number was ${correct}. (-1 morale)`,
          emoji: "⚠️",
          minigame: null,
        });
      }
    } else if (state.minigame === "rest") {
      if (result === true) {
        // success, gain health and morale, lose some food
        updateGameResources({
          ...state,
          health: state.health + 4,
          morale: state.morale + 3,
          food: state.food - 2,
          day: state.day + 1,
          message: "You rested well! (+4 health, +3 morale, -2 food)",
          emoji: "🛌",
          minigame: null,
        });
      } else {
        updateGameResources({
          ...state,
          morale: state.morale - 3,
          day: state.day + 1,
          message: "You failed to rest properly. (-3 morale)",
          emoji: "⚠️",
          minigame: null,
        });
      }
    } else if (state.minigame === "trade") {
      if (typeof result === "number") {
        let moraleGain = 0;
        if (result >= 5) moraleGain = 5;
        else if (result >= 3) moraleGain = 3;
        else moraleGain = 1;
        updateGameResources({
          ...state,
          morale: state.morale + moraleGain,
          food: state.food - 3,
          day: state.day + 1,
          message: `Trade completed! (+${moraleGain} morale, -3 food)`,
          emoji: "🤝",
          minigame: null,
        });
      } else {
        updateGameResources({
          ...state,
          morale: state.morale - 2,
          day: state.day + 1,
          message: "Trade failed. (-2 morale)",
          emoji: "⚠️",
          minigame: null,
        });
      }
    }
  }

  // === useEffect for game over or starting dragon minigame ===
  useEffect(() => {
    if (state.health <= 0 && !state.gameOver) {
      updateGameResources({
        ...state,
        message: "You have died from poor health. Game over.",
        emoji: emojis.lose,
        gameOver: true,
        minigame: null,
      });
    } else if (state.morale <= 0 && !state.gameOver) {
      updateGameResources({
        ...state,
        message: "Your morale dropped to zero. The colony collapses. Game over.",
        emoji: emojis.lose,
        gameOver: true,
        minigame: null,
      });
    } else if (state.day > goalDays && !state.gameOver && state.minigame !== "dragon") {
      // Start the dragon hunt minigame instead of ending
      setState((s) => ({
        ...s,
        message: "🎉 You survived Jamestown! Now, start the Dragon Hunt! 🐉",
        messageEmoji: emojis.win,
        minigame: "dragon",
      }));
    }
  }, [state.health, state.morale, state.day]);

  // === Restart game handler ===
  function restartGame() {
    setState(getInitialState());
  }

  return (
    <div style={styles.container} role="main" aria-live="polite">
      <h1 style={styles.header}>Survive Jamestown</h1>
      <div style={styles.resourceRow}>
        <div style={styles.resourceItem}>{emojis.food} Food: {state.food}</div>
        <div style={styles.resourceItem}>{emojis.health} Health: {state.health}</div>
        <div style={styles.resourceItem}>{emojis.morale} Morale: {state.morale}</div>
      </div>

      <div style={styles.asciiArtBox}>{getAsciiArt(state.health, state.morale)}</div>

      <div style={styles.messageBox}>
        <span>{state.messageEmoji}</span> <span>{state.message}</span>
      </div>

      <div style={styles.progressBarContainer} aria-label={`Day ${state.day} of ${goalDays}`}>
        <div
          style={{
            ...styles.progressBarFill,
            width: `${(state.day / goalDays) * 100}%`,
          }}
        />
      </div>

      {!state.gameOver && !state.minigame && (
        <div style={styles.actionsContainer}>
          <button style={styles.actionButton} onClick={() => onActionClick("hunt")}>Hunt</button>
          <button style={styles.actionButton} onClick={() => onActionClick("gather")}>Gather</button>
          <button style={styles.actionButton} onClick={() => onActionClick("rest")}>Rest</button>
          <button style={styles.actionButton} onClick={() => onActionClick("trade")}>Trade</button>
        </div>
      )}

      {state.minigame === "hunt" && <HuntMinigame onComplete={onMinigameComplete} />}
      {state.minigame === "gather" && <GatherMinigame onComplete={onMinigameComplete} />}
      {state.minigame === "rest" && (
        <RestMinigame sequence={state.restSequence} onComplete={onMinigameComplete} />
      )}
      {state.minigame === "trade" && (
        <TradeMinigame onComplete={onMinigameComplete} tradeRoll={state.tradeRoll} />
      )}
      {state.minigame === "dragon" && (
        <DragonHuntMinigame
          onComplete={(won, time) => {
            if (won) {
              updateGameResources({
                ...state,
                message: "You conquered the dragon and won the game! 🎉🐉",
                messageEmoji: "🐲",
                gameOver: true,
                minigame: null,
              });
              console.log(time);
              setWonTime(time);
              setShowInputForm(true);
            } else {
              updateGameResources({
                ...state,
                message: "The dragon defeated you. Game over.",
                messageEmoji: emojis.lose,
                gameOver: true,
                minigame: null,
              });
            }
          }}
        />
      )}
      {showInputForm && <InputForm time = {wonTime} />}

      {state.gameOver && (
        <button
          style={styles.restartButton}
          onClick={restartGame}
          aria-label="Restart game"
          autoFocus
        >
          Restart Game
        </button>
      )}
    </div>
  );
}
