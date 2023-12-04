console.log("starlight ts");

export class StarlightTOC extends HTMLElement {
  private _current = this.querySelector('a[aria-current="true"]');
  private minH = parseInt(this.dataset.minH || "2", 10);
  private maxH = parseInt(this.dataset.maxH || "3", 10);

  protected set current(link: HTMLAnchorElement) {
    if (link === this._current) return;
    if (this._current) this._current.removeAttribute("aria-current");
    link.setAttribute("aria-current", "true");
    this._current = link;
  }

  constructor() {
    super();

    /** All the links in the table of contents. */
    const links = [...this.querySelectorAll("a")];
    console.log("links: ", links);

    /** Test if an element is a table-of-contents heading. */
    const isHeading = (el: Element): el is HTMLHeadingElement => {
      if (el instanceof HTMLHeadingElement) {
        const level = el.tagName[1];
        if (level) {
          const int = parseInt(level, 10);
          if (int >= this.minH && int <= this.maxH) return true;
        }
      }
    };

    /** Walk up the DOM to find the nearest heading. */
    const getElementHeading = (
      el: Element | null
    ): HTMLHeadingElement | null => {
      if (!el) return null;
      const origin = el;
      while (el) {
        if (isHeading(el)) return el;
        // Assign the previous sibling’s last, most deeply nested child to el.
        el = el.previousElementSibling;
        while (el?.lastElementChild) {
          el = el.lastElementChild;
        }
        // Look for headings amongst siblings.
        const h = getElementHeading(el);
        if (h) return h;
      }
      // Walk back up the parent.
      return getElementHeading(origin.parentElement);
    };

    /** Handle intersections and set the current link to the heading for the current intersection. */
    const setCurrent: IntersectionObserverCallback = (entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        const heading = getElementHeading(target);
        console.log("set current heading: ", heading);
        if (!heading) continue;
        const link = links.find(
          (link) => link.hash === "#" + encodeURIComponent(heading.id)
        );
        if (link) {
          this.current = link;
          break;
        }
      }
    };

    // Observe elements with an `id` (most likely headings) and their siblings.
    // Also observe direct children of `.content` to include elements before
    // the first heading.
    const tocObserve = document.querySelectorAll("#content > *");

    let observer: IntersectionObserver | undefined;
    const observe = () => {
      if (observer) observer.disconnect();
      observer = new IntersectionObserver(setCurrent, { rootMargin: "0px" });
      tocObserve.forEach((h) => observer!.observe(h));
    };
    observe();
  }
}

customElements.define("starlight-toc", StarlightTOC);
