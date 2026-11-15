// Writes public/agent-data.json before `next build`: the blog posts and
// projects from Strapi, for the WebMCP tools (src/lib/webmcp.js). Only
// public portfolio content; no legal or privacy pages.
import { writeFileSync } from "node:fs";
import nextEnv from "@next/env";

const SITE_URL = "https://devsam.io";

nextEnv.loadEnvConfig(process.cwd());

const response = await fetch(process.env.STRAPI_GRAPHQL_URL, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
  },
  body: JSON.stringify({
    query: `{
      blogs(pagination: { pageSize: 1000 }, sort: ["date:desc"]) { slug title desc date category }
      projects(sort: ["orderid:asc"]) { title description url github stack { title } }
    }`,
  }),
});
const { data, errors } = await response.json();
if (errors || !data) {
  throw new Error(`Agent data: Strapi query failed: ${JSON.stringify(errors)}`);
}

// Strapi uses "none" (or nothing) where a project has no link.
const link = (url) => (url && /^https?:\/\//.test(url) ? url : undefined);

const blog = data.blogs.map((post) => ({
  slug: post.slug,
  title: post.title,
  summary: post.desc,
  date: post.date,
  category: post.category,
  url: `${SITE_URL}/blog/${post.slug}`,
}));

const projects = data.projects.map((project) => ({
  title: project.title,
  description: project.description,
  technologies: (project.stack || []).map((item) => item.title),
  url: link(project.url),
  github: link(project.github),
}));

writeFileSync("public/agent-data.json", JSON.stringify({ blog, projects }));
console.log(
  `Agent data: wrote ${blog.length} posts, ${projects.length} projects`
);
