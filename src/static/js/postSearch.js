window.addEventListener("DOMContentLoaded", (event) => {
  new PagefindUI({
    element: "#search",
    showSubResults: true,
    debounceTimeoutMs: 500,
    translations: {
      placeholder: "Try 'CSS', 'postmodernism', 'Bach', 'revolution'...",
    },
  });
});
