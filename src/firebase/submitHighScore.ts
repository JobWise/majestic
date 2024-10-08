import db, { HIGH_SCORES_DB } from "./db";
import { setDoc, doc, getDoc } from "firebase/firestore";

const submitScore = async (
  user: { email: string; displayName: string },
  score: number
) => {
  if (score > 0) {
    try {
      const docRef = doc(db, HIGH_SCORES_DB, user.email);

      // First, get the current document
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentScore = docSnap.data().score || 0;

        // Only update if the new score is higher
        if (score > currentScore) {
          await setDoc(docRef, {
            email: user.email,
            score,
            displayName: user.displayName,
            timestamp: new Date().toISOString(),
          });
          console.log("New high score submitted with ID: ", docRef.id);
        } else {
          console.log(
            "Score not submitted. It's not higher than the current high score."
          );
        }
      } else {
        // If the document doesn't exist, create it with the new score
        await setDoc(docRef, {
          email: user.email,
          score,
          displayName: user.displayName,
          timestamp: new Date().toISOString(),
        });
        console.log("First score submitted with ID: ", docRef.id);
      }
    } catch (e) {
      console.error("Error checking/submitting score: ", e);
    }
  }
};

export default submitScore;
