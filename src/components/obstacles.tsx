import React from "react";

interface Obstacle {
  id: number;
  x: number;
  type: {
    src: string;
    width: number;
    height: number;
    speed: number;
  };
  width: number;
  height: number;
  speed: number;
}

interface ObstaclesProps {
  obstacles: Obstacle[];
}

const Obstacles: React.FC<ObstaclesProps> = ({ obstacles }) => {
  return (
    <div className="pointer-events-none absolute bottom-1 left-0 h-[70px] w-full">
      {obstacles.map((obs) => (
        <img
          key={obs.id}
          id={`obstacle-${obs.id}`}
          src={obs.type.src}
          alt="Obstacle"
          className="absolute will-change-transform"
          style={{
            bottom: "1%",
            left: "0px",
            width: `${obs.width}px`,
            height: `${obs.height}px`,
            zIndex: 10,
            transform: `translate3d(${obs.x}px, 0, 0)`,
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(Obstacles);
