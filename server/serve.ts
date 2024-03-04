import {
  Application,
  Router,
  Context,
} from "https://deno.land/x/oak@v10.2.0/mod.ts";
import { list as thoughtsList } from "../src/_data/thoughts.js";
import { albums } from "../src/_data/music.js";
import { list as toolsList } from "../src/_data/tools.js";
// import { htmxLikes } from "./likes.ts";
import { getQuery } from "https://deno.land/x/oak@v10.2.0/helpers.ts";
import {
  // allPostCounts,
  // countPostsLikes,
  // createPostLike,
  // deletePostLike,
  // updatePostLike,
  addPostLike,
  removePostLike,
  getPostLikes,
  getAllPostLikes,
} from "./likes.ts";
import type { Post } from "./likes.ts";
import { render } from "./bookmarks.ts";

const app = new Application();

// First we try to serve static files from the _site folder. If that fails, we
// fall through to the router below.
app.use(async (ctx, next) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/_site`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function htmxResponse() {
  const randomThought = getRandom(thoughtsList);
  const randomAlbum = getRandom(albums);
  const randomTool = getRandom(toolsList);
  return `<p id="thoughts" class="animate-response">${randomThought}</p><p id="albums" hx-swap-oob="true" class="animate-response"><span class="cluster"><a class="external-link" href="${randomAlbum.url}" target="_blank">${randomAlbum.name}</a><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 15.25V6.75H8.75"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 7L6.75 17.25"></path></svg></span>, by ${randomAlbum.artist}</p><p id="tools" hx-swap-oob="true" class="animate-response"><span class="cluster"><a class="external-link" href="${randomTool.url}" target="_blank">${randomTool.name}</a><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 15.25V6.75H8.75"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 7L6.75 17.25"></path></svg></span></p>`;
}

const router = new Router();

// api endpoints from _data
router.get("/api/interests", (ctx: Context) => {
  ctx.response.body = htmxResponse();
});

// router.put("/posts/:category/:postId/likes", (ctx) => {
//   // console.log(ctx);
//   // const res = htmxLikes(ctx.request);

// });
// router.get("/posts/:category/:postId/likes", async (ctx: Context) => {
//   const { postId } = getQuery(ctx, { mergeParams: true });
//   // const data = await getLikes(postId);
//   ctx.response.body = await getLikes(postId);
// });

// router.post("/posts/:category/:postId/likes", async (ctx: Context) => {
//   const { postId } = getQuery(ctx, { mergeParams: true });
//   // const data = await getLikes(postId);
//   // console.log(ctx.request.headers);
//   await createLike(postId, ctx.request.headers);
//   const likes = await getLikes(postId);
//   ctx.response.body = `<button id="${ctx.request.headers.get(
//     "hx-trigger"
//   )}" hx-post="${ctx.request.headers.get(
//     "hx-trigger"
//   )}likes" hx-swap="outerHTML swap:0.2s settle:0.2s" hx-boost="true">${likes} Likes</button>`;
// });

// let count = 0;
// router.post("/posts/:category/:postId/likes", async (ctx: Context) => {
//   // console.log("req context", ctx);
//   const { category, postId } = getQuery(ctx, { mergeParams: true });

//   let userId = "user_2";
//   const newLike = await createPostLike(postId, userId);
//   const allLikes = await countPostsLikes();
//   let postLikes = allLikes[postId];

//   ctx.response.body = `
//     <button aria-label="Like" hx-delete="/posts/${category}/${postId}/likes" hx-swap="outerHTML">
//       <svg width="24" height="24" fill="red" viewBox="0 0 24 24">
//         <path
//           fill-rule="evenodd"
//           stroke="red"
//           stroke-linecap="round"
//           stroke-linejoin="round"
//           stroke-width="1.5"
//           d="M11.995 7.23319C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972C4.49599 8.14609 4.2403 10.6312 5.66654 12.3892L11.995 18.25L18.3235 12.3892C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972C15.8305 5.18899 13.4446 5.60999 11.995 7.23319Z"
//           clip-rule="evenodd"
//         ></path>
//       </svg>
//       <span>${postLikes}</span>
//     </button>
//   `;
// });

// router.put("/posts/:category/:postId/likes", async (ctx: Context) => {
//   const { category, postId } = getQuery(ctx, { mergeParams: true });

//   let userId = "user_4";
//   const newPostCount = await updatePostLike(postId, userId);

//   ctx.response.body = `${newPostCount ? newPostCount : 0}`;
// });

// router.delete("/posts/:category/:postId/likes", async (ctx: Context) => {
//   // console.log("req context", ctx);
//   const { category, postId } = getQuery(ctx, { mergeParams: true });

//   let userId = "user_3";
//   const deleteLike = await deletePostLike(postId, userId);
//   const allLikes = await countPostsLikes();
//   let postLikes = allLikes[postId];

//   ctx.response.body = `
//     <button aria-label="Like" hx-post="/posts/${category}/${postId}/likes" hx-swap="outerHTML">
//       <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
//         <path
//           fill-rule="evenodd"
//           stroke="currentColor"
//           stroke-linecap="round"
//           stroke-linejoin="round"
//           stroke-width="1.5"
//           d="M11.995 7.23319C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972C4.49599 8.14609 4.2403 10.6312 5.66654 12.3892L11.995 18.25L18.3235 12.3892C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972C15.8305 5.18899 13.4446 5.60999 11.995 7.23319Z"
//           clip-rule="evenodd"
//         ></path>
//       </svg>
//       <span>${postLikes}</span>
//     </button>
//   `;
// });

router.get("/posts/totalLikes", async (ctx: Context) => {
  const params = getQuery(ctx, { mergeParams: true });
  console.log(params);
  const postLikes = await getAllPostLikes();
  const sortedLikes = postLikes.sort((a, b) => {
    if (params.sort_by === "slug" && params.order_by === "asc") {
      if (a.slug! < b.slug!) {
        return -1;
      }
      if (a.slug! > b.slug!) {
        return 1;
      }
      return 0;
    } else if (params.sort_by === "slug" && params.order_by === "desc") {
      if (b.slug! < a.slug!) {
        return -1;
      }
      if (b.slug! > a.slug!) {
        return 1;
      }
      return 0;
    } else if (params.sort_by === "likes" && params.order_by === "asc") {
      return a.likes! - b.likes!;
    } else {
      return b.likes! - a.likes!;
    }
  });

  ctx.response.body = JSON.stringify({ posts: postLikes });
});

router.get("/posts/:category/:postId/totalLikes", async (ctx: Context) => {
  const { category, postId } = getQuery(ctx, { mergeParams: true });
  // console.log("post id", postId);
  // console.log(allPostCounts);
  const postLikes = await getPostLikes(postId);
  // console.log(postLikes);

  // const likes = allPosts[postId];
  ctx.response.body = `${postLikes}`;
});

router.put("/posts/:category/:postId/like", async (ctx: Context) => {
  const { category, postId } = getQuery(ctx, { mergeParams: true });

  const postLikes = await addPostLike(postId);

  // console.log("Hit like endpoint, returning ", postLikes);

  ctx.response.body = `
    <button
    id="likePost"
    class="post-like-button active"
    aria-label="Unlike"
    hx-put="/posts/${category}/${postId}/unlike"
    hx-trigger="click throttle:250ms"
    hx-swap="outerHTML settle:400ms"
  >
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path
      fill-rule="evenodd"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      d="M11.995 7.23319C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972C4.49599 8.14609 4.2403 10.6312 5.66654 12.3892L11.995 18.25L18.3235 12.3892C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972C15.8305 5.18899 13.4446 5.60999 11.995 7.23319Z"
      clip-rule="evenodd"
    ></path>
  </svg>
  <span id="count">${postLikes}</span>
  </button>
  `;
});

router.put("/posts/:category/:postId/unlike", async (ctx: Context) => {
  const { category, postId } = getQuery(ctx, { mergeParams: true });

  const postLikes = await removePostLike(postId);

  // console.log("Hit unlike endpoint, returning ", postLikes);

  ctx.response.body = `
  <button
    id="likePost"
    class="post-like-button"
    aria-label="Like"
    hx-put="/posts/${category}/${postId}/like"
    hx-trigger="click throttle:250ms"
    hx-swap="outerHTML settle:400ms"
  >
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path
      fill-rule="evenodd"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      d="M11.995 7.23319C10.5455 5.60999 8.12832 5.17335 6.31215 6.65972C4.49599 8.14609 4.2403 10.6312 5.66654 12.3892L11.995 18.25L18.3235 12.3892C19.7498 10.6312 19.5253 8.13046 17.6779 6.65972C15.8305 5.18899 13.4446 5.60999 11.995 7.23319Z"
      clip-rule="evenodd"
    ></path>
  </svg>
  <span id="count">${postLikes}</span>
  </button>
`;
});

router.get("/links/show", async (ctx: Context) => {
  // const body = ctx.request.body();
  // if (body.type === "form") {
  //   const value = body.value;
  //   const formData = await value;

  //   for (const [key, value] of formData.entries()) {
  //     console.log(`${key}: ${value}`);
  //   }
  // }
  const params = getQuery(ctx);
  console.log(params);

  const html = await render(params);
  ctx.response.body = html;
});

router.redirect("/now", "/about");
router.redirect("/writing", "/posts");
router.redirect("/posts/1", "/posts");
router.redirect(
  "/2021/07/20/tricontinental-conference-and-liberationist-christianity",
  "/posts/essays/the-tricontinental-conference-and-latin-american-liberationist-christianity"
);
router.redirect(
  "/2021/09/17/the-age-of-extremes",
  "/posts/notes/the-age-of-extremes"
);
router.redirect(
  "/2021/04/16/ideology-fetishism-apophaticism-marxist-criticism-and-christianity",
  "/posts/essays/ideology-fetishism-apophaticism-marxist-criticism-and-christianity"
);
router.redirect("/tag/capitalism", "/tag/theory");
router.redirect("/tag/socialism", "/tag/theory");
router.redirect("/tag/2015", "/posts/archive");
router.redirect("/tag/2016", "/posts/archive");
router.redirect("/tag/2017", "/posts/archive");
router.redirect("/tag/2018", "/posts/archive");
router.redirect("/tag/2019", "/posts/archive");
router.redirect("/tag/2020", "/posts/archive");
router.redirect("/tag/2021", "/posts/archive");
router.redirect("/tag/2022", "/posts/archive");
router.redirect("/tag/2023", "/posts/archive");
// router.get("/api/thoughts", (ctx) => {
//   ctx.response.body = thoughtResponse(thoughtsList);
// });
// router.get("/api/music", (ctx) => {
//   ctx.response.body = JSON.stringify(albums);
// });
// router.get("/api/tools", (ctx) => {
//   ctx.response.body = JSON.stringify(toolsList);
// });

// After creating the router, we can add it to the app.
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
console.log("Listening at port:8000 ");
