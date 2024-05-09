import * as path from "https://deno.land/std@0.202.0/path/mod.ts";
import { load } from "https://deno.land/std@0.202.0/dotenv/mod.ts";
await load({ export: true });
// const apiToken = env["AIRTABLE_ACCESS_TOKEN"];
const apiToken = Deno.env.get("AIRTABLE_ACCESS_TOKEN");
// console.log("AIRTABLE TOKEN", apiToken);

const airtableBase = "appYm5Ud471pJY0w8";
const readingActivityTable = "tblr6UI7PA9ETQlOg";

async function getBookData() {
  const url = `https://api.airtable.com/v0/${airtableBase}/${readingActivityTable}`;

  const params = new URLSearchParams([
    ["returnFieldsByFieldId", "true"],
    ["maxRecords", "24"],
    ["view", "viwQYvgMewlWBBqe2"], // All activity view - will automatically sort based on view
    ["fields", "fldlmF45gCYW23PLI"], // Linked book record id (arr)
    ["fields", "fldIVAy1LGdKLaxbw"], // date started
    ["fields", "fldKlpKfwoCqCJbVM"], // Book title (lookup arr)
    ["fields", "fldIwqgbD7kf7N8qD"], // date finished
    ["fields", "fldCEvxZzmoChJ5Dh"], // status
    ["fields", "fldC7XcQ4urRb4fQV"], // author (lookup arr)
    ["fields", "fldEtqJkG0cSKP8dK"], // cover (lookup arr)
    ["fields", "fldKM2VLezO00lQHI"], // percent read
    ["fields", "fld75vdT7jzbx0ptV"], // last modified
    ["fields", "fldpzGGsP5bR1hUAW"], // feed date - replaces date started/finished/modified
  ]);

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${apiToken}`);

  const res = await fetch(`${url}?${params.toString()}`, {
    headers: headers,
  });
  if (!res.ok) {
    console.log("Error fetching data");
  } else {
    return res.json();
  }
}

async function downloadAndSaveImage(airtableImage) {
  try {
    const res = await fetch(airtableImage.url);
    if (!res.ok) {
      throw new Error("Failed to fetch remoted Airtable image.");
    }

    const imageBytes = new Uint8Array(await res.arrayBuffer());

    const savePath = path.format({
      root: ".",
      dir: path.join("src", "img", "books"),
      name: airtableImage.id,
      ext: ".jpg",
    });

    console.log(`Downloading and saving book image to ${savePath}`);
    await Deno.writeFile(savePath, imageBytes);

    return {
      id: airtableImage.id,
      savePath: savePath,
    };
  } catch (e) {
    console.log(`Error downloading image ${imageItem.id}: ${e}`);
  }
}

const data = await getBookData();
// const downloadedImages = await downloadAndSaveImages(data.records.)
// console.log(data);

const records = data.records.map(async (record) => {
  const fields = record.fields;
  // const dateStarted =
  //   fields.fldIVAy1LGdKLaxbw && new Date(fields.fldIVAy1LGdKLaxbw);
  // const dateFinished =
  //   fields.fldIwqgbD7kf7N8qD && new Date(fields.fldIwqgbD7kf7N8qD);
  // const airtableLastUpdated = new Date(fields.fld75vdT7jzbx0ptV);
  // const dateUpdated = dateFinished || dateStarted || airtableLastUpdated;
  const completed =
    fields.fldCEvxZzmoChJ5Dh === "Have Read" && fields.fldKM2VLezO00lQHI === 1;
  const downloadedImage = await downloadAndSaveImage(
    fields.fldEtqJkG0cSKP8dK[0]
  );

  const feedDate = Date.parse(fields.fldpzGGsP5bR1hUAW + "T00:00:00.000-07:00");

  return {
    id: fields.fldlmF45gCYW23PLI.toString(),
    title: fields.fldKlpKfwoCqCJbVM.toString(),
    status: fields.fldCEvxZzmoChJ5Dh,
    authors: fields.fldC7XcQ4urRb4fQV,
    completed: completed,
    cover: fields.fldEtqJkG0cSKP8dK[0].thumbnails.large.url,
    date: fields.fldpzGGsP5bR1hUAW,
    activityMonth: new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(feedDate),
    downloadedImage: downloadedImage,
  };
});

// console.log(await Promise.all(records));

const resolvedRecords = await Promise.all(records);

export const listSliced = resolvedRecords.slice(0, 8);
export const listAll = Object.groupBy(
  resolvedRecords,
  ({ activityMonth }) => activityMonth
);

// console.log({ listAll });
