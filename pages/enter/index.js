import React, {
  useContext,
  Fragment,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import { auth, firestore } from "@lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { UserContext } from "@lib/context";
import debounce from "lodash.debounce";

const Enter = () => {
  const { user, userName } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (user && userName) {
      router.push("/");
    }
  }, [user, userName, router]);
  return (
    <Fragment>
      {user && !userName && <UserName />}
      {!user && <SignIn />}
    </Fragment>
  );
};

export default Enter;

const SignIn = () => {
  const provider = new GoogleAuthProvider();

  const signInWithGoolge = () => {
    signInWithPopup(auth, provider).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      throw new Error(
        `Error while loggin with google. Details: errorCode - ${errorCode}, errorMessage - ${errorMessage} and user email - ${email}`
      );
    });
  };
  return (
    <button className="btn-google" onClick={signInWithGoolge}>
      sign in with google
    </button>
  );
};

const UserName = () => {
  const [username, setUsername] = useState();
  const [invalid, setInvalid] = useState(null);
  const { user } = useContext(UserContext);

  const onSubmit = async () => {
    try {
      await setDoc(doc(firestore, "usernames", username), {
        uid: user.uid,
      });
      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        username,
        photoURL: user.photoURL,
      });
    } catch (error) {
      throw new Error("error while updating user details. ");
    }
  };

  const handleUserInput = useCallback(
    debounce(async (val) => {
      if (val.length > 3) {
        const docRef = doc(firestore, "usernames", val);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInvalid(2);
        } else {
          setInvalid(0);
        }
      } else {
        setInvalid(1);
      }
    }, 500),
    []
  );
  return (
    <section>
      <form onSubmit={onSubmit}>
        <fieldset>
          <label htmlFor="username">Enter user name</label>
          <input
            id="username"
            onChange={(e) => {
              const val = e.target.value;
              setUsername(val);
              handleUserInput(val);
            }}
            type="text"
            value={username}
          />
        </fieldset>
        {invalid === 1 && (
          <h4 className="text-danger">
            User name length should be greater than 3!
          </h4>
        )}
        {invalid === 2 && (
          <h4 className="text-info">User name is already taken!</h4>
        )}
        {invalid === 0 && (
          <h4 className="text-success">User name is available!</h4>
        )}
        <button
          className="btn-green"
          type="submit"
          disabled={invalid === 0 ? false : true}
        >
          Submit
        </button>
      </form>
    </section>
  );
};
