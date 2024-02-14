import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://dktuivrfnfjipbenfodp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdHVpdnJmbmZqaXBiZW5mb2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1NDcyMTUsImV4cCI6MjAyMjEyMzIxNX0.sj-zrNHdvhqj-MhKdlglFu9cBYvWq80-4ff3SCSVC2M"
);

export class PostLike extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const url = new URL(window.location).pathname;
    const postId = this.getAttribute("data-postId");
    console.log(postId);

    const postLikes = await this.getLikes(postId);

    const button = document.createElement("button");
    button.setAttribute("hx-post", `${url}likes`);
    button.setAttribute("hx-swap", "outerHTML swap:0.2s settle:0.2s");
    button.setAttribute("id", url);
    button.textContent =
      postLikes === 1 ? `${postLikes} Like` : `${postLikes} Likes`;

    shadow.appendChild(button);
  }

  async getLikes(postId) {
    const { data, error } = await supabase
      .from("posts_with_total_likes")
      .select()
      .eq("url", postId)
      .single();
    console.log(data);

    return `${data.total_likes}`;
  }
}

customElements.define("post-like", PostLike);
