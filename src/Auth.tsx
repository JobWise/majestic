// @ts-nocheck
import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

import Background from "./components/background";
import { MAJESTIC_BUCKET } from "./constants";

function Auth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      setSigningIn(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  const signInWithGoogle = () => {
    setSigningIn(true);

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("User signed in:", user);
      })
      .catch((error) => {
        // Handle Errors here.
        console.error("Error during sign in:", error);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
      });
  };

  if (user || loading) return null;
  return (
    <div className="h-full w-screen overflow-hidden bg-gray-100">
      <div className="h-full w-full" tabIndex={0}>
        {/* Sky Background */}
        <Background timeOfDay={"day"} />
        <div className="group absolute inset-0 z-30 flex flex-col items-center justify-center bg-gray-800 bg-opacity-70 hover:cursor-pointer">
          <img
            src={`${MAJESTIC_BUCKET}/the-majestic-game-D_mXofAo.svg`}
            alt="The Majestic"
          />
          {signingIn ? (
            <div className="flex gap-2">
              <div class="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
              <div class="h-4 w-4 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
              <div class="h-4 w-4 animate-bounce rounded-full bg-white"></div>
            </div>
          ) : (
            <h3 className="text-3xl text-white" onClick={signInWithGoogle}>
              Sign in
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
