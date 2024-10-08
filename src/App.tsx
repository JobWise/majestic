// @ts-nocheck
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { ArrowPathIcon, PlayIcon } from "@heroicons/react/24/solid";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

import Background from "./components/background";
import Obstacles from "./components/obstacles";
import Siren from "./components/siren";
import {
  messagesList,
  carTypes,
  MAJESTIC_BUCKET,
  RV_WIDTH,
  RV_HEIGHT,
  ROAD_STRIPE_WIDTH,
  ROAD_STRIPE_GAP,
  ROAD_STRIPE_CYCLE,
  ROAD_STRIPE_ANIMATION_DURATION,
} from "./constants";
import useAudio from "./hooks/useAudio";
import { getHighScores, submitHighScore } from "./firebase";
import Auth from "./Auth";

const powerupTypes = [
  {
    src: `${MAJESTIC_BUCKET}/power-up-DGo3gCqb.svg`,
    width: 30,
    height: 30,
    speed: 7, // Speed at which the power-up moves
    type: "doubleJump",
  },
];

function App() {
  const [user, setUser] = useState(null);

  const [highscores, setHighscores] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const gameRef = useRef(null);
  const startTimeRef = useRef(null);
  const keysPressed = useRef({
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    Space: false,
  });
  const [skyMessages, setSkyMessages] = useState([]);
  const animationFrameId = useRef(null);
  const lastTimeRef = useRef(Date.now());
  const backgroundAudio = useAudio(
    `${MAJESTIC_BUCKET}/background-music-game-BRycRIR-.mp3`,
    {
      loop: true,
      volume: 0.5,
    }
  );
  const jobwiseAudio = useAudio(
    `${MAJESTIC_BUCKET}/jobwise_city-CSgEQ8as.mp3`,
    { loop: true, volume: 0.5 }
  );
  const sirenAudio = useAudio(
    `${MAJESTIC_BUCKET}/police-siren-game-B1XSz0BQ.mp3`,
    { loop: false, volume: 0.5 }
  );
  const carAudio = useAudio(`${MAJESTIC_BUCKET}/car-go-game-CDMZBSGh.mp3`, {
    loop: true,
    volume: 0.1,
  });
  const powerUpAudio = useAudio(
    `${MAJESTIC_BUCKET}/power-up-game-DXx5e65g.mp3`,
    { loop: false, volume: 0.4 }
  );

  // State variable for selected song
  const [selectedSong, setSelectedSong] = useState("jobwise");

  // Toggle function for switching songs
  const toggleSong = () => {
    setSelectedSong((prevSong) =>
      prevSong === "backgroundMusic" ? "jobwise" : "backgroundMusic"
    );
  };

  const [powerups, setPowerups] = useState(0);
  const canDoubleJump = useRef(false);

  // const isHornPlaying = useRef(false);
  // const lastHornPlayTime = useRef(0);
  const hornAudio = useAudio(`${MAJESTIC_BUCKET}/yeehaw-game-BrswINW8.mp3`, {
    loop: false,
    volume: 0.7,
  });

  // Horizontal Velocity and Physics Constants
  const velocityX = useRef(0);
  const ACCELERATION = 0.5; // Acceleration per frame
  const MAX_SPEED = 10; // Maximum horizontal speed
  const FRICTION = 0.3; // Deceleration per frame when no input

  // Time of Day State (Optional)
  const [timeOfDay, setTimeOfDay] = useState("day"); // 'day' or 'night'

  // Vertical state managed with refs to prevent re-renders
  const rvY = useRef(0); // Vertical position (jumping)
  const velocityY = useRef(0); // Vertical velocity

  // Obstacles managed with refs to prevent re-renders
  const obstacles = useRef([]);

  // Horizontal Position managed with ref
  const rvX = useRef(100); // Horizontal position

  // Use a ref for score to prevent frequent state updates
  const scoreRef = useRef(0);

  // Ref for RV element
  const rvRef = useRef(null);

  const [health, setHealth] = useState(100); // Initialize health to 100

  const [isInFrontOfChipotle, setIsInFrontOfChipotle] = useState(false);

  const collidedObstacles = useRef(new Set());

  const [lastCollisionTime, _setLastCollisionTime] = useState(new Date());

  // Define cop car position and width
  const copPosition = 8; // Example position of the cop car
  const copWidth = 40; // Width of the cop car
  const proximityBuffer = 100; // Increase proximity range

  const loadHighscores = async () => {
    const scores = await getHighScores();
    setHighscores(scores);
  };

  useEffect(() => {
    loadHighscores();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const messageInterval = setInterval(() => {
      // Randomly select a message
      const randomIndex = Math.floor(Math.random() * messagesList.length);
      const selectedMessage = messagesList[randomIndex];

      // Randomize Y position within a certain range (e.g., top 30% of the screen)
      const maxY = window.innerHeight * 0.3;
      const randomY = Math.floor(Math.random() * maxY);

      // Create a new message object
      const newMessage = {
        id: Date.now(),
        type: selectedMessage.type,
        content: selectedMessage.content,
        x: window.innerWidth, // Start at the right edge
        y: randomY,
        speed: 1 + Math.random() * 2, // Random speed between 1 and 3
      };

      setSkyMessages((prevMessages) => [...prevMessages, newMessage]);
    }, 5000); // Add a new message every 5 seconds

    return () => clearInterval(messageInterval);
  }, [isRunning]);

  useEffect(() => {
    const imagesToPreload = [
      `${MAJESTIC_BUCKET}/chipotle-game-D31WZczL.svg`,
      `${MAJESTIC_BUCKET}/cop-game-mdVbxfeD.png`,
      `${MAJESTIC_BUCKET}/cyclist-game-B-76_0bM.png`,
      `${MAJESTIC_BUCKET}/the-majestic-game-D_mXofAo.svg`,
      `${MAJESTIC_BUCKET}/majestic-game-DSlk7pvK.png`,
      // Preload images from carTypes
      ...carTypes.map((car) => car.src),
      // Add any other images you use
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Generate stationary stars once using useMemo
  const stars = useMemo(() => {
    const starCount = 50; // Adjust as needed
    const starArray = [];
    for (let i = 0; i < starCount; i++) {
      starArray.push({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
      });
    }
    return starArray;
  }, []);

  // Adjust the jumping logic to allow double jumps
  const handleKeyDown = useCallback(
    (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (rvY.current === 0) {
          // First jump
          velocityY.current = 25;
          canDoubleJump.current = true; // Allow double jump
        } else if (canDoubleJump.current && powerups > 0) {
          // Perform double jump
          velocityY.current = 25; // Reset vertical velocity for double jump
          canDoubleJump.current = false; // Double jump used
          setPowerups((prev) => prev - 1); // Consume a power-up
        }
      } else if (e.code === "ArrowLeft") {
        keysPressed.current["ArrowLeft"] = true;
      } else if (e.code === "ArrowRight") {
        keysPressed.current["ArrowRight"] = true;
      }
    },
    [powerups]
  );

  // Handle key up events
  const handleKeyUp = useCallback((e) => {
    if (e.code === "ArrowLeft") {
      keysPressed.current["ArrowLeft"] = false;
    } else if (e.code === "ArrowRight") {
      keysPressed.current["ArrowRight"] = false;
    }
  }, []);

  // Prevent default behavior for specific keys to avoid scrolling
  useEffect(() => {
    const preventDefault = (e) => {
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          e.code
        )
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", preventDefault);
    return () => window.removeEventListener("keydown", preventDefault);
  }, []);

  // Optional: Implement Day-Night Cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay((prev) => (prev === "day" ? "night" : "day"));
    }, 60000); // Change every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Reset the double jump flag when landing
  useEffect(() => {
    if (rvY.current <= 0) {
      canDoubleJump.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rvY.current]);

  // Submit score to the server
  const submitScore = useCallback(async () => {
    if (scoreRef.current > 0) {
      await submitHighScore(user, scoreRef.current);
      await loadHighscores();
    }
  }, [user]);

  const playCrashSound = () => {
    const crashAudio = new Audio(`${MAJESTIC_BUCKET}/crash-game-C2N_JUJ-.mp3`);
    crashAudio.volume = 0.4;
    crashAudio.play();
  };

  // Collision detection function
  // Modify the collision detection to handle power-ups
  const checkCollision = useCallback(() => {
    const rvRect = {
      x: rvX.current,
      y: rvY.current,
      width: RV_WIDTH,
      height: RV_HEIGHT,
    };

    for (let i = obstacles.current.length - 1; i >= 0; i--) {
      const obs = obstacles.current[i];
      const obsRect = {
        x: obs.x,
        y: 0,
        width: obs.width,
        height: obs.height,
      };
      const isBicycle =
        obs.type.src === `${MAJESTIC_BUCKET}/cyclist-game-B-76_0bM.png`;
      const collisionBuffer = isBicycle ? 5 : 0;

      if (
        rvRect.x < obsRect.x + obsRect.width - collisionBuffer &&
        rvRect.x + rvRect.width > obsRect.x + collisionBuffer &&
        rvRect.y < obsRect.height &&
        rvRect.y + rvRect.height > obsRect.y
      ) {
        if (obs.isPowerup) {
          // Collision with power-up
          powerUpAudio.play();
          setPowerups((prev) => prev + 1);
          obstacles.current.splice(i, 1); // Remove power-up from the array
        } else if (!collidedObstacles.current.has(obs.id)) {
          // Collision with obstacle and not already collided
          playCrashSound(); // Play crash sound
          setHealth((prevHealth) => {
            const newHealth = Math.max(prevHealth - 70, 0);
            if (newHealth <= 0) {
              setIsRunning(false);
              submitScore();
            }
            return newHealth;
          });
          collidedObstacles.current.add(obs.id); // Mark this obstacle as collided
          break;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitScore]);
  // The main game loop with horizontal physics
  const gameLoop = useCallback(() => {
    const now = Date.now();
    const deltaTime = now - lastTimeRef.current;
    lastTimeRef.current = now;

    // Update sky messages positions
    setSkyMessages(
      (prevMessages) =>
        prevMessages
          .map((msg) => ({
            ...msg,
            x: msg.x - msg.speed * (deltaTime / 20),
          }))
          .filter((msg) => msg.x + 300 > 0) // Adjust 300 if your messages are wider
    );

    // Update vertical position (jumping)
    rvY.current += velocityY.current * (deltaTime / 20);
    if (rvY.current <= 0) {
      rvY.current = 0;
      velocityY.current = 0;
    } else {
      velocityY.current -= 1.5 * (deltaTime / 20); // Adjust gravity based on deltaTime
    }

    // Handle Horizontal Movement with Physics
    // Update velocityX based on key presses
    if (keysPressed.current["ArrowLeft"]) {
      velocityX.current -= ACCELERATION;
    }
    if (keysPressed.current["ArrowRight"]) {
      velocityX.current += ACCELERATION;
    }

    // Apply friction when no keys are pressed
    if (
      !keysPressed.current["ArrowLeft"] &&
      !keysPressed.current["ArrowRight"]
    ) {
      if (velocityX.current > 0) {
        velocityX.current -= FRICTION;
        if (velocityX.current < 0) velocityX.current = 0;
      } else if (velocityX.current < 0) {
        velocityX.current += FRICTION;
        if (velocityX.current > 0) velocityX.current = 0;
      }
    }

    // Clamp velocityX to max speed
    if (velocityX.current > MAX_SPEED) velocityX.current = MAX_SPEED;
    if (velocityX.current < -MAX_SPEED) velocityX.current = -MAX_SPEED;

    // Update rvX based on velocityX
    rvX.current += velocityX.current * (deltaTime / 20);

    // Clamp to screen boundaries
    const maxX = window.innerWidth - RV_WIDTH;
    if (rvX.current < 0) rvX.current = 0;
    if (rvX.current > maxX) rvX.current = maxX;

    // Update RV position via CSS transform
    if (rvRef.current) {
      rvRef.current.style.transform = `translate3d(${rvX.current}px, -${rvY.current}px, 0)`;
    }

    // Move obstacles
    obstacles.current = obstacles.current
      .map((obs) => ({
        ...obs,
        x: obs.x - obs.speed * (deltaTime / 20),
      }))
      .filter((obs) => obs.x > -obs.width);

    // Update obstacle positions via CSS transforms
    obstacles.current.forEach((obs) => {
      const obstacleElement = document.getElementById(`obstacle-${obs.id}`);
      if (obstacleElement) {
        obstacleElement.style.transform = `translate3d(${obs.x}px, 0, 0)`;
      }
    });

    // Collision detection
    checkCollision();

    // Increment score using a ref to avoid frequent state updates
    // Calculate elapsed time
    const elapsedTime = (now - startTimeRef.current) / 1000; // in seconds
    // Update score based on elapsed time
    scoreRef.current = Math.floor(elapsedTime * 100); // Example: 10 points per second
    setScore(scoreRef.current);

    // Continue the loop
    if (isRunning) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
  }, [isRunning, checkCollision]);

  // Update the displayed score periodically
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setScore(scoreRef.current);
      }, 100); // Update every 100ms
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = Date.now();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    } else if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isRunning, gameLoop]);

  // Generate obstacles at intervals using refs
  useEffect(() => {
    if (!isRunning) return;

    const obstacleInterval = setInterval(() => {
      const roadWidth = window.innerWidth;
      const isPowerup = Math.random() < 0.1; // 10% chance to spawn a power-up

      if (isPowerup) {
        // Generate power-up
        const powerupIndex = Math.floor(Math.random() * powerupTypes.length);
        const selectedPowerup = powerupTypes[powerupIndex];

        const maxX = roadWidth - selectedPowerup.width;
        const randomX = Math.floor(Math.random() * maxX) + roadWidth;

        const newPowerup = {
          id: Date.now(),
          x: randomX,
          type: selectedPowerup,
          width: selectedPowerup.width,
          height: selectedPowerup.height,
          speed: selectedPowerup.speed,
          isPowerup: true, // Mark this as a power-up
        };
        obstacles.current.push(newPowerup);
      } else {
        // Generate obstacle
        const randomIndex = Math.floor(Math.random() * carTypes.length);
        const selectedCar = carTypes[randomIndex];

        const maxX = roadWidth - selectedCar.width;
        const randomX = Math.floor(Math.random() * maxX) + roadWidth;

        const newObstacle = {
          id: Date.now(),
          x: randomX,
          type: selectedCar,
          width: selectedCar.width,
          height: selectedCar.height,
          speed: selectedCar.speed,
          isPowerup: false, // Not a power-up
        };
        obstacles.current.push(newObstacle);
      }
    }, 2000); // Adjust frequency as needed

    return () => clearInterval(obstacleInterval);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      setTimeout(() => {
        carAudio.play();
      }, 1000);
    } else {
      carAudio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  // useEffect to handle song changes
  useEffect(() => {
    if (isRunning) {
      if (selectedSong === "backgroundMusic") {
        backgroundAudio.play();
        jobwiseAudio.pause();
        jobwiseAudio.audioRef.current.currentTime = 0;
      } else {
        jobwiseAudio.play();
        backgroundAudio.pause();
        backgroundAudio.audioRef.current.currentTime = 0;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, selectedSong]);

  // Start or restart the game
  // Reset power-ups when starting/restarting the game
  const startGame = useCallback(() => {
    setIsRunning(true);
    backgroundAudio.play();
    sirenAudio.play();
    hornAudio.play();
    rvY.current = 0;
    rvX.current = 100;
    velocityY.current = 0;
    velocityX.current = 0;
    obstacles.current = [];
    scoreRef.current = 0;
    setScore(0);
    setPowerups(0); // Reset power-ups
    setHealth(100); // Reset health
    canDoubleJump.current = false; // Reset double jump flag
    startTimeRef.current = Date.now();

    if (rvRef.current) {
      rvRef.current.style.transform = `translate3d(${rvX.current}px, -${rvY.current}px, 0)`;
    }
    if (gameRef.current) {
      gameRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus the game area on mount
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const checkChipotlePosition = setInterval(() => {
      const chipotlePosition = 500; // Example position of the Chipotle store
      const chipotleWidth = 70; // Width of the Chipotle store

      const inFront =
        rvX.current >= chipotlePosition &&
        rvX.current <= chipotlePosition + chipotleWidth;
      setIsInFrontOfChipotle(inFront);

      const currentTime = Date.now();
      const canHeal = currentTime - lastCollisionTime > 2000; // 5-second cooldown

      if (inFront && canHeal) {
        setHealth((prevHealth) => Math.min(prevHealth + 5, 100)); // Restore 5 health points
      }
    }, 1000); // Check every second

    return () => clearInterval(checkChipotlePosition);
  }, [isRunning, lastCollisionTime]);

  useEffect(() => {
    if (!isRunning) return;

    const checkProximityToCop = setInterval(() => {
      const isTooCloseToCop =
        rvX.current >= copPosition - proximityBuffer &&
        rvX.current <= copPosition + copWidth + proximityBuffer;

      if (isTooCloseToCop) {
        setHealth((prevHealth) => Math.max(prevHealth - 10, 0)); // Deduct 10 health points
        if (health <= 0) {
          setIsRunning(false);
          submitScore();
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(checkProximityToCop);
  }, [isRunning, health, submitScore]);

  if (!user) return <Auth />;

  return (
    <div className="h-full w-screen overflow-hidden bg-gray-100">
      <div
        className="h-full w-full"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        ref={gameRef}
      >
        {/* Sky Background */}
        <Background timeOfDay={timeOfDay} stars={stars} />
        {/* Road Background */}
        <div className="absolute bottom-0 left-0 z-10 h-[40px] w-full bg-gray-700">
          {/* Road Stripes */}
          <div className="road-stripes"></div>
        </div>

        {/* Score Display */}
        <div className="absolute left-4 top-4 z-10 text-2xl font-bold text-white">
          Score: {score}
        </div>
        {/* Render sky messages */}
        {skyMessages.map((msg) => (
          <div
            key={msg.id}
            className="absolute z-10 will-change-transform"
            style={{
              left: msg.x,
              top: msg.y,
              zIndex: 5, // Adjust z-index as needed
            }}
          >
            {msg.type === "text" ? (
              <span
                className="whitespace-nowrap font-bold text-gray-50"
                style={{
                  fontSize: "24px",
                }}
              >
                {msg.content}
              </span>
            ) : (
              <img
                className="rounded-full"
                src={msg.content}
                alt="Sky Message"
                style={{
                  width: "200px", // Adjust size as needed
                  height: "auto",
                }}
              />
            )}
          </div>
        ))}
        {/* Highscores Display */}
        <div className="absolute right-4 top-4 z-10 rounded-lg bg-black bg-opacity-50 p-4 text-white">
          <h2 className="mb-2 text-xl font-bold">Highscores</h2>
          {highscores.length > 0 ? (
            <ol className="list-inside list-decimal">
              {highscores
                .sort((a, b) => b.score - a.score) // Sort descending by score
                .slice(0, 5) // Display top 5 highscores
                .map((hs) => (
                  <li key={hs.email}>
                    {hs.displayName}: {hs.score}
                  </li>
                ))}
            </ol>
          ) : (
            <p></p>
          )}
        </div>
        {/* Song Toggle Button */}
        <div className="absolute right-[300px] top-4 z-20 flex items-center space-x-2">
          <ArrowPathIcon
            className="size-4 cursor-pointer text-white"
            onClick={toggleSong}
          />
          <span className="text-white">
            {selectedSong === "backgroundMusic"
              ? "Wonkey Donkey"
              : "Oh Jobwise"}
          </span>
        </div>
        {/* Power-ups Display */}
        <div className="absolute left-4 top-16 z-10 flex items-center gap-2 text-xl font-bold text-white">
          Double Jumps:{" "}
          {Array.from({ length: powerups }).map((_, index) => (
            <img
              key={index}
              style={{ width: "30px", height: "30px" }}
              src={`${MAJESTIC_BUCKET}/power-up-DGo3gCqb.svg`}
              alt="Double Jump Power-up"
            />
          ))}
        </div>
        {/* RV */}
        <div
          className="absolute will-change-transform"
          style={{
            bottom: "1%",
            width: `${RV_WIDTH}px`,
            height: `${RV_HEIGHT}px`,
            zIndex: 20,
            transform: `translate3d(${rvX.current}px, -${rvY.current}px, 0)`,
          }}
          ref={rvRef}
        >
          {/* Health Bar */}
          <div
            className="absolute left-0 top-[-20px] h-2 w-full bg-gray-300"
            style={{
              width: `${RV_WIDTH}px`,
            }}
          >
            <div
              className="h-full bg-green-500"
              style={{
                width: `${health}%`,
              }}
            />
          </div>

          <img
            src={`${MAJESTIC_BUCKET}/majestic-game-DSlk7pvK.png`}
            alt="RV"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        <img
          alt="required"
          className="absolute bottom-[40px] left-[500px] h-[70px]"
          src={`${MAJESTIC_BUCKET}/chipotle-game-D31WZczL.svg`}
        />
        <img
          alt="required"
          className="absolute bottom-[8px] left-[8px] z-10 h-[40px]"
          src={`${MAJESTIC_BUCKET}/cop-game-mdVbxfeD.png`}
        />
        {/* Siren Overlay */}
        <div className="absolute bottom-[40px] left-[30px] z-10">
          <Siren />
        </div>
        {/* Obstacles Container */}
        <Obstacles obstacles={obstacles.current} />
        {/* Start/Restart Overlay */}
        {!isRunning && (
          <div
            onClick={startGame}
            className="group absolute inset-0 z-30 flex flex-col items-center justify-center bg-gray-800 bg-opacity-70 hover:cursor-pointer"
          >
            <img
              src={`${MAJESTIC_BUCKET}/the-majestic-game-D_mXofAo.svg`}
              alt="The Majestic"
            />
            {scoreRef.current > 0 && (
              <div className="mb-4 text-3xl text-white">
                Game Over! Your Score: {score}
              </div>
            )}
            <PlayIcon className="size-16 text-white group-hover:animate-bounce" />
          </div>
        )}
        {/* Chipotle Indicator */}
        {isInFrontOfChipotle && health < 100 && isRunning && (
          <div
            className="absolute animate-bounce font-bold capitalize text-green-500"
            style={{
              bottom: "120px", // Adjust position relative to Chipotle
              left: "570px", // Position of Chipotle
              zIndex: 30,
            }}
          >
            Extra Meat!
          </div>
        )}
        {isInFrontOfChipotle && health === 100 && isRunning && (
          <div
            className="absolute animate-bounce font-bold capitalize text-gray-500"
            style={{
              bottom: "120px", // Adjust position relative to Chipotle
              left: "550px", // Position of Chipotle
              zIndex: 30,
            }}
          >
            Come back soon!
          </div>
        )}
        {/* Registration Expired Message */}
        {isRunning &&
          rvX.current >= copPosition - proximityBuffer &&
          rvX.current <= copPosition + copWidth + proximityBuffer && (
            <div
              className="absolute animate-bounce text-sm font-bold text-red-500"
              style={{
                bottom: "60px", // Position above the cop car
                left: "8px", // Align with the cop car
                zIndex: 30,
              }}
            >
              Registration Expired! <br />
              Pull over now!
            </div>
          )}
      </div>
      {/* Inline Styles for Keyframes and Road Stripes Animation */}
      <style>
        {`
						@keyframes moveMountainsFar {
							from {
								transform: translateX(0);
							}
							to {
								transform: translateX(-300px); /* Move left by mountain width */
							}
						}

						@keyframes moveMountainsNear {
							from {
								transform: translateX(0);
							}
							to {
								transform: translateX(-400px); /* Move left by mountain width */
							}
						}

						@keyframes moveClouds {
							0% {
								transform: translateX(-150%);
							}
							100% {
								transform: translateX(150%);
							}
						}

						@keyframes rotateSun {
							from {
								transform: rotate(0deg);
							}
							to {
								transform: rotate(360deg);
							}
						}

						@keyframes twinkle {
							0%, 100% {
								opacity: 0.8;
							}
							50% {
								opacity: 0.2;
							}
						}

						/* Road Stripes Animation */
						@keyframes moveRoadStripes {
							from {
								background-position: 0 0;
							}
							to {
								background-position: -${ROAD_STRIPE_CYCLE}px 0;
							}
						}

						.road-stripes {
							position: absolute;
							top: 50%;
							left: 0;
							width: 100%;
							height: 2px;
							background-image: linear-gradient(
								90deg,
								rgba(255, 255, 0, 0.5) ${ROAD_STRIPE_WIDTH}px,
								transparent ${ROAD_STRIPE_GAP}px
							);
							background-size: ${ROAD_STRIPE_CYCLE}px 100%;
							animation: moveRoadStripes ${ROAD_STRIPE_ANIMATION_DURATION}s linear infinite;
							will-change: background-position;
						}

						/* Optimize Performance with will-change */
						.will-change-opacity {
							will-change: opacity;
						}
					`}
      </style>
    </div>
  );
}

export default App;
