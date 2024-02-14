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
