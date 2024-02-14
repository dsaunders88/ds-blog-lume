// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// import { splitUrl } from "../utils/splitUrl.js";

// const supabase = createClient(
//   "https://dktuivrfnfjipbenfodp.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdHVpdnJmbmZqaXBiZW5mb2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1NDcyMTUsImV4cCI6MjAyMjEyMzIxNX0.sj-zrNHdvhqj-MhKdlglFu9cBYvWq80-4ff3SCSVC2M"
// );

// async function getDefaultLikes() {
//   // const supabaseRoute = `https://dktuivrfnfjipbenfodp.supabase.co/rest/v1/posts_with_total_likes?url=eq.${postId}&select=*&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdHVpdnJmbmZqaXBiZW5mb2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY1NDcyMTUsImV4cCI6MjAyMjEyMzIxNX0.sj-zrNHdvhqj-MhKdlglFu9cBYvWq80-4ff3SCSVC2M`;
//   // const res = await fetch(supabaseRoute);
//   // const data = await res.json();
//   // console.log(data);
//   // const likes = data[0];
//   const { data, error } = await supabase
//     .from("posts_with_total_likes")
//     .select();
//   console.log(data);

//   if (error) {
//     return `0`;
//   }

//   return data;
// }

// const likesData = await getDefaultLikes();
// export const list = likesData;
