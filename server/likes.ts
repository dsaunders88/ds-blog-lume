const kv = await Deno.openKv();

export interface Post {
  slug?: string;
  likes?: number;
}

/* Add sample data */
// await kv.set(["posts", "new-site-design-for-2024"], {
//   slug: "new-site-design-for-2024",
//   likes: 5,
// });
// await kv.set(["posts", "my-year-in-reading-2023"], {
//   slug: "my-year-in-reading-2023",
//   likes: 4,
// });

// Return all posts and likes
export async function getAllPostLikes(): Promise<Post[]> {
  const entries = kv.list({ prefix: ["posts"] });
  const allPosts = [];

  for await (const entry of entries) {
    allPosts.push(entry.value);
  }

  return allPosts as Post[];
}

// Return likes for one post
export async function getPostLikes(postId: string) {
  const post = await kv.get(["posts", postId]);
  if (post.versionstamp === null) {
    return 0;
  } else {
    const value = post.value as Post;
    return value.likes ? value.likes : 0;
  }
}

// Create a post entry in the db
async function createPost(postId: string) {
  const key = ["posts", postId];
  const value: Post = {
    slug: postId,
    likes: 0,
  };
  await kv.set(key, value);
}

export async function addPostLike(postId: string) {
  const key = ["posts", postId];
  // First check to see if post entry exists, if not create it and set to 1
  let post = await kv.get(key);
  if (post.versionstamp === null) {
    await createPost(postId);
    post = await kv.get(key);
  }

  const value = post.value as Post;
  if (!value.likes) {
    value.likes = 0;
  }
  value.likes += 1;
  await kv.set(key, {
    ...value,
    likes: value.likes,
  });
  return value.likes;
}

export async function removePostLike(postId: string) {
  const key = ["posts", postId];
  let post = await kv.get(key);
  if (post.versionstamp === null) {
    await createPost(postId);
    post = await kv.get(key);
  }

  const value = post.value as Post;
  if (!value.likes) {
    value.likes = 0;
  }
  value.likes = Math.max(0, value.likes - 1);
  await kv.set(key, {
    ...value,
    likes: value.likes,
  });
  return value.likes;
}
