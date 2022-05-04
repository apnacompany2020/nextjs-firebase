import * as firebase from "firebase/app";
import {
  getFirestore,
  getDocs,
  getDoc,
  orderBy,
  where,
  collection,
  limit,
  query,
  doc,
  collectionGroup,
  Timestamp,
  startAfter,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBUJIZf7u-AwFqHwx9RXyhtdIWUblAGc1k",
  authDomain: "nextjs-firebase-6ede6.firebaseapp.com",
  projectId: "nextjs-firebase-6ede6",
  storageBucket: "nextjs-firebase-6ede6.appspot.com",
  messagingSenderId: "1020161311720",
  appId: "1:1020161311720:web:82c3a2cac347b1f4d4da5d",
  measurementId: "G-5S921YZVKL",
};
// check for all the apps
if (!firebase.getApps().length) {
  firebase.initializeApp(firebaseConfig);
}

const app = firebase.getApp(); // get default app as i only have one app.

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  const q = query(
    collection(firestore, "users"),
    where("username", "==", username),
    limit(1)
  );
  const userDoc = (await getDocs(q)).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}

/**
 *
 * @param {DocumentSnapshot} docSnap
 * @returns {*}
 */
export async function getUserPosts(docSnap) {
  const q = query(
    collection(docSnap.ref, "posts"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(5)
  );
  const posts = (await getDocs(q))?.docs?.map(postToJSON);
  return posts;
}
/**
 *
 * @param {DocumentSnapshot} docSnap
 * @param {string} title
 * @returns
 */
export async function getUserPost(docSnap, title) {
  const postRef = doc(docSnap.ref, `posts/${title}`);
  const post = postToJSON(await getDoc(postRef));
  return post;
}

export async function getAllUserPosts(count) {
  const postsQuery = query(
    collectionGroup(firestore, "posts"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(count)
  );
  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  return posts;
}

export async function getNextUserPosts(last, count) {
  const cursor =
    typeof last.createdAt === "number"
      ? Timestamp.fromMillis(last.createdAt)
      : last.createdAt;

  const postsQuery = query(
    collectionGroup(firestore, "posts"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    startAfter(cursor),
    limit(count)
  );
  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  return posts;
}
