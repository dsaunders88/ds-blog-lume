import { load } from "https://deno.land/std@0.202.0/dotenv/mod.ts";
await load({ export: true });
// const apiToken = env["FATHOM_ACCESS_TOKEN"];
const apiToken = Deno.env.get("FATHOM_ACCESS_TOKEN");

function threeMonthsAgo() {
  const now = new Date();
  const threeMonths = 7889238000; // 3 months in Unix timestamp
  return new Date(now - threeMonths).toISOString();
}

async function getFathomData() {
  const url = "https://api.usefathom.com/v1/aggregations";
  const filters = [
    { property: "referrer_hostname", operator: "is not", value: "localhost" },
    { property: "pathname", operator: "is like", value: "/posts" },
    { property: "pathname", operator: "is not", value: "/posts/" },
    { property: "pathname", operator: "is not", value: "/posts/1/" },
    { property: "pathname", operator: "is not", value: "/posts/2/" },
    { property: "pathname", operator: "is not", value: "/posts/3/" },
    { property: "pathname", operator: "is not", value: "/posts/4/" },
    { property: "pathname", operator: "is not", value: "/posts/5/" },
    { property: "pathname", operator: "is not", value: "/posts/6/" },
    { property: "pathname", operator: "is not", value: "/posts/7/" },
    { property: "pathname", operator: "is not", value: "/posts/8/" },
    { property: "pathname", operator: "is not", value: "/posts/9/" },
    { property: "pathname", operator: "is not", value: "/posts/notes/" },
    { property: "pathname", operator: "is not", value: "/posts/essays/" },
    { property: "pathname", operator: "is not", value: "/posts/lists/" },
    { property: "pathname", operator: "is not", value: "/posts/archive" },
  ];

  const params = new URLSearchParams({
    entity: "pageview",
    entity_id: "DMOAPCNG",
    aggregates: "pageviews",
    field_grouping: "pathname",
    date_from: threeMonthsAgo(),
    sort_by: "pageviews:desc",
    limit: 5,
    timezone: "America/Los_Angeles",
    filters: JSON.stringify(filters),
  });

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${apiToken}`);

  const res = await fetch(`${url}?${params.toString()}`, {
    headers: headers,
  });
  return res.json();
}

const trendingPosts = await getFathomData();
console.log(trendingPosts);
export const list = trendingPosts;
