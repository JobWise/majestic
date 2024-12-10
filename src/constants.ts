export const MAJESTIC_BUCKET =
  "https://fly.storage.tigris.dev/majestic-assets";

export const messagesList = [
  { type: "text", content: "Bing Bong - Jax" },
  { type: "text", content: "Does that ring a bell - Jax" },
  { type: "text", content: "Don’t polish turds - Thomas" },
  { type: "text", content: "Tough titty, miss kitty - Tegan" },
  { type: "text", content: "Let's just keep doing what we are doing - Brian" },
  { type: "text", content: "TAB-E - Brian" },
  { type: "text", content: "This is the year (elk) - Tyler" },
  { type: "text", content: "I'm not a big maple bar boy - Eric" },
  { type: "text", content: "That hits - Eric" },
  { type: "text", content: "Today’s a swearing day - Ben" },
  { type: "text", content: "Elbow Windows - ChatGPT" },
  { type: "image", content: `${MAJESTIC_BUCKET}/sad-cat.gif` },
  { type: "image", content: `${MAJESTIC_BUCKET}/tami.jpg` },
];

// Road Stripe Constants
export const ROAD_STRIPE_WIDTH = 16;
export const ROAD_STRIPE_GAP = 25;
export const ROAD_STRIPE_CYCLE = ROAD_STRIPE_WIDTH + ROAD_STRIPE_GAP;
export const ROAD_STRIPE_ANIMATION_DURATION = 0.08;

// Car Types
export const carTypes = [
  {
    src: `${MAJESTIC_BUCKET}/car-retro.png`,
    width: 80,
    height: 27,
    speed: 4,
  },
  {
    src: `${MAJESTIC_BUCKET}/truck.png`,
    width: 80,
    height: 27,
    speed: 5,
  },
  {
    src: `${MAJESTIC_BUCKET}/tesla.png`,
    width: 80,
    height: 27,
    speed: 2,
  },
  {
    src: `${MAJESTIC_BUCKET}/cyclist.png`,
    width: 40,
    height: 28,
    speed: 8,
  },
];

// RV Dimensions
export const RV_WIDTH = 100;
export const RV_HEIGHT = 50;

// Game Settings
export const JUMP_STRENGTH = 25;
export const GRAVITY = 1.5;
export const ACCELERATION = 0.5;
export const MAX_SPEED = 10;
export const FRICTION = 0.3;

// Obstacle Settings
export const OBSTACLE_SPAWN_INTERVAL = 2000; // in ms
