import React from "react";

import Cloud from "./cloud";
import CloudLarge from "./cloudLarge";
import CloudSmall from "./cloudSmall";

interface BackgroundProps {
  timeOfDay: "day" | "night";
  stars: Array<{ id: number; top: string; left: string; delay: string }>;
}

const Background: React.FC<BackgroundProps> = ({ timeOfDay, stars }) => {
  return (
    <div
      className={`absolute left-0 top-0 h-full w-full overflow-hidden transition-colors duration-1000 ${
        timeOfDay === "day"
          ? "bg-gradient-to-b from-blue-300 via-blue-300 to-blue-300"
          : "bg-gradient-to-b from-indigo-900 via-indigo-700 to-indigo-900"
      }`}
    >
      {/* Clouds only visible during the day */}
      {timeOfDay === "day" && (
        <>
          {/* Large Clouds */}
          <CloudLarge
            style={{
              position: "absolute",
              left: "-150px",
              top: "20%",
              opacity: 0.8,
              animation: "moveClouds 60s linear infinite",
              willChange: "transform",
            }}
          />
          <CloudLarge
            style={{
              position: "absolute",
              left: "80%",
              top: "10%",
              opacity: 0.6,
              animation: "moveClouds 80s linear infinite",
              willChange: "transform",
            }}
          />

          {/* Medium Clouds */}
          <Cloud
            style={{
              position: "absolute",
              left: "-100px",
              top: "50%",
              opacity: 0.7,
              animation: "moveClouds 70s linear infinite",
              willChange: "transform",
            }}
          />
          <Cloud
            style={{
              position: "absolute",
              left: "60%",
              top: "40%",
              opacity: 0.5,
              animation: "moveClouds 90s linear infinite",
              willChange: "transform",
            }}
          />

          {/* Small Clouds */}
          <CloudSmall
            style={{
              position: "absolute",
              left: "-80px",
              top: "70%",
              opacity: 0.9,
              animation: "moveClouds 50s linear infinite",
              willChange: "transform",
            }}
          />
          <CloudSmall
            style={{
              position: "absolute",
              left: "70%",
              top: "60%",
              opacity: 0.7,
              animation: "moveClouds 100s linear infinite",
              willChange: "transform",
            }}
          />
        </>
      )}

      {/* Sun or Moon */}
      {timeOfDay === "day" ? (
        <div
          className="absolute rounded-full bg-yellow-400"
          style={{
            width: "80px",
            height: "80px",
            top: "10%",
            right: "10%",
            boxShadow: "0 0 30px 10px rgba(255, 223, 0, 0.6)",
            animation: "rotateSun 60s linear infinite",
            willChange: "transform",
          }}
        ></div>
      ) : (
        <div
          className="absolute rounded-full bg-gray-300"
          style={{
            width: "60px",
            height: "60px",
            top: "15%",
            right: "15%",
            boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.5)",
            willChange: "transform",
          }}
        >
          {/* Optionally, add details to the moon */}
        </div>
      )}

      {/* Stars visible at night */}
      {timeOfDay === "night" &&
        stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: "2px",
              height: "2px",
              top: star.top,
              left: star.left,
              animation: `twinkle 2s infinite`,
              animationDelay: star.delay,
              willChange: "opacity",
            }}
          ></div>
        ))}
    </div>
  );
};

export default React.memo(Background);
