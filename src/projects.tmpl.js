export const layout = "layouts/projects.vto";
export const title = "Featured Projects";

export default function* ({ search, paginate }) {
  const projects = search.pages("type=projects", "date=desc");

  for (const data of paginate(projects, { url, size: 15 })) {
    yield data;
  }
}

function url(n) {
  if (n === 1) {
    return "/projects/";
  }

  return `/projects/${n}/`;
}
