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
    ["maxRecords", "8"],
    ["view", "viwQYvgMewlWBBqe2"],
    ["fields", "fldlmF45gCYW23PLI"],
    ["fields", "fldKlpKfwoCqCJbVM"],
    ["fields", "fldCEvxZzmoChJ5Dh"],
    ["fields", "fldC7XcQ4urRb4fQV"],
    ["fields", "fldEtqJkG0cSKP8dK"],
    ["fields", "fldKM2VLezO00lQHI"],
    ["fields", "fld75vdT7jzbx0ptV"],
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

const data = await getBookData();
console.log(data);
export const list = data.records.map((record) => {
  const fields = record.fields;
  return {
    id: fields.fldlmF45gCYW23PLI.toString(),
    title: fields.fldKlpKfwoCqCJbVM.toString(),
    status: fields.fldCEvxZzmoChJ5Dh,
    authors: fields.fldC7XcQ4urRb4fQV,
    percentRead: new Intl.NumberFormat("en-US", { style: "percent" }).format(
      fields.fldKM2VLezO00lQHI
    ),
    cover: fields.fldEtqJkG0cSKP8dK[0].thumbnails.large.url,
    lastModified: fields.fld75vdT7jzbx0ptV,
  };
});
