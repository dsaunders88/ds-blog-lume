import { Application, Router } from "https://deno.land/x/oak@v10.2.0/mod.ts";

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

const router = new Router();

// api endpoints from _data
router.redirect("/now", "/about");
router.redirect("/writing", "/posts");
router.redirect("/posts/1", "/posts");
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
