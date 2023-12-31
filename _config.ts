import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";
import vento from "lume/plugins/vento.ts";
import attributes from "lume/plugins/attributes.ts";
import base_path from "lume/plugins/base_path.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import lang_javascript from "npm:highlight.js/lib/languages/javascript";
import feed from "lume/plugins/feed.ts";
import filter_pages from "lume/plugins/filter_pages.ts";
import imagick from "lume/plugins/imagick.ts";
import inline from "lume/plugins/inline.ts";
import lightningCss from "lume/plugins/lightningcss.ts";
// import postcss from "lume/plugins/postcss.ts";
// import nano from "npm:cssnano";
import mdx from "lume/plugins/mdx.ts";
// import prism from "lume/plugins/prism.ts";
import minify_html from "lume/plugins/minify_html.ts";
import nav from "lume/plugins/nav.ts";
import metas from "lume/plugins/metas.ts";
import esbuild from "lume/plugins/esbuild.ts";
import sourceMaps from "lume/plugins/source_maps.ts";
// import relative_urls from "lume/plugins/relative_urls.ts";
import sitemap from "lume/plugins/sitemap.ts";
import slugify_urls from "lume/plugins/slugify_urls.ts";
import toc from "https://deno.land/x/lume_markdown_plugins/toc.ts";
import footnotes from "https://deno.land/x/lume_markdown_plugins/footnotes.ts";

import {
  groupTypes,
  sortTypes,
  sortByProperty,
} from "./src/utils/groupTypes.js";
import { readingTime } from "./src/utils/readingTime.js";

const search = { returnPageData: true };

const site = lume(
  {
    src: "./src",
  },
  { search }
);

site.copy("static", ".").copy("_redirects");
site.use(toc()); // Markdown plugin
site.use(footnotes()); // Markdown plugin
site.use(jsx()); // Required for MDX
site.use(vento());
site.use(esbuild());
site.use(attributes());
site.use(base_path());
site.use(
  code_highlight({
    languages: {
      javascript: lang_javascript,
    },
  })
);
site.filter("readableDate", (date) =>
  new Date(date).toLocaleString("en-US", {
    timeZone: "UTC",
    day: "numeric",
    year: "numeric",
    month: "long",
  })
);
site.filter("shortDate", (date) =>
  new Date(date).toLocaleString("en-US", {
    timeZone: "UTC",
    day: "numeric",
    year: "numeric",
    month: "numeric",
  })
);
site.filter("slugifyTag", (tag) =>
  tag.trim().replace(/\s+/g, "-").toLowerCase()
);
site.filter("sortTags", (tags) => tags.sort());
site.filter(
  "getRandomItem",
  (array) => array[Math.floor(Math.random() * array.length)]
);
site.filter(
  "capitalizeFirst",
  (string) => string.charAt(0).toUpperCase() + string.slice(1)
);
site.filter("readingTime", readingTime);
site.filter("groupby", groupTypes);
site.filter("sortby", sortTypes);
site.filter("sortByProperty", sortByProperty);
// site.use(prism({ extensions: [".html", ".vto", ".njk"] }));
site.helper(
  "isActive",
  (href, url) => {
    // console.log(`url: ${url}`, `href: ${href}`);
    const urlParts = url.split("/");
    if (urlParts.includes(href.slice(1))) {
      return "selected";
    }
  },
  { type: "tag" }
);
site.use(feed());
site.use(filter_pages());
site.use(imagick());
site.use(lightningCss());
// site.use(postcss());
site.use(mdx());
site.use(inline());
site.use(minify_html());
site.use(nav());
// site.use(relative_urls());
site.use(sitemap());
site.use(sourceMaps());
site.use(slugify_urls());
// site.hooks.addPostcssPlugin(nano);

export default site;
