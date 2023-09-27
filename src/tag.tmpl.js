export const layout = "layouts/tag.vto";

export default function* ({ search }) {
  for (const tag of search.tags()) {
    // const slugified = tag.trim().replace(/\s+/g, "-").toLowerCase();
    yield {
      url: `/tag/${tag}/`,
      title: `Posts tagged ${tag}`,
      type: "tag",
      tag,
    };
  }
}
