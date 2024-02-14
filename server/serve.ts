import {
  Application,
  Router,
  Context,
} from "https://deno.land/x/oak@v10.2.0/mod.ts";
import { list as thoughtsList } from "../src/_data/thoughts.js";
import { albums } from "../src/_data/music.js";
import { list as toolsList } from "../src/_data/tools.js";
// import { htmxLikes } from "./likes.ts";
import { resolve } from "https://deno.land/std@0.212.0/path/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v10.2.0/helpers.ts";
// import { dbGetLikes, dbWriteLikes } from "./likes.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const app = new Application();
// const kv = await Deno.openKv();
// const supabase = createClient(
//   "https://dktuivrfnfjipbenfodp.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdHVpdnJmbmZqaXBiZW5mb2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1NDcyMTUsImV4cCI6MjAyMjEyMzIxNX0.sj-zrNHdvhqj-MhKdlglFu9cBYvWq80-4ff3SCSVC2M"
// );

// await kv.set(["likes", "notes", "new-site-design-for-2024"], 4);
// const entry2 = await kv.get(["likes", "notes", "new-site-design-for-2024"]);
// console.log("test before", entry2);

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

// async function getLikes(postId: string) {
//   // const supabaseRoute = `https://dktuivrfnfjipbenfodp.supabase.co/rest/v1/posts_with_total_likes?url=eq.${postId}&select=*&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdHVpdnJmbmZqaXBiZW5mb2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1NDcyMTUsImV4cCI6MjAyMjEyMzIxNX0.sj-zrNHdvhqj-MhKdlglFu9cBYvWq80-4ff3SCSVC2M`;
//   // const res = await fetch(supabaseRoute);
//   // const data = await res.json();
//   // console.log(data);
//   // const likes = data[0];
//   const { data, error } = await supabase
//     .from("posts_with_total_likes")
//     .select()
//     .eq("url", postId);
//   console.log(data);

//   return `${data[0].total_likes}`;
// }

// async function createLike(postUrl: string, reqInfo: Headers) {
//   const { data: post, error: postError } = await supabase
//     .from("posts")
//     .select("id")
//     .eq("url", postUrl)
//     .single();

//   const postId = post.id;

//   const { data, error } = await supabase
//     .from("post_likes")
//     .insert([{ post_id: postId, user_info: reqInfo.get("sec-ch-ua") }]);

//   return null;
// }

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
