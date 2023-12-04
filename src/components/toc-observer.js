export class TOCObserver extends HTMLElement {
  // _current = this.querySelector('a[aria-current="true"]');

  // set _current(link) {
  //   if (link === this._current) return;
  //   if (this._current) {
  //     this._current.classList.remove("active");
  //     this._current.removeAttribute("aria-current");
  //   }
  //   link.setAttribute("aria-current", "true");
  //   link.classList.add("active");
  //   this._current = link;
  //   console.log("current link", link);
  // }
  #currentLink;

  constructor() {
    super();
  }

  connectedCallback() {
    const links = [...this.querySelectorAll("a")];
    const content = document.querySelectorAll(
      "#content > :first-child, #content :is(h2, h3)"
    );
    console.log(content);
    const prelude = links[0];
    // console.log(prelude);
    this.highlightLink(prelude);

    const setCurrent = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const { id } = entry.target;
          // console.log("observer entry id: ", id);
          if (id === "") {
            const link = links.find((link) => link.hash === "#" + "content");
            this.highlightLink(link);
            break;
            // const link = links.find((link) => link.hash === "#" + "content");
            // this._current = link;
            // break;
          }
          const link = links.find((link) => link.hash === "#" + id);
          // console.log("found toc link", link);
          if (link) {
            this.highlightLink(link);
            break;
          }
        }
      }
    };

    const observerOptions = {
      rootMargin: "-100px 0% -66%",
      threshold: 1,
    };

    const headingObserver = new IntersectionObserver(
      setCurrent,
      observerOptions
    );

    content.forEach((h) => headingObserver.observe(h));
  }

  highlightLink(link) {
    if (this.#currentLink) {
      this.#currentLink.classList.remove("active");
      this.#currentLink.removeAttribute("aria-current");
    }
    link.setAttribute("aria-current", "true");
    link.classList.add("active");
    this.#currentLink = link;
  }
}

customElements.define("toc-observer", TOCObserver);
