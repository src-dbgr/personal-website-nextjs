// WebMCP tools (https://webmachinelearning.github.io/webmcp/): lets an AI
// agent in the visitor's browser query the portfolio and open its pages.
// Loaded only where the browser supports WebMCP (see _app.js), so normal
// visitors never download it.
//
// Scope: public portfolio content only (profile, blog, projects,
// playground). The legal notice and the privacy policy are deliberately
// not exposed: no tool returns or opens them.
import Router from "next/router";
import siteMetadata from "../../seo.config";
import playgroundTools from "../data/constants/playgroundTools";

const { siteUrl } = siteMetadata;

// Pages the agent may open (legal and privacy are left out on purpose).
const PAGES = {
  home: "/",
  about: "/about",
  projects: "/projects",
  blog: "/blog",
  playground: "/playground",
  contact: "/contact",
};

let dataPromise = null;
// Blog posts and projects, written at build time (generate-agent-data.mjs).
const loadData = () => {
  dataPromise ??= fetch("/agent-data.json").then((response) => {
    if (!response.ok) throw new Error(`agent-data.json: ${response.status}`);
    return response.json();
  });
  // A failed load may be retried on the next call.
  dataPromise.catch(() => {
    dataPromise = null;
  });
  return dataPromise;
};

const text = (value) => JSON.stringify(value, null, 2);
const includesAll = (haystack, words) =>
  words.every((word) => haystack.includes(word));
const wordsOf = (value) =>
  String(value || "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

const playground = () =>
  playgroundTools.map((tool) => ({
    slug: tool.slug,
    title: tool.title,
    summary: tool.desc,
    category: tool.category,
    url: `${siteUrl}/playground/${tool.slug}`,
  }));

const TOOLS = [
  {
    name: "get_profile",
    description:
      "Who runs this site: name, role, fields of expertise, profile links, CV (PDF) and how to get in touch.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () =>
      text({
        name: "Samuel",
        role: siteMetadata.jobTitle,
        summary: siteMetadata.description,
        expertise: siteMetadata.knowsAbout,
        profiles: siteMetadata.sameAs,
        cv: `${siteUrl}/samuel-resume-en.pdf`,
        contact: `${siteUrl}/contact`,
        website: siteUrl,
      }),
  },
  {
    name: "search_blog",
    description:
      "Search the blog posts (distributed systems, architecture, security, AI agents). Matches all words of the query in title, summary or category. Without a query it lists the newest posts. Returns title, summary, date, category and URL.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Words to look for, e.g. \"MCP agents\". Optional.",
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 20,
          description: "Maximum number of posts (default 5).",
        },
      },
    },
    annotations: { readOnlyHint: true },
    execute: async ({ query, limit } = {}) => {
      const { blog } = await loadData();
      const words = wordsOf(query);
      const max = Math.min(Math.max(Number(limit) || 5, 1), 20);
      const hits = blog.filter((post) =>
        includesAll(
          `${post.title} ${post.summary} ${post.category}`.toLowerCase(),
          words,
        ),
      );
      return text({ total: hits.length, posts: hits.slice(0, max) });
    },
  },
  {
    name: "list_projects",
    description:
      "List the portfolio projects with description, technologies and links (website, GitHub). Optionally only projects using a given technology.",
    inputSchema: {
      type: "object",
      properties: {
        technology: {
          type: "string",
          description: "Only projects using this technology, e.g. \"rust\". Optional.",
        },
      },
    },
    annotations: { readOnlyHint: true },
    execute: async ({ technology } = {}) => {
      const { projects } = await loadData();
      const wanted = String(technology || "").trim().toLowerCase();
      const hits = wanted
        ? projects.filter((project) =>
            project.technologies.some((tech) =>
              tech.toLowerCase().includes(wanted),
            ),
          )
        : projects;
      return text({ total: hits.length, projects: hits });
    },
  },
  {
    name: "list_playground_tools",
    description:
      "List the interactive tools in the playground (machine learning and AI evaluation) with a short description and URL.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => text({ tools: playground() }),
  },
  {
    name: "open_page",
    description:
      "Open a page of this site in the current tab: home, about, projects, blog, playground or contact; or a single blog post or playground tool by its slug (from search_blog or list_playground_tools).",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "string",
          enum: Object.keys(PAGES),
          description: "Section to open.",
        },
        slug: {
          type: "string",
          description:
            "With page \"blog\" or \"playground\": the slug of a post or tool. Optional.",
        },
      },
      required: ["page"],
    },
    execute: async ({ page, slug } = {}) => {
      if (!Object.hasOwn(PAGES, page)) {
        return `Unknown page "${page}". Use one of: ${Object.keys(PAGES).join(", ")}.`;
      }
      let path = PAGES[page];
      if (slug) {
        const known =
          page === "blog"
            ? (await loadData()).blog.some((post) => post.slug === slug)
            : page === "playground" &&
              playgroundTools.some((tool) => tool.slug === slug);
        if (!known) return `No ${page} entry with slug "${slug}".`;
        path = `${path}/${slug}`;
      }
      await Router.push(path);
      return `Opened ${siteUrl}${path === "/" ? "" : path}`;
    },
  },
];

// Registers all tools; aborting `signal` removes them again.
export function registerTools(modelContext, signal) {
  for (const tool of TOOLS) {
    // registerTool may return a promise; a rejected registration (e.g. an
    // older API version) must not surface as an unhandled error.
    Promise.resolve()
      .then(() => modelContext.registerTool(tool, { signal }))
      .catch(() => {});
  }
}
