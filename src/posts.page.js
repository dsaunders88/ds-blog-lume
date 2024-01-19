export const layout = "layouts/posts.vto";
export const title = "All Posts";
export const metas = {
  title: "All Posts • Daniel Saunders",
  description: "A collection of essays, notes, and lists on various topics.",
  // image: "$ img",
};

export default function* ({ search, paginate }) {
  const posts = search.pages("type=posts", "date=desc");

  for (const data of paginate(posts, { url, size: 10 })) {
    yield data;
  }
}

function url(n) {
  if (n === 1) {
    return "/posts/";
  }

  return `/posts/${n}/`;
}
