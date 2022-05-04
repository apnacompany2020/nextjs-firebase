import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@lib/firebase";
import { doc, onSnapshot, getDoc, setDoc } from "firebase/firestore";

export const useUserDetails = () => {
  const [userName, setUserName] = useState();
  const [user] = useAuthState(auth);

  useEffect(() => {
    let unSub;
    if (user) {
      const docRef = doc(firestore, "users", user.uid);
      getDoc(docRef)
        .then((snap) => {
          if (!snap.exists()) {
            setDoc(docRef, user).catch(() => {
              throw new Error("error while adding new user");
            });
          }
        })
        .catch((error) => {
          console.log(error);
          throw new Error("error while reading user info in the database");
        });

      unSub = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
        setUserName(doc.data()?.username);
      });
    } else {
      setUserName(null);
    }
    return unSub;
  }, [user]);

  return { user, userName };
};
