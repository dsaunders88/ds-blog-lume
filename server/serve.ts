import { Application, Router } from "https://deno.land/x/oak@v10.2.0/mod.ts";
import { list as thoughtsList } from "../src/_data/thoughts.js";
// import { albums } from "../src/_data/music.js";
import { list as toolsList } from "../src/_data/tools.js";

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
    next();
  }
});

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function htmxResponse() {
  const randomThought = getRandom(thoughtsList);
  // const randomAlbum = getRandom(albums);
  const randomTool = getRandom(toolsList);
  return `<p id="thoughts" class="animate-response">${randomThought}</p><p id="albums" hx-swap-oob="true" class="animate-response"><span class="cluster"><a class="external-link" href="${randomAlbum.url}" target="_blank">${randomAlbum.name}</a><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 15.25V6.75H8.75"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 7L6.75 17.25"></path></svg></span>, by ${randomAlbum.artist}</p><p id="tools" hx-swap-oob="true" class="animate-response"><span class="cluster"><a class="external-link" href="${randomTool.url}" target="_blank">${randomTool.name}</a><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 15.25V6.75H8.75"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 7L6.75 17.25"></path></svg></span></p>`;
}

const router = new Router();

// api endpoints from _data
router.get("/api/interests", (ctx) => {
  ctx.response.body = htmxResponse();
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
