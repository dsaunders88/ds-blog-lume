const content = document.querySelectorAll("#content > *");
const toc = document.querySelectorAll(".toc-nav ul a");
const tocLinks = Array.from(toc);

const tocObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id || null;
      if (id) {
        const tocHeading = tocLinks.find((link) => link.hash === `#${id}`);
        if (tocHeading) {
          tocHeading.classList.add("active");
          tocLinks
            .filter((link) => link !== tocHeading)
            .forEach((link) => link.classList.remove("active"));
        }
      }
      //   else {
      //     const id = entry.target.id || null;
      //     if (id) {
      //       const nonIntersectingLink = tocLinks.find(
      //         (link) => link.hash === `#${id}`
      //       );
      //       if (nonIntersectingLink) {
      //         nonIntersectingLink.classList.remove("active");
      //       }
      //     }
      //   }
    }
  });
});

content.forEach((section) => tocObserver.observe(section));
