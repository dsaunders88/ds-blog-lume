---
title: Building Myself a Reading Tracker App with Airtable and Deno Fresh, Part 3
image:
  src: reading-tracker-post-3
  alt: Reading tracker app with Airtable and Deno Fresh, showing the Airtable and Deno logos.
summary: The final installment in this post series looks at building a dynamic front-end website for an Airtable reading tracker, using the Deno Fresh server-side rendering framework.
archiveYear: 2023
tags:
  - design
  - reading
  - web development
---

In [my last post](/posts/notes/building-myself-a-reading-tracker-app-with-airtable-and-deno-fresh-part-2), I looked at how to use Airtable to build out a back-end database for a reading tracker app. That works perfectly on its own to manage my reading data, but let's face it—I want to be able to show off this data, too. This is where Deno Fresh comes in as a framework to render my reading data in a dynamic website.

## Site Features

Before I jump into the background and details of the implementation, here is an overview of the site features and functionality:

- A main **activity feed** with the latest reading activity entries showing top-level information about a book, filterable by status and sortable by date
- A **shelf index** featuring all books within a shelf and the total book count per shelf
- A list of all **reviews** attached to books/reading activity
- Individual **detail pages** for every book, including in-depth information like publication info, shelves, reading activity, and reviews
- The whole site is designed to make it intuitive to jump between activity entries, shelves, book details, and reviews, while keeping the books themselves at the center of focus
- The best part is that new, uncached data from Airtable is fetched on every request, so any updates I make on the back-end will be immediately viewable on the front-end 💯

