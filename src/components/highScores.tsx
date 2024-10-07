import React from "react";

export interface HighScore {
  userId: string;
  firstName: string;
  lastName: string;
  score: number;
}

interface HighScoresProps {
  highscores: HighScore[];
}

const HighScores: React.FC<HighScoresProps> = ({ highscores }) => {
  return (
    <div className="absolute right-4 top-4 z-10 rounded-lg bg-black bg-opacity-50 p-4 text-white">
      <h2 className="mb-2 text-xl font-bold">Highscores</h2>
      {highscores.length > 0 ? (
        <ol className="list-inside list-decimal">
          {highscores
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((hs) => (
              <li key={hs.userId}>
                {hs.firstName} {hs.lastName}: {hs.score}
              </li>
            ))}
        </ol>
      ) : (
        <p>No high scores yet!</p>
      )}
    </div>
  );
};

export default React.memo(HighScores);
