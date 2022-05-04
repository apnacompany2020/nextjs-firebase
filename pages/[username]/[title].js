import styles from "@styles/Post.module.css";
import PostContent from "@components/PostContent";
import AuthCheck from "@components/AuthCheck";
import Metatags from "@components/Metatags";
import { firestore, getUserWithUsername, getUserPost } from "@lib/firebase";
import { collectionGroup, getDocs, doc } from "firebase/firestore";

import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";

export async function getStaticProps({ params }) {
  const { username, title } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    post = await getUserPost(userDoc, title);
    // this is required so the later we can listen for any realtime updates.
    path = doc(userDoc.ref, `posts/${title}`).path;
  }

  return {
    props: { post, path },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  // get all the documents for posts collection for all users.
  const snapshot = await getDocs(collectionGroup(firestore, "posts"));

  // create paths using username and title from each document from the posts collection doc for all user
  const paths = snapshot.docs.map((doc) => {
    const { title, username } = doc.data();
    return {
      params: { username, title },
    };
  });

  return {
    paths,
    // fallback: "blocking" usage
    // during runtime is a static page is not generated during runtime
    // then Next will generate it using SSR techinque and then cache the HTML document as well
    fallback: "blocking",
  };
}

export default function Post(props) {
  const postRef = doc(firestore, props.path);
  const [realtimePost] = useDocumentData(postRef);

  // below does the realtime hydration of the post data.
  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>
      <Metatags title={post.title} description={post.title} />

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 💗 </strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <button className="btn-blue">💗 Like</button>
        </AuthCheck>
      </aside>
    </main>
  );
}
