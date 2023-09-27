export const layout = "layouts/posts.vto";
export const title = "All Posts";

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
