import { defineMcp } from "@lovable.dev/mcp-js";
import listBlogPosts from "./tools/list-blog-posts";
import getBlogPost from "./tools/get-blog-post";
import listMaqams from "./tools/list-maqams";
import getMaqam from "./tools/get-maqam";

export default defineMcp({
  name: "ziyarath-mcp",
  title: "Ziyarath — Islamic Heritage",
  version: "0.1.0",
  instructions:
    "Read-only access to Ziyarath's public Islamic heritage content: blog articles on Islamic history and Kerala heritage, and a catalog of sacred maqams (dargahs, shrines) with locations, categories and visiting details. Use list_blog_posts / get_blog_post for articles and list_maqams / get_maqam for sacred sites.",
  tools: [listBlogPosts, getBlogPost, listMaqams, getMaqam],
});
