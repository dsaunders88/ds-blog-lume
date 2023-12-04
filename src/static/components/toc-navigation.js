import { h, Component, render } from "https://esm.sh/preact";
import htm from "https://esm.sh/htm";

// Initialize htm with Preact
const html = htm.bind(h);
const tocNav = document.querySelector(".toc-nav");
// const headings = [
//   {
//     level: 1,
//     text: "Prelude",
//     slug: "#content",
//   },
//   {
//     level: 1,
//     text: "Text",
//     slug: "#first",
//   },
// ];

// function App({ name }) {
//   return html`<h1>Hello ${name}!</h1>`;
// }

// const name = "Daniel";

function TableOfContents({ headings }) {
  // const slugs = headings.map(({ slug }) => {
  //   return slug;
  // });
  console.log(headings);

  return html`
    <ul role="list">
      ${headings.map(
        ({ text, slug }) =>
          html`<li key=${text}>
            <a class="toc-link" href=${slug}>${text}</a>
          </li>`
      )}
    </ul>
  `;
}

// render(html`<${App} name=${name} />`, document.body);
render(html`<${TableOfContents} headings=${headings} />`, tocNav);
