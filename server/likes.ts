const kv = await Deno.openKv();

export interface Post {
  slug?: string;
  likes?: number;
}

// await kv.set(["posts", "new-site-design-for-2024"], {
//   slug: "new-site-design-for-2024",
//   likes: 5,
// });
// await kv.set(["posts", "my-year-in-reading-2023"], {
//   slug: "my-year-in-reading-2023",
//   likes: 4,
// });
// await kv.set(
//   [
//     "posts",
//     "building-myself-a-reading-tracker-app-with-airtable-and-deno-fresh-part-3",
//   ],
//   {
//     slug: "building-myself-a-reading-tracker-app-with-airtable-and-deno-fresh-part-3",
//     likes: 2,
//   }
// );
// await kv.set(
//   [
//     "posts",
//     "building-myself-a-reading-tracker-app-with-airtable-and-deno-fresh-part-1",
//   ],
//   {
//     slug: "building-myself-a-reading-tracker-app-with-airtable-and-deno-fresh-part-1",
//     likes: 2,
//   }
// );
// await kv.set(["posts", "new-site-typeface-brix-sans"], {
//   slug: "new-site-typeface-brix-sans",
//   likes: 17,
// });
// await kv.set(["posts", "mapping-meteorites"], {
//   slug: "mapping-meteorites",
//   likes: 1,
// });
// await kv.set(["posts", "using-airtable-as-a-jamstack-cms"], {
//   slug: "using-airtable-as-a-jamstack-cms",
//   likes: 2,
// });
// await kv.set(
//   ["posts", "how-i-learned-to-stop-worrying-and-love-the-jamstack"],
//   {
//     slug: "how-i-learned-to-stop-worrying-and-love-the-jamstack",
//     likes: 9,
//   }
// );
// await kv.set(["posts", "the-age-of-extremes"], {
//   slug: "the-age-of-extremes",
//   likes: 1,
// });
// await kv.set(
//   [
//     "posts",
//     "the-tricontinental-conference-and-latin-american-liberationist-christianity",
//   ],
//   {
//     slug: "the-tricontinental-conference-and-latin-american-liberationist-christianity",
//     likes: 13,
//   }
// );
// await kv.set(
//   [
//     "posts",
//     "ideology-fetishism-apophaticism-marxist-criticism-and-christianity",
//   ],
//   {
//     slug: "ideology-fetishism-apophaticism-marxist-criticism-and-christianity",
//     likes: 2,
//   }
// );

// const entries = kv.list({ prefix: ["posts"] });
// for await (const entry of entries) {
//   // await kv.delete(entry.key);
//   console.log(entry);
// }
// console.log(await countPostsLikes());

// export async function countPostsLikes() {
//   const entries = kv.list({ prefix: ["posts"] });
//   const counts: Record<string, number> = {};

//   for await (const item of entries) {
//     const postId = item.key[1] as string;
//     const count = item.value as number;

//     if (!counts[postId]) {
//       counts[postId] = 0;
//     }

//     counts[postId] += count;
//   }

//   return counts;
// }

// export const allPostCounts = await countPostsLikes();
// console.log(allPostCounts);

export async function getAllPostLikes(): Promise<Post[]> {
  const entries = kv.list({ prefix: ["posts"] });
  const allPosts = [];

  for await (const entry of entries) {
    allPosts.push(entry.value);
  }

  return allPosts as Post[];
}

export async function getPostLikes(postId: string) {
  const post = await kv.get(["posts", postId]);
  if (post.versionstamp === null) {
    return 0;
  } else {
    const value = post.value as Post;
    return value.likes ? value.likes : 0;
  }
}

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
  // const post = await kv
  //   .atomic()
  //   .check({ key, versionstamp: null })
  //   .set(key, {
  //     slug: postId,
  //     likes: 0,
  //   })
  //   .commit();

  // if (post.ok) {
  //   console.log(
  //     `Post entry for ${postId} did not yet exist - created and set likes to 0.`
  //   );
  // }

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

// console.log(await getPostLikes("my-year-in-reading-2023"));
// console.log(await getPostLikes("my-year-in-reading-2023"));
// console.log(
//   await getPostLikes(
//     "building-myself-a-reading-tracker-app-with-airtable-and-deno-fresh-part-3"
//   )
// );
// console.log(await addPostLike("new-site-design-for-2024"));
// console.log(await removePostLike("new-site-design-for-2024"));
// console.log(await removePostLike("my-year-in-reading-2023"));
// console.log(await getPostLikes("my-year-in-reading-2023"));
// console.log(
//   await addPostLike("my-pc-apostasy-on-converting-to-the-cult-of-macos")
// );
// console.log(
//   await getPostLikes("my-pc-apostasy-on-converting-to-the-cult-of-macos")
// );

// export async function updatePostLike(postId: string, userId: string) {
//   const key = ["posts", postId, userId];
//   const res = await kv
//     .atomic()
//     .check({ key, versionstamp: null })
//     .set(key, 1)
//     .commit();

//   if (res.ok) {
//     console.log(`Like for ${userId} on ${postId} did not yet exist, inserted!`);
//   } else {
//     console.log(
//       `Like for ${userId} on ${postId} already existed, deleting like.`
//     );
//     const res2 = await kv.delete(key);
//   }

//   const allCounts = await countPostsLikes();
//   return allCounts[postId];
// }

// export async function createPostLike(postId: string, userId: string) {
//   const key = ["posts", postId, userId];
//   const res = await kv
//     .atomic()
//     .check({ key, versionstamp: null })
//     .set(key, 1)
//     .commit();

//   if (res.ok) {
//     console.log(`Like for ${userId} on ${postId} did not yet exist, inserted!`);
//   } else {
//     console.log(`Like for ${userId} on ${postId} already existed.`);
//   }
// }

// export async function deletePostLike(postId: string, userId: string) {
//   const key = ["posts", postId, userId];
//   const res = await kv.delete(key);
//   console.log(`Like for ${userId} on ${postId} post deleted!`);
// }
// console.log(entry.key);
// console.log(entry.value);
// console.log(entry.versionstamp);

// export async function setLike(user: number, postId: string) {}

// const kv = await Deno.openKv();

// // const res1 = await kv.set(["likes", "article1"], 1);
// // await globalKv.set(["likes", "/posts/notes/new-site-design-for-2024/"], 4);
// // const entry2 = await globalKv.get([
// //   "likes",
// //   "/posts/notes/new-site-design-for-2024/",
// // ]);
// // console.log("log before function", entry2);
// // const entry1 = await kv.get(["likes", "article1"]);
// // const entry2 = await kv.get(["likes", "article2"]);
// // console.log(entry1);
// // console.log(entry2);

// // let likes = 0;

// export async function dbGetLikes(postId: string) {
//   const key = ["likes", postId];
//   const entry = await kv.get(key);
//   return entry;
// }

// export async function dbWriteLikes(postId: string, likes: number) {
//   const key = ["likes", postId];
//   const entry = await kv.set(key, likes);
//   return entry;
// }

// async function htmxLikes(request: any) {
//   const headers = request.headers;
//   const postId = headers.get("hx-trigger");
//   console.log("post id", postId);

//   const getEntry = await dbGetLikes(postId);
//   console.log(getEntry);
//   let likes = 1;

//   return `<button id="${postId}" hx-put="/api/likes" hx-swap="outerHTML swap:0.2s settle:0.2s" hx-boost="true">${likes} likes</button>`;
// }
// // const returnHtmx = await htmxReponse();
// // export const htmxLikes = returnHtmx;
// export { htmxLikes };
