import vento from "https://deno.land/x/vento@v0.9.1/mod.ts";
import { parse } from "https://deno.land/std@0.207.0/yaml/mod.ts";

export interface Bookmark {
  name?: string;
  description?: string;
  url?: string;
  category?: string;
  tags?: string[];
  date_added?: Date;
}

interface Sort {
  method?: "alphabetical" | "date";
  order?: "asc" | "desc";
}

const env = vento();

const file = await Deno.readTextFile("./src/_data/bookmarks.yaml");
const bookmarks = parse(file) as Bookmark[];

export async function render(params: Record<string, string>) {
  env.cache.clear();
  //   const result = await env.runString(
  //     "<h1>{{ title }}</h1><p>This is a paragraph with {{ input }}.</p>",
  //     {
  //       title: "Hello, world!",
  //       input: "dynamic input field",
  //     }
  //   );
  const paramList = new Set() as Set<string>;
  const tagList = new Set() as Set<string>;
  const filteredByCategory = [];
  const filteredByTag = new Set();
  const sort: Sort = {
    method: undefined,
    order: undefined,
  };
  // const filtered = bookmarks.filter((item) => item.category === "website");
  for (const [key, value] of Object.entries(params)) {
    if (key === "sort") {
      sort.method = value as Sort["method"];

      if (sort.method === "alphabetical") {
        sort.order = "asc";
      } else {
        sort.order = "desc";
      }
    } else {
      paramList.add(key);
    }
  }

  console.log("tags from params ", paramList);
  console.log("sort from params ", sort);

  // First filter by categories - entry can only belong to one category so don't worry about duplicates
  if (paramList.has("website")) {
    filteredByCategory.push(
      bookmarks.filter((item) => item.category === "website")
    );
  }
  if (paramList.has("article")) {
    filteredByCategory.push(
      bookmarks.filter((item) => item.category === "article")
    );
  }
  if (paramList.has("resource")) {
    filteredByCategory.push(
      bookmarks.filter((item) => item.category === "resource")
    );
  }

  // If no category is selected, this will be empty
  const bookmarkList = filteredByCategory.flat();

  // Check if all `values` exist in `array`
  function includesAll(array: any[], values: any[]) {
    return values.every((value) => array.includes(value));
  }

  function filterByTags(list: Bookmark[], tagList: Set<string>) {
    list.forEach((item) => {
      // If the item's tags include all of the taglist, add to filtered Set
      if (includesAll(item.tags as string[], Array.from(tagList))) {
        filteredByTag.add(item);
      }

      // if (item.tags?.includes(tag)) {
      //   filteredByTag.add(item);
      // }
    });
  }

  function sortByMethod(list: Bookmark[], method: Sort["method"]) {
    if (method !== undefined) {
      if (method === "alphabetical") {
        return list.sort((a, b) => {
          const nameA = a.name?.toUpperCase();
          const nameB = b.name?.toUpperCase();
          if (nameA! < nameB!) {
            return -1;
          }
          if (nameA! > nameB!) {
            return 1;
          }
          return 0;
        });
      }

      return list.sort((a, b) => {
        const dateA = new Date(a.date_added!);
        const dateB = new Date(b.date_added!);
        return dateB.getTime() - dateA.getTime();
      });
    }
    return list;
  }

  // Second filter by tags - start with filtered by category list
  // For this one avoid duplicates by using Set
  // If no secondary tags, return full list by category
  for (const [key, value] of paramList.entries()) {
    // console.log("param list iterator ", key);
    // Skip over the top level categories
    if (key === "website" || key === "article" || key === "resource") {
      continue;
    } else {
      tagList.add(key);
      // Filter tags from bookmarkList
      // console.log(`key '${key}' was captured`);
      // bookmarkList.forEach((item) => {
      //   if (item.tags?.includes(key)) {
      //     filteredByTag.add(item);
      //   }
      // });
    }
  }

  // Select which bookmark list to iterate over - the original list if no categories were selected, otherwise, the filtered list
  if (bookmarkList.length === 0) {
    filterByTags(bookmarks, tagList);
  } else {
    filterByTags(bookmarkList, tagList);
  }

  const filteredList = Array.from(filteredByTag) as Bookmark[];

  console.log(
    "filtered by category and tag and sorted",
    sortByMethod(filteredList, sort.method)
  );

  // Object.entries(params).forEach((param) => {
  //   console.log("param from object entries ", param);
  //   console.log(param[0]);
  //   if (param[0] === "article" || param[0] === "website") {
  //     filtered.add(bookmarks.filter((item) => item.category === param[0]));
  //   } else {
  //     filtered.add(bookmarks.filter((item) => item.tags.includes(param[0])));
  //   }
  // });

  // console.log("filtered by category ", bookmarkList);

  const template = await env.load(
    "./src/_includes/partials/bookmark-links.vto"
  );
  const result = await template({
    // bookmarks: filtered.size === 0 ? bookmarks : Array.from(filtered).flat(),
    bookmarkLinks: sortByMethod(filteredList, sort.method).map((link) => {
      return {
        ...link,
        date_added: new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
          timeZone: "UTC",
        }).format(link.date_added),
      };
    }),
    // filteredByTag.size !== 0
    //   ? Array.from(filteredByTag)
    //   : bookmarkList.length !== 0
    //   ? bookmarkList
    //   : bookmarks,
  });

  return result.content;
}
