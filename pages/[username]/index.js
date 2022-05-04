import { getUserWithUsername, getUserPosts } from "@lib/firebase";
import UserProfile from "@components/UserProfile";
import PostFeed from "@components/PostFeed";

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    posts = await getUserPosts(userDoc);
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      {user && <UserProfile user={user} />}
      {posts && <PostFeed posts={posts} />}
    </main>
  );
}
