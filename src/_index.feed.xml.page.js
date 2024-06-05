export const layout = "layouts/feed.xml.vto";
export default function* ({ search, paginate }) {
  const pages = search.pages("type=posts", "date=desc");

  for (const page of paginate(pages, {
    url: (n) => (n === 1 ? "/feed.xml" : `/p/${n}/feed.xml`),
    size: 5,
  })) {
    yield page;
  }
}
