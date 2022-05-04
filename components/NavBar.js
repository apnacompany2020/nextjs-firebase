import React, { useContext, Fragment } from "react";
import Link from "next/link";
import { UserContext } from "@lib/context";
import { auth } from "@lib/firebase";
import { signOut } from "firebase/auth";

const NavBar = () => {
  const { user, userName } = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li className="btn-logo">
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>
        {userName && (
          <Fragment>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Write post</button>
              </Link>
            </li>
            <li>
              <SignOut />
            </li>
            <li>
              <Link href={`/${userName}`}>
                <img src={user?.photoURL} alt="user profile" />
              </Link>
            </li>
          </Fragment>
        )}
        {!userName && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log In</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;

const SignOut = () => {
  return (
    <button className="btn-red" onClick={() => signOut(auth)}>
      Sign Out
    </button>
  );
};
