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

const selectedThoughts = new Set();
const selectedAlbums = new Set();
const selectedTools = new Set();

// create some additional logic to check Sets so that user
// doesn't get duplicate item from random array
function getRandom(array: Array<Thought | Album | Tool>) {
  // first check set to see if value exists
  let random = undefined;

  // then get a random element from array excluding value in set
  // add the new value to the set
  // return the randomly select element
  while (!random) {
    random = array[Math.floor(Math.random() * array.length)];

    if (typeof random === "string") {
      if (!selectedThoughts.has(random)) {
        // set doesn't have value, add it to the set
        selectedThoughts.add(random);
        console.log({ selectedThoughts });
        break;
      } else if (selectedThoughts.size === array.length) {
        // value is in set and set is full, reset all set values
        // add it to set
        selectedThoughts.clear();
        selectedThoughts.add(random);
        console.log("reset thoughts", { selectedThoughts });
        break;
      } else {
        // value is in set, keep looking
        random = undefined;
        continue;
      }
    } else if ("artist" in random) {
      if (!selectedAlbums.has(random)) {
        selectedAlbums.add(random);
        console.log({ selectedAlbums });
        break;
      } else if (selectedAlbums.size === array.length) {
        selectedAlbums.clear();
        selectedAlbums.add(random);
        console.log("reset albums", { selectedAlbums });
        break;
      } else {
        random = undefined;
        continue;
      }
    } else {
      if (!selectedTools.has(random)) {
        selectedTools.add(random);
        console.log({ selectedTools });
        break;
      } else if (selectedTools.size === array.length) {
        selectedTools.clear();
        selectedTools.add(random);
        console.log("reset tools", { selectedTools });
        break;
      } else {
        random = undefined;
        continue;
      }
    }
  }

  return random;
}

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

const router = new Router();

/* Interests from _data */
router.get("/api/interests", (ctx: Context) => {
  ctx.response.body = htmxResponse();
});

/* Post Likes */
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
