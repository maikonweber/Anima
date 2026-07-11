/** Re-export do catálogo de posts (App Router / sitemap / schema). */
export {
  allBlogPosts,
  blogPosts,
  blogPostsEn,
  blogPostsPt,
  getPostBySlug,
  getPostsByLocale,
  postLocale,
  postToc,
  sectionBlocks,
} from "./posts/index";
export type {
  BlogBlock,
  BlogCta,
  BlogFaqItem,
  BlogPost,
  BlogSection,
} from "./posts/types";
