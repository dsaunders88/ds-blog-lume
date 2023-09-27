const button = document.querySelector("#generateInterests");
button.addEventListener("htmx:beforeOnLoad", (e) => {
  const svg = e.target.children[1];
  svg.classList.add("spin");
});
button.addEventListener("htmx:afterOnLoad", (e) => {
  setTimeout(() => {
    const svg = e.target.children[1];
    svg.classList.remove("spin");
  }, 400);
});
