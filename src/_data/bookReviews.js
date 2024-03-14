// import * as path from "https://deno.land/std@0.202.0/path/mod.ts";
// import { load } from "https://deno.land/std@0.202.0/dotenv/mod.ts";
// await load({ export: true });
// // const apiToken = env["AIRTABLE_ACCESS_TOKEN"];
// const apiToken = Deno.env.get("AIRTABLE_ACCESS_TOKEN");
// // console.log("AIRTABLE TOKEN", apiToken);

// const airtableBase = "appYm5Ud471pJY0w8";
// const reviewsTable = "tbl9SsriKinWtsA8R";

// async function getReviewData() {
//   const url = `https://api.airtable.com/v0/${airtableBase}/${reviewsTable}`;

//   const params = new URLSearchParams([
//     ["returnFieldsByFieldId", "true"],
//     ["view", "viwqk1NXMkW9I4flz"],
//     ["fields", "fldbMMW08y1cEoepJ"], // rating
//     ["fields", "fldnriNe1xMOCxm7f"], // body
//     ["fields", "fldE0z672qNIsnT4H"], // date (arr)
//     ["fields", "fldwgCaPUqJ6ilzy4"], // book title (arr)
//     ["fields", "fldv32O3fp92ljeW4"], // author (arr)
//     ["fields", "fldei0ITi38Oe11A5"], // book cover
//   ]);

//   const headers = new Headers();
//   headers.append("Authorization", `Bearer ${apiToken}`);

//   const res = await fetch(`${url}?${params.toString()}`, {
//     headers: headers,
//   });
//   if (!res.ok) {
//     console.log("Error fetching data");
//   } else {
//     return res.json();
//   }
// }

// const data = await getReviewData();

// const records = data.records.map((record) => {
//   const fields = record.fields;
//   const date = new Date(fields.fldE0z672qNIsnT4H);
//   const bookTitle = fields.fldwgCaPUqJ6ilzy4.toString();
//   const author = fields.fldv32O3fp92ljeW4.toString();

//   return {
//     title: `Book Review: ${bookTitle}`,
//     summary: `My review of ${bookTitle} by ${author}.`,
//     url: `/posts/reviews/${bookTitle
//       .trim()
//       .replace(/\s+/g, "-")
//       .toLowerCase()}/`,
//     archiveYear: 2024,
//     tags: ["reading"],
//     category: "reviews",
//     type: "posts",
//     author: author,
//     rating: fields.fldbMMW08y1cEoepJ,
//     body: fields.fldnriNe1xMOCxm7f,
//     date: fields.fldE0z672qNIsnT4H.toString(),
//   };
// });

// // console.log(records);
// export const list = records;