**Check out the [working model of the site here](https://deep-pheasant-69.deno.dev/)!** (Caveat: this is a work-in-progress and may be buggy, and, because I'm lazy, is not currently optimized for small screen sizes. But I hope it's interesting to peruse!)

<figure>
    <img src="../../../img/posts/reading-app-shelves-regular.webp" alt="A view of the reading tracker shelves page, showing the Fiction shelf with titles like '2312', 'At the Mountains of Madness', and 'Blue Mars', and the German Literature shelf, showing titles like 'Atheism in Christinaity', 'Doctor Faustus', and 'On Marx'." width="600" loading="lazy" decoding="async" />
</figure>

## Design

For the design of the site, I took a lot of inspiration from other tracker sites like [literal.club](https://literal.club/), as well as publisher sites like [Verso](https://www.versobooks.com/products/2783-revolution) and [Princeton University Press](https://press.princeton.edu/books). I wanted a minimalist feel with a focus on typography, and I think I achieved this pretty well with the fantastic serif typeface [Garalda](https://www.type-together.com/garalda-font) for the headings and one of the absolute best typefaces for user interfaces, [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans), for everything else. These two typefaces strike a very neat balance between "literariness" and practical readability/typographic versatility, and I think they work pretty well together.

I also wanted to showcase the sumptuousness of the book covers themselves, particularly on the shelf sliders (pulling a bit of inspiration from media streaming services) and book detail pages. These detail pages show a lot of information, and I'm still playing around with how best to represent all of that, but I like where things are for the moment.

Still to come: I'm not totally wild about the reviews page feed, so I'd like to come up with a better way to display that. And I'm working on an interesting way to show data from the [Reading Paths table](/posts/notes/building-myself-a-reading-tracker-app-with-airtable-and-deno-fresh-part-2/#base-and-table-setup).

## Why Deno Fresh?

One of the reasons I love personal projects like this is that they give me an opportunity to experiment with new tools and technologies that I'm curious about. Even though I often go overboard on this (like trying four new things at once 😅), it's a fun way to learn more about coding and the web as a whole.

For this stage of the custom reading tracker, I knew I wanted to delve into a framework that focused on [server-side rendering](https://www.sanity.io/glossary/server-side-rendering) (SSR), which, in the JavaScript world, is having a [bit of a moment right now](https://youtu.be/kUs-fH1k-aM?si=-64o9ihIn0fdNuXc). In contrast to other modern techniques and tools (i.e., React/Vue/single-page applications, static site generators, etc.), SSR frameworks dynamically serve content at the time of user request, ideally improving user experience by optimizing performance and reducing the JavaScript needed on any given page (which in the best case scenario is zero).

Ironically, this model is much closer to older server-first tools (such as Laravel for PHP or Django for Python) than to what the JavaScript world has become in the era of React, in that it moves content rendering back to the server. This is good, as it better leverages the [Web Platform itself](https://blog.developer.adobe.com/the-web-platform-is-back-fa5752fabdfc). And it also makes a lot of sense for something like a reading tracker, where hundreds of page views might need to be rendered, one for each book: dynamically generating pages on the fly can be much faster and more performant than either fetching everything from the browser (the single-page app model) or pre-building those pages beforehand (the static site model, even if you are using something as fast as Eleventy). And, as a further bonus over some of the older tools, you get access to newer technologies like global edge networks, which can speed up content delivery even more.

So, knowing that I wanted to use an SSR framework, I had to pick one of many currently getting hyped out there (which is par for the course in the JavaScript world)—I considered Remix, SvelteKit, Astro SSR, and Next v.13 before settling on [Deno Fresh](https://fresh.deno.dev/). Fresh was compelling in large part because of my interest in Deno itself. Deno is a [JavaScript runtime](https://deno.com/), like Node.js (and created by the same author, Ryan Dahl), but it differs from Node in its "browser-like programming environment." For example, in Deno you can use the standard `fetch` API and HTTP requests in server-side code, just as you would in a browser.

What I like about Deno is that I don't have to think about a lot of the messy configuration or abstraction that distracts from the actual project: no build/compilation step, no package manager (goodbye npm!), no thinking too hard about what is being done on the server and what the view of a web page will be, a robust standard library that utilizes native web APIs. In other words, it is built to accommodate the Web Platform, and is thus inherently suited to the SSR model, and to easier experimentation if you are already familiar with the underlying core concepts of the web (and if you're not, it will help you learn them!).

Fresh is Deno's entry in the SSR framework sphere, and I like it because it extends all of these aspects of Deno, while adding many framework conveniences, like:

- TypeScript support (which is natively supported in Deno and which I forced myself to try for the first time for this project—it was a mixed bag the first time out, but I can definitely see the benefit for a project with complex data like this; and again, because there is no compilation step, you can just start using it)
- ["Islands" architecture](https://fresh.deno.dev/docs/concepts/islands) for adding efficient interactive components, similar to the Astro framework model
- Route handlers and asset caching to efficiently handle fetching data on pages

However, there are a few things in Fresh I'm not wild about:

- Fresh's use of Preact under the hood means you have to write JSX for everything, which is not my favorite
- The trade-off of having no build step means a trickier process of efficiently organizing front-end resources like styles and third-party scripts; but the platform's default support of a "Tailwind-in-JS" further abstraction of Tailwind (not kidding) for styling is annoying. I'd love to see a default set up with something like [Lightning CSS](https://lightningcss.dev/docs.html)

But all in all, I've found that Fresh actually makes more complex/full-stack development more accessible by removing many of the tooling roadblocks and abstractions presented by something like React/Next, and by adhering closer to how the web works in general. It feels like a glimpse of where front-end web development might be headed!

## Case Study: Reading Activity Feed & the URL API

As a case study in how Fresh works and utilizes native web APIs to create a dynamic user experience, I'll walk through a little bit of the code for the home page of my reading tracker. For this page, I wanted the main focus to be a feed of my latest reading activity that was filterable by reading status and sortable by date. Using a combination of Fresh's [route handlers](https://fresh.deno.dev/docs/concepts/routes), the `fetch` API, and the `URL` API, it's possible to make this happen in a way that ditches client-side JavaScript for the much smarter pattern of [leveraging the URL itself to "manage state."](https://youtu.be/ukpgxEemXsk?si=p1E3nZ7wwRTUPUiW)

When looking at a URL for say, a video streaming site, you may have noticed some odd-looking text appended to the end of something like a category page, like this: "?category=series&genre=80s-action". These "search parameters" can actually store all sorts of useful data on a URL (as well as "track" their mutation in browser history), and can be manipulated and parsed by the `URLSearchParams` [web interface](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams). In Fresh, you have access to this interface _on the server_ 🤯.

Another _huge_ benefit of URL search parameters is the inherent shareability they offer. Whatever page view you might be looking at with the parameters "?category=series&genre=80s-action" (hopefully some bad-ass Kurt Russell movies) you could send to someone else and they would see the _same thing_. This is what the web is all about—creating and referencing hypertext to build a more connected world.

For my case, I want to use search parameters to filter my reading activity feed, using strings like "filter=currently-reading" and "sort=desc". Fresh makes this incredibly easy to do within a page component's "route handler"—really just a wrapper for an HTTP method, whose response can then be passed down to other components on the page. The handler for my home page (located in the project's `routes/index.tsx` file) does a few important things:

- Makes an async request to the Airtable endpoint for the book data I want—in this case, all of the reading activity data, which includes dates read and information on books
- Uses the `URL` interface at the same time to get any search parameters in the URL
- Returns an object consisting of the Airtable data and URL search parameters in JSON format
- _Another caveat: I'm not too concerned with error handling in the following examples, because I have a good idea of what is coming from the Airtable data I am creating. But in a real-world case I'd want to bake that in from the start. I'm also ommiting import statements and type declarations for the sake of brevity_

<figure>
<figcaption class="code-caption">routes/index.tsx</figcaption>

```tsx
export const handler: Handlers = {
  // The handler is essentially a wrapper for an async HTTP request
  async GET(_request: Request, context: HandlerContext) {
    // Request a new URL object from our route
    const urlParams = new URL(_request.url);

    // Convert the search params in the current URL into JSON for ease of use later;
    // this will give us a key-value structure, where the key is
    // the name of the parameter (i.e., "filter") and
    // the value is the category name (i.e., "currently-reading")
    const paramsObject: Record<string, string> = {};
    for (const item of urlParams.seachParams) {
      paramsObject[item[0]] = item[1];
    }

    // Use a function from ../server/airtable.ts that fetches from the
    // Airtable API endpoint and returns a JSON response;
    // the function takes in a table name/ID and optional parameters
    // and constructs a URL to fetch
    return context.render({
      activity: (await getAirtableData("Reading Activity")) as AirtableResponse,
      filterParams: JSON.stringify(paramsObject),
    });
  },
};
```

</figure>

Then, further down in the same file, the main `Home` component for rendering the page will receive this object response as props (in the `data` variable):

<figure>
<figcaption class="code-caption">routes/index.tsx</figcaption>

```tsx
export default function Home({ data }: PageProps<HomeData>) {
  const { activity, filterParams } = data;

  const param: Record<string, string> = JSON.parse(filterParams);
  console.log(param);
  // ...
  // ...
}
```

</figure>

If we `console.log()` that `param` variable, we'll see something very interesting: if we're on the home page route ("/") and manually add any search parameters to the URL in the browser's address bar, we'll get those parameters returned as a handy object. So adding "?filter=currently-reading&sort=desc" to the URL will log `{ filter: 'currently-reading', sort: 'desc' }`, which we'll have acces to anywhere in our component template. That's a really convenient format with which to manipulate our page's data on the fly.

Here is where we can start to do some fun things in the `Home` component, before we actually render the final markup. First, using the search parameters from our current URL structure, we can filter and sort the Airtable records based on their status and date properties:

<figure>
<figcaption class="code-caption">routes/index.tsx</figcaption>

```tsx
// Extract the current seach params to variables for ease of reference;
// also set defaults in case no params are in the URL
const currentFilter = param.filter || "all";
const currentSort = param.sort || "desc";

// First, use a helper function to map over the received Airtable data
// to get it into an easily workable shape
const preparedActivity = activity?.records.map(
  (airtableRecord: AirtableRecord) => {
    return prepareActivity(airtableRecord);
  }
);

// Use the filter array method on the prepared activity items
// to filter out status based on the current filter
const filteredActivity = preparedActivity.filter((record) => {
  switch (currentFilter) {
    case "currently-reading":
      return record.status === "Currently Reading";
    case "have-read":
      return record.status === "Have Read";
    case "read-next":
      return record.status === "Read Next";
    case "finished":
      return record.status === "Have Read" && record.percentRead === 1;
    default:
      return (
        record.status === "Have Read" || record.status === "Currently Reading"
      );
  }
});

// Then, sort the filtered records by date, using a handy Deno
// standard library function to sort an array based on a shared property
const sortedAndFilteredActivity =
  currentSort === "asc"
    ? sortBy(filteredActivity, (item) => item.dateUpdated, { order: "asc" })
    : sortBy(filteredActivity, (item) => item.dateUpdated, { order: "desc" });

// Finally, use another Deno standard library function to group an
// array of objects by a shared property, in this case the status,
// to build out counts for the feed sidebar
// This outputs an object where keys are the status and values are an array
// of the records with that status, i.e.:
// { "Currently Reading": [// records with status of currently reading],
// "Have Read": [// records with status of have read] }
// I love this amazing little function
const sidebarActivity = groupBy(preparedActivity, (item) => item.status);
```

</figure>

Finally, we can return the markup for the `Home` component, which will dynamically update the records in a list of `FeedItem` components, depending on the current URL search parameters. The sidebar links will also show the number of records in each category, and will show an active style if the search parameters match. We can set the new URL search parameters on these links with a simple `<a>` tag, and dynamically interpolate the correct values for the `href` attribute based on our current variables, i.e., `?filter=all&sort=${currentSort}`, which will "preserve" the state of our current selections.

Here is the structure of the entire `Home` component following the route handler (with some HTML and classes stripped for better readability):

<figure>
<figcaption class="code-caption">routes/index.tsx</figcaption>

```tsx
export default function Home({ data }: PageProps<HomeData>) {
    const { activity, filterParams } = data;

    const param: Record<string, string> = JSON.parse(filterParams);
    const currentFilter = param.filter || "all";
    const currentSort = param.sort || "desc";

    const preparedActivity = //...
    const filteredActivity = //...
    const sortedAndFilteredActivity = //...
    const sidebarActivity = //...

    // For better readability I've extracted out some HTML and
    // Tailwind classes; I'm also using some components that are
    // defined in other files, e.g., ActivityLink and FeedItem
    // ActivityLink wraps an <a> tag and adds more info based on context
    return (
      <main>
        <section class="sidebar">
          <div class="filter-links">
            <p>Filter</p>
            <ul>
              <li>
                <ActivityLink
                  title="All Activity"
                  href={`?filter=all&sort=${currentSort}`}
                  count={preparedActivity.length}
                  active={currentFilter === "all" || currentFilter === ""}
                />
              </li>
              <li>
                <ActivityLink
                  title="Currently Reading"
                  href={`?filter=currently-reading&sort=${currentSort}`}
                  count={sidebarActivity["Currently Reading"] && sidebarActivity["Currently Reading"].length || 0}
                  active={currentFilter === "currently-reading"}
                />
              </li>
              <li>
                <ActivityLink
                  title="Read Next"
                  href={`?filter=read-next&sort=${currentSort}`}
                  count={sidebarActivity["Read Next"] && sidebarActivity["Read Next"].length || 0}
                  active={currentFilter === "read-next"}
                />
              </li>
              <li>
                <ActivityLink
                  title="Have Read"
                  href={`?filter=have-read&sort=${currentSort}`}
                  count={sidebarActivity["Have Read"] && sidebarActivity["Have Read"].length || 0}
                  active={currentFilter === "have-read"}
                />
              </li>
              <li>
                <ActivityLink
                  title="Finished"
                  href={`?filter=finished&sort=${currentSort}`}
                  count={sidebarActivity["Have Read"] && sidebarActivity["Have Read"].filter((item) => item.percentRead === 1).length || 0}
                  active={currentFilter === "finished"}
                />
              </li>
            </ul>
          </div>
          <div class="sort-links">
            <p>Sort</p>
            <ul>
              <li>
                <ActivityLink
                  title="Newest"
                  href={`?filter=${currentFilter}&sort=desc`}
                  active={currentSort === "desc"}
                />
              </li>
              <li>
                <ActivityLink
                  title="Oldest"
                  href={`?filter=${currentFilter}&sort=asc`}
                  active={currentSort === "asc"}
                />
              </li>
            </ul>
          </div>
        </section>
        <section class="feed">
          <h2>
            {currentFilter === "currently-reading" && "Currently Reading"}
            {currentFilter === "read-next" && "Read Next"}
            {currentFilter === "have-read" && "Have Read"}
            {currentFilter === "finished" && "Finished"}
            {currentFilter === "all" && "All Activity"}
          </h2>
          <ul>
            {sortedAndFilteredActivity.map((book) => (
              <li>
                <FeedItem
                  bookInfo={book.bookInfo}
                  status={book.status}
                  dateUpdated={book.dateUpdated}
                  pagesRead={book.pagesRead}
                  percentRead={book.percentRead}
                />
              </li>
            ))}
          </ul>
        </section>
      </main>
    );
}
```

</figure>

The result is a simple but powerful way of filtering and sorting a big list of reading activity without any client-side JavaScript!

## Things to Add/Improve

As I continue to tinker with this site, there are few things I want to add/improve:

- Add sitewide search
- Implement new Fresh features like [partials](https://fresh.deno.dev/docs/concepts/partials)
- Design and build a section for Reading Paths data
- Add Author pages
- Implement pagination/splitting large server requests into smaller pieces

Again, [here is the link to the site](https://deep-pheasant-69.deno.dev/) if you want to peruse. I'd be interested to know what you think of this whole project!
