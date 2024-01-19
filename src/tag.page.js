export const layout = "layouts/tag.vto";

export default function* ({ search }) {
  for (const tag of search.values("tags", "type=posts")) {
    const posts = search.pages(`'${tag}' type=posts`, "date=desc");
    // console.log("post tags:", tag);
    // const posts = search.pages("'" + tag + "'", "date=desc");
    // const slugified = tag.trim().replace(/\s+/g, "-").toLowerCase();
    yield {
      url: `/tag/${tag}/`,
      title: `Posts tagged ${tag}`,
      docTitle: `${
        tag.charAt(0).toUpperCase() + tag.slice(1)
      } Posts • Daniel Saunders`,
      type: "tag",
      postlist: posts,
      metas: {
        title: `${tag} Posts`,
        description: `A collection of posts tagged ${tag}.`,
        // image: "$ img",
      },
      tag,
    };
  }
}
