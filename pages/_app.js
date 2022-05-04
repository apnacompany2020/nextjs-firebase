import { Fragment } from "react";
import "../styles/globals.css";
import NavBar from "@components/NavBar";
import { Toaster } from "react-hot-toast";
import { UserContext } from "@lib/context";
import { useUserDetails } from "@hooks/useUserDetails";

function MyApp({ Component, pageProps }) {
  const userObject = useUserDetails();
  return (
    <Fragment>
      <UserContext.Provider value={userObject}>
        <NavBar />
        <Component {...pageProps} />
        <Toaster />
      </UserContext.Provider>
    </Fragment>
  );
}

export default MyApp;
