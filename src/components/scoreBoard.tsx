import React from "react";

interface ScoreBoardProps {
  score: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
  return (
    <div className="absolute left-4 top-4 z-10 text-2xl font-bold text-white">
      Score: {score}
    </div>
  );
};

export default React.memo(ScoreBoard);
