export const layout = "layouts/project-categories.vto";

export default function* ({ search }) {
  for (const tag of search.values("tags", "type=projects")) {
    const projects = search.pages(`'${tag}' type=projects`, "date=desc");
    // console.log("post tags:", tag);
    // const posts = search.pages("'" + tag + "'", "date=desc");
    // const slugified = tag.trim().replace(/\s+/g, "-").toLowerCase();
    yield {
      url: `/projects/${tag}/`,
      title: `${tag}`,
      type: "tag",
      projectlist: projects,
      tag,
    };
  }
}
