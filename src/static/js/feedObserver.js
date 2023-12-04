const feed = document.querySelectorAll("#feed > *");
// const stickyText = [...document.querySelectorAll("#sectionName > span")];
const stickyText = document.querySelector("#sectionName");
// console.log(stickyText);

function updateText(sectionID) {
  return `${
    sectionID === "posts"
      ? "blog"
      : sectionID === "projects"
      ? "studio"
      : "bookshelf"
  }`;
}

// const observerOptions = {
//   rootMargin: "-100px 0% -66%",
//   threshold: 1,
// };

const feedObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // console.log(entry);
    if (entry.isIntersecting) {
      // console.log("section is intersecting", entry.target);
      const id = entry.target.id;
      const sidebarText = updateText(id);
      stickyText.textContent = sidebarText;
      // console.log(sidebarText);
    }
  });
});

feed.forEach((section) => feedObserver.observe(section));
