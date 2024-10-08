import db, { HIGH_SCORES_DB } from "./db";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const getHighScores = async () => {
  const highscoresRef = collection(db, HIGH_SCORES_DB);
  const q = query(highscoresRef, orderBy("score", "desc"), limit(5));
  const querySnapshot = await getDocs(q);
  const highscores: {
    id: string;
    email: string;
    score: number;
    displayName: string;
  }[] = [];

  querySnapshot.forEach((doc) => {
    // @ts-ignore
    highscores.push({ id: doc.id, ...doc.data() });
  });
  return highscores;
};

export default getHighScores;
