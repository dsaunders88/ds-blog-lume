import { load } from "https://deno.land/std@0.202.0/dotenv/mod.ts";
await load({ export: true });
// const apiKey = env["LASTFM_API_KEY"];
const apiKey = Deno.env.get("LASTFM_API_KEY");

async function getLastfmData() {
  const url = "http://ws.audioscrobbler.com/2.0/";
  const params = new URLSearchParams({
    method: "user.gettopalbums",
    user: "dothedan",
    period: "3month",
    limit: 15,
    api_key: apiKey,
    format: "json",
  });
  const res = await fetch(`${url}?${params.toString()}`);
  return res.json();
}

const musicData = await getLastfmData();
export const albums = musicData.topalbums.album.map((item) => {
  return {
    artist: item.artist.name,
    coverImage: item.image.find(({ size }) => size === "large")["#text"],
    url: item.url,
    playCount: item.playcount,
    name: item.name,
  };
});
