---
title: New Site Design for 2024
image:
  src: ds-site-2024
  alt: "Home screen of my new site design, a dark theme with an blue accent. The main heading says 'Designer, reader, and writer' and the main focus is a box that shows various current interests."
summary: To ring in the new year, I'm excited to share a new version of this site with a fresh design, built with Deno Lume.
archiveYear: 2024
tags:
  - design
  - web development
metas:
  image: /img/posts/ds-site-2024-large.webp
---

To ring in the new year, I'm excited to share a new version of this site (something like the 5th version in as many years, but who's counting) that I've been working on for what feels like way too long.

![A post by me on Mastodon from September 2023, saying 'it me, I'm redesigning my site instead of writing the next blog post.'](/img/posts/mastodon-site-post-regular.webp)

But, here it is, and I'm quite happy with where things are at and where things are headed as I continue to think up fun additions. Let me give you a quick tour of everything, and if you'd like, [let me know](mailto:daniel.thomas.saunders@gmail.com) what you think of it! Those interested can also check out the [source code on GitHub](https://github.com/dsaunders88/ds-blog-lume).

## The Design

The design coalesces a bunch of different themes that I have been exploring over the last few years in both my graphic and web design work, and definitely feels like an authentic expression of "my style" at the moment: a primary focus on considered, timeless, and legible typography, in this case anchored by the inimitable [Brix Sans](/posts/notes/new-site-typeface-brix-sans) and spiced up with [Fjalla One](https://fonts.google.com/specimen/Fjalla+One); a color scheme rooted in historical graphic design expressions; layouts reminiscent of book side margins, rules, and indexes; an overall sense of sophistication-meets-approachability, something that doesn't take itself quite so seriously and that, most importantly, doesn't get in the way of the content.

Although I have always striven to realize many of these elements in my designs, the thing that made the biggest difference with this iteration of the site is that I spent a lot of time intentionally experimenting with and planning out design ideas before building anything. It's something that is obviously baked into the process when I'm working with a client, but when it comes to my own work, I tend to overlook this phase, which makes no sense! All design is intention and planning, and busting out Figma to prototype a handful of ideas before going to code is for me always a great way to visually solidify what I am envisioning.

I also want to shout out some of the inspirations for this site. There are a lot of cool people out there making some very cool personal sites. Go check them out!

- [Robin Rendle](https://robinrendle.com/) — A prolific writer and "designer's designer"; I especially love Robin's idea of the conscientious designer/developer as being an independent _publisher_ for the web.
- [Dave Smyth](https://davesmyth.com/) — I love Dave's minimalism and focus on typography, and how both of these serve to foreground the meaning of the message being conveyed.
- [Ryan Mulligan](https://ryanmulligan.dev/) — Ryan's CSS mastery is a source of boundless fascination and desire to do other cool things with what might be the coolest language for the web at the moment.

## The Site

I used [Lume](https://lume.land/) to build this site, a static site generator (SSG) for Deno. Although it's a relatively small project at the moment (one which I'm happily contributing to), I loved working with it because of the native Deno environment and all of the features Lume comes with. Lume's creator [Óscar Otero](https://oscarotero.com/) has done a fantastic job building on other SSGs and designing an ergonomic, robust piece of software that feels very intuitive to use. 🔥

The last version of my site was built with [11ty](https://www.11ty.dev/), which is also a fantastic SSG, and there were definitely some tradeoffs involved in making the switch (one thing I'm ambivalent about at the moment is having to use Deno Deploy to host the site). But I enjoyed working with Lume for a handful of reasons:

- No npm or `node-modules` folders, just clean, built-in solutions and plugins.
- Speaking of plugins, there are some [great options](https://lume.land/plugins/?status=all) for Lume that are really painless to use. From building RSS feeds and navigation trees to minifying HTML and transforming images, Lume has everything I needed right at hand without reaching for another package or library.
- Óscar has also created a templating language called [Vento](https://vento.js.org/) that is a lot like Nunjucks or Liquid, but in my opinion is far easier to comprehend and use (well done, Óscar!). I love that in Vento you can do everything you'd ever want to with a templating language but also dip into JavaScript at any time by doing something like this: `{{> console.log("Lume is great!") }}`.
- Lume's built-in `search` function is also kind of a game-changer in the static site world. This function basically lets you query data of any format in your project to create filterable, sortable collections on the fly. Paired with Vento, you can do some pretty powerful things with it, as for instance in the below example where I'm using a JavaScript function to group an array of objects by a shared property value, then piping a search query for all my posts through it with the `|>` operator. The result is a grouped and sorted list of posts archived by year, as you can [see on this page](/posts/archive).

<figure>
<figcaption class="code-caption">src/_includes/layouts/archive.vto</figcaption>

```django
{{ set archivedPosts = search.pages("type=posts", "date=desc") |> groupby("archiveYear") }}
  <div class="archive">
    {{ for year of archivedPosts }}
      <details>
        <summary>{{ year.type }} Posts</summary>
        <div>...</div>
      </details>
    {{ /for }}
  </div>
```

</figure>

## Overall Improvements

A new design was also a chance to make a bunch of improvements to the site's organization, content, and overall code. Some of this was just a result of experience and wanting to do things in more efficient and sensible ways, and some was wanting to pare down and clean up some detritus that had accumulated over time.

- **Posts.** I went through every Markdown file for every post and page, cleaning up a bunch of extraneous material and standardizing frontmatter (why did I once decide to use `<a>` tags for links instead of using Markdown's link syntax??). It was a huge pain, but it feels good to have everything unified.
- **Categories.** I also simplified post categories and added a year by year archive.
- **Styling.** The last version of my site was designed a few years ago and thus was part of the Tailwind CSS craze. Back then I wanted to try it to see what all the hype was about, and it was mostly fine. But at some point in the last year that whole world became really tiresome to me, and I started to see how much of an annoyance it is to maintain Tailwind code. Not to mention that _you don't get to write CSS_, which is having a genuine renaissance right now. So early on in this redesign/rebuild, I decided to ditch Tailwind, and boy was that a huge dam released on my creative process. Paired with [LightningCSS](https://lightningcss.dev/) as an optimizer, this site's CSS feels really powerful.
- **Projects.** Like anyone in my position, I had been maintaining a few different sites for my portfolio, writing, etc. That wasn't ideal, and for this site I knew I wanted to combine those aspects and incorporate some of my freelance work here. The [projects page](/projects) has a list of selected recent projects that I'm particularly proud of.

## Highlights and Fun Stuff

My website has always been a place for me to try out new things and play around with whatever is interesting at the moment, and this iteration of the site is chock-full of my random little experimentations:

### CSS

As mentioned above, the CSS for the site is living on the cutting-edge, and it's been super fun to write. We've got [nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting), the [`:has()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:has) selector, [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries), and custom properties out the wazoo; using LightningCSS also lets me use colors in the [`lch` space](https://accessiblepalette.com/).

One of the major styling features is not only a light/dark/system theme toggler, but an accent color toggler that enables you to cycle through a total of 10 different color schemes. The theme toggles use the native `details` HTML element, which means no JavaScript needed. I love how this turned out!

<div id="color-schemes" class="responsive-grid">
    <div class="small-title flow" style="--circle-color: var(--color-red-500);">Printer's Red</div>
    <div class="small-title flow" style="--circle-color: var(--color-blue-500);">Dodger Blue</div>
    <div class="small-title flow" style="--circle-color: var(--color-green-500);">Malachite Green</div>
    <div class="small-title flow" style="--circle-color: var(--color-purple-500);">Mallow Purple</div>
    <div class="small-title flow" style="--circle-color: var(--color-gold-500);">Dune Gold</div>
</div>

There are a handful of fun little CSS moments and animations throughout the site, so keep a lookout for some of those!

### Books

![Section of my new site showing book covers from my latest reading activity.](/img/posts/ds-site-books-regular.webp)

I have incorporated elements of my [Airtable reading tracker](/posts/notes/building-myself-a-reading-tracker-app-with-airtable-and-deno-fresh-part-3) into the site—on the home page, I'm fetching some of my latest reading activity records to show a glance at my bookshelf. These entries pull data from Airtable, and, as a bonus, link to the associated books in the [counterpart website](https://long-wasp-15.deno.dev/), which I'm continuing to build out.

A fun part of this was writing a function to download the images from Airtable after the fetch response and write them to the project directory, since Airtable's media links expire after a few hours. This way, I could save them locally, run them through the Lume image transforms, and finally display them in templates.

### HTMX

[HTMX](https://htmx.org/) is getting a lot of buzz at the moment, and it has been interesting to learn more about the philosophical underpinning of a client-server interaction model that is in many ways fundamentally at odds with the React-driven world we've lived in for last decade.

You can see my small implementation of this in the "current interests" block on [the home page](/). This block has a button that sends a `GET` request to a Deno server running in the background; rather than returning `JSON` data, the server responds with HTML that live replaces the targeted HTML on the page, complete with a nifty animation and no page reload. This is HTMX in a nutshell, and it's really kind of mind-blowing when you see how easy it is.

After compiling the data for the different categories (thoughts and tools come from manually edited `.yaml` files, and music comes from making a fetch request to my scrobbles from the Last.fm API), I run a simple randomizing function to get a new item on each click of the "Refresh" button. Then each of the items is inserted in an HTML template that gets sent down to the page via HTMX.

<figure>
<figcaption class="code-caption">server/serve.js</figcaption>

```js
import { Application, Router } from "https://deno.land/x/oak@v10.2.0/mod.ts";
import { list as thoughtsList } from "../src/_data/thoughts.js";
import { albums } from "../src/_data/music.js";
import { list as toolsList } from "../src/_data/tools.js";
import getRandomItem from "../src/utils/getRandom.js";

// Use Deno Oak to start a new application server
const app = new Application();

function htmxResponse() {
  const randomThought = getRandomItem(thoughtsList);
  const randomAlbum = getRandomItem(albums);
  const randomTool = getRandomItem(toolsList);

  // Some HTML elements below edited out for brevity
  return (
    `<p id="thoughts" class="animate-reponse">${randomThought}</p>` +
    `<p id="albums" hx-swap-oob="true" class="animate-response">${randomAblum.name}</p>` +
    `<p id="tools" hx-swap-oob="true" class="animate-response">${randomTool.name}</p>`
  );
}

// Initialize an app router with Deno Oak
const router = new Router();

// This is the endpoint that HTMX hits when a user clicks the "Refresh" button
router.get("/api/interests", (ctx) => {
  ctx.response.body = htmxResponse();
});
```

The great part about this is that the Vento templates can use the same data sources to build for the initial state of the static site. A button then uses `hx-get` to send a request to the endpoint defined above. Using `hx-swap="outerHTML"` in conjunction with the response items having an attribute of `hx-swap-oob="true"` means the targeting/replacement can happen "out-of-band", i.e., at different parts of the DOM tree.

</figure>

<figure>
<figcaption class="code-caption">src/_includes/partials/interests.vto</figcaption>

```django
<button
  id="generateInterests"
  hx-get="/api/interests"
  hx-swap="outerHTML swap:0.2s settle:0.2s"
  hx-target="#thoughts"
><span>Refresh</span>
<svg>...</svg>
</button>

<!-- More stuff here -->

<p class="bold">Thinking about</p>
{{ set randomThought = thoughts.list |> getRandomItem }}
<p id="thoughts" class="animate-response">{{ randomThought }}</p>
```

</figure>

I'm excited to play around with this further to see how else I can extend the interactivity of this site.

Hav a look around the rest of the site!
