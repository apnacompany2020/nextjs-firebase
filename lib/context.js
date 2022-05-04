import { createContext } from "react";
const userObject = { user: null, userName: null };

export const UserContext = createContext(userObject);
