// Writes public/sitemap.xml before `next build`, with blog slugs from Strapi.
import { readFileSync, writeFileSync } from "node:fs";
import nextEnv from "@next/env";

const SITE_URL = "https://devsam.io";
const STATIC_ROUTES = ["/", "/about", "/projects", "/blog", "/playground", "/contact"];

nextEnv.loadEnvConfig(process.cwd());

const response = await fetch(process.env.STRAPI_GRAPHQL_URL, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
  },
  body: JSON.stringify({
    query: "{ blogs(pagination: { pageSize: 1000 }) { slug date } }",
  }),
});
const { data, errors } = await response.json();
if (errors || !data) {
  throw new Error(`Sitemap: Strapi query failed: ${JSON.stringify(errors)}`);
}

const playgroundSource = readFileSync("src/data/constants/playgroundTools.js", "utf8");
const playgroundSlugs = [...playgroundSource.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

const entries = [
  ...STATIC_ROUTES.map((path) => ({ path })),
  ...data.blogs.map((blog) => ({ path: `/blog/${blog.slug}`, lastmod: blog.date })),
  ...playgroundSlugs.map((slug) => ({ path: `/playground/${slug}` })),
];

const urls = entries
  .map(({ path, lastmod }) => {
    const loc = `    <loc>${SITE_URL}${path === "/" ? "" : path}</loc>`;
    const mod = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
    return `  <url>\n${loc}${mod}\n  </url>`;
  })
  .join("\n");

writeFileSync(
  "public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);
console.log(`Sitemap: wrote ${entries.length} URLs`);
