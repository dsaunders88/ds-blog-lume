import {
  Application,
  Router,
  Context,
} from "https://deno.land/x/oak@v10.2.0/mod.ts";
import { list as thoughtsList } from "../src/_data/thoughts.js";
import { albums } from "../src/_data/music.js";
import { list as toolsList } from "../src/_data/tools.js";
import { getQuery } from "https://deno.land/x/oak@v10.2.0/helpers.ts";
import {
  addPostLike,
  removePostLike,
  getPostLikes,
  getAllPostLikes,
} from "./likes.ts";
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

type Thought = string;
type Album = {
  artist?: string;
  url?: string;
  playCount?: number;
  name?: string;
};
type Tool = {
  name: string;
  url: string;
};

// some additional logic to check Sets so that user
// doesn't get duplicate item from random array
const selectedThoughts = new Set();
const selectedAlbums = new Set();
const selectedTools = new Set();

// Add values from an array into Set and check for a random
// value in the set
function checkSetForValue(
  set: Set<unknown>,
  value: string | Album | Tool,
  values: Array<Thought | Album | Tool>
): boolean {
  if (!set.has(value)) {
    // set doesn't have the value, add it to set
    set.add(value);
    console.log({ set });
    return true;
  } else if (set.size === values.length) {
    // value is in set and set is full, reset all set values
    // add it to set
    set.clear();
    set.add(value);
    console.log("reset set", { set });
    return true;
  } else {
    // value is in set, keep looking for random
    return false;
  }
}

function getRandom(array: Array<Thought | Album | Tool>) {
  let random = undefined;

  // get a random element from the array
  // check to see if it exists in the set
  // if not in the set, add it and return
  // if is in set, keep looking for random
  while (!random) {
    random = array[Math.floor(Math.random() * array.length)];

    if (typeof random === "string") {
      // narrow type to Thought
      const isInSet = checkSetForValue(selectedThoughts, random, array);
      if (!isInSet) {
        // value is in set, keep looking for random
        random = undefined;
        continue;
      }
    } else if ("artist" in random) {
      // narrow type to Album
      const isInSet = checkSetForValue(selectedAlbums, random, array);
      if (!isInSet) {
        random = undefined;
        continue;
      }
    } else {
      // narrow type to Tool
      const isInSet = checkSetForValue(selectedTools, random, array);
      if (!isInSet) {
        random = undefined;
        continue;
      }
    }
  }
  return random;
}

/* Interests html response */
function htmxResponse() {
  const randomThought = getRandom(thoughtsList as Array<Thought>);
  const randomAlbum = getRandom(albums as Array<Album>);
  const randomTool = getRandom(toolsList as Array<Tool>);
  return `<p id="thoughts" class="animate-response">${
    randomThought as string
  }</p><p id="albums" hx-swap-oob="true" class="animate-response"><span class="cluster"><a class="external-link" href="${
    (randomAlbum as Album).url
  }" target="_blank">${
    (randomAlbum as Album).name
  }</a><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 15.25V6.75H8.75"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 7L6.75 17.25"></path></svg></span>, by ${
    (randomAlbum as Album).artist
  }</p><p id="tools" hx-swap-oob="true" class="animate-response"><span class="cluster"><a class="external-link" href="${
    (randomTool as Tool).url
  }" target="_blank">${
    (randomTool as Tool).name
  }</a><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 15.25V6.75H8.75"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 7L6.75 17.25"></path></svg></span></p>`;
}

/* Initialize router */
const router = new Router();

/* Interests from _data */
router.get("/api/interests", (ctx: Context) => {
  ctx.response.body = htmxResponse();
});

/* Post Likes API */
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

  const postLikes = await getPostLikes(postId);

  ctx.response.body = `${postLikes}`;
});

router.put("/posts/:category/:postId/like", async (ctx: Context) => {
  const { category, postId } = getQuery(ctx, { mergeParams: true });

  const postLikes = await addPostLike(postId);

  // console.log("Hit like endpoint, returning", postLikes);

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

  // console.log("Hit unlike endpoint, returning", postLikes);

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

/* Bookmark Links */
router.get("/links/show", async (ctx: Context) => {
  const params = getQuery(ctx);
  console.log(params);

  const html = await render(params);
  ctx.response.body = html;
});

/* Redirects */
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

// After creating the router, we can add it to the app.
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
console.log("Listening at port:8000 ");
