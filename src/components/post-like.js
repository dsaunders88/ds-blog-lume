//const minimumNum = Math.max(0, Number(count.textContent) - 1)

export class PostLike extends HTMLElement {
  #count;
  #liked;
  #message;
  #postId;
  #postUrl;
  #button;
  #countWrapper;
  #messageWrapper;

  constructor() {
    super();

    this.#postUrl = this.dataset.postId;
    this.#postId = this.dataset.postId.split("/").filter(Boolean)[2];
    this.#liked = localStorage.getItem(`${this.#postId}-like`);
    this.#message = "";
  }

  async connectedCallback() {
    console.log("initial liked?", this.#liked); // null or true
    // get elements
    this.#button = this.querySelector("button");
    this.#countWrapper = this.querySelector("#count");
    this.#messageWrapper = this.querySelector("#message");

    // Safe if slug will always be in the format /posts/category/slug
    // const postId = this.dataset.postId.split("/").filter(Boolean)[2];
    // console.log("post id", postId);

    // fetch kv likes

    // let count = 0;
    // console.log("initial count", count);

    // this.#liked = localStorage.getItem(`${postId}-like`);
    // console.log("initial liked?", this.#liked); // null or true
    // console.log("dataset postid", this.dataset.postId);

    const res = await this.getInitialLikes();
    this.#count = res;
    console.log("initial count", this.#count);

    // initial message appearance
    if (this.#count == 0) {
      this.#message = "Be the first to like this post!";
    }

    // initial button appearance
    if (this.#liked) {
      // console.log(
      //   `Stored local value for ${this.#postId}-like`,
      //   localStorage.getItem(`${this.#postId}-like`)
      // );
      this.#button.classList.add("active");
      // this.#icon.style.fill = "red";
      // this.#icon.style.color = "red";

      //// update default aria label
      this.#button.setAttribute("hx-put", `${this.#postUrl}unlike`);
      // Important - process new content to make available to htmx
      htmx.process(this.#button);
    } else {
      // console.log(`No local storage value for ${this.#postId}-like`);
      this.#button.classList.remove("active");
      // this.#icon.style.fill = "none";
      // this.#icon.style.color = "currentColor";
      this.#button.setAttribute("hx-put", `${this.#postUrl}like`);
      // Important - process new content to make available to htmx
      htmx.process(this.#button);
    }

    // const createButton = document.createElement("button");
    // createButton.setAttribute("hx-put", `${window.location.pathname}like`);
    // createButton.setAttribute("hx-swap", "outerHTML");
    // createButton.innerHTML = this.#count;
    // this.appendChild(createButton);

    this.#countWrapper.textContent = this.#count;
    this.#messageWrapper.textContent = this.#message;

    // this.#button.addEventListener("click", () => this.toggleLike());

    // htmx.on("htmx:configRequest", (e) => {
    //   console.log(e);
    // });

    htmx.on("htmx:afterOnLoad", (e) => {
      this.toggleLike();
    });

    // document.body.addEventListener("htmx:configRequest", (e) => {
    //   console.log("triggered htmx:configRequest");

    //   if (!this.#liked) {
    //     e.detail.parameters["action"] = "like";
    //   } else {
    //     e.detail.parameters["action"] = "unlike";
    //   }

    //   console.log(e.detail.parameters);
    // });

    // if (!this.#liked) {
    //   document.body.addEventListener("htmx:configRequest", (e) => {
    //     e.detail.parameters["like"] = true;
    //   });
    // } else {
    //   document.body.addEventListener("htmx:configRequest", (e) => {
    //     e.detail.parameters["like"] = false;
    //   });
    // }
  }

  async getInitialLikes() {
    const req = await fetch(`${this.#postUrl}totalLikes`);
    const res = await req.text();
    return res;
  }

  like() {
    // this.#icon.style.fill = "red";
    // this.#icon.style.color = "red";

    this.#messageWrapper.textContent = "";

    localStorage.setItem(`${this.#postId}-like`, true);
    // console.log(`New local storage value set for ${this.#postId}-like`);
    this.#liked = true;
    // console.log("liked?", this.#liked);

    // this.#button.setAttribute("hx-put", `${window.location.pathname}unlike`);
    // Important - process new content to make available to htmx
    // htmx.process(this.#button);
  }

  unlike() {
    // this.#icon.style.fill = "none";
    // this.#icon.style.color = "currentColor";

    this.#messageWrapper.textContent = "";

    localStorage.removeItem(`${this.#postId}-like`);
    this.#liked = null;
    // console.log("liked?", this.#liked);

    // this.#button.setAttribute("hx-put", `${window.location.pathname}like`);
    // Important - process new content to make available to htmx
    // htmx.process(this.#button);
  }

  toggleLike() {
    if (!this.#liked) {
      this.like();
    } else {
      this.unlike();
    }
  }
}

customElements.define("post-like", PostLike);
