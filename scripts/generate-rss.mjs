// Writes public/rss.xml before `next build`, with the blog posts from Strapi.
import { writeFileSync } from "node:fs";
import nextEnv from "@next/env";

const SITE_URL = "https://devsam.io";
const TITLE = "Samuel IT – Blog";
const DESCRIPTION =
  "Articles on distributed systems, software architecture, security and AI agents.";

nextEnv.loadEnvConfig(process.cwd());

const response = await fetch(process.env.STRAPI_GRAPHQL_URL, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
  },
  body: JSON.stringify({
    query:
      '{ blogs(pagination: { pageSize: 1000 }, sort: ["date:desc"]) { slug title desc date category } }',
  }),
});
const { data, errors } = await response.json();
if (errors || !data) {
  throw new Error(`RSS: Strapi query failed: ${JSON.stringify(errors)}`);
}

const escape = (text) =>
  String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
// Strapi dates are YYYY-MM-DD; RSS wants RFC 822.
const rfc822 = (date) => new Date(`${date}T00:00:00Z`).toUTCString();

const items = data.blogs
  .map((blog) => {
    const link = `${SITE_URL}/blog/${blog.slug}`;
    const category = blog.category
      ? `\n      <category>${escape(blog.category)}</category>`
      : "";
    return `    <item>
      <title>${escape(blog.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escape(blog.desc)}</description>
      <pubDate>${rfc822(blog.date)}</pubDate>${category}
    </item>`;
  })
  .join("\n");

// Newest post date, not the build time: the feed only changes with content.
const lastBuild = data.blogs[0]
  ? `\n    <lastBuildDate>${rfc822(data.blogs[0].date)}</lastBuildDate>`
  : "";

writeFileSync(
  "public/rss.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escape(DESCRIPTION)}</description>
    <language>en</language>${lastBuild}
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
);
console.log(`RSS: wrote ${data.blogs.length} items`);
