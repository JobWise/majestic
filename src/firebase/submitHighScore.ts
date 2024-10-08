import db, { HIGH_SCORES_DB } from "./db";
import { setDoc, doc } from "firebase/firestore";

const submitScore = async (
  user: { email: string; displayName: string },
  score: number
) => {
  console.log(user, score);
  if (score > 0) {
    try {
      const docRef = doc(db, HIGH_SCORES_DB, user.email);

      await setDoc(docRef, {
        email: user.email,
        score,
        displayName: user.displayName,
        timestamp: new Date().toISOString(),
      });
      console.log("Score submitted with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
};

export default submitScore;
