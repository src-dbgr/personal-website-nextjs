# Personal Website (Next.js)

Source for [https://devsam.io](https://devsam.io). Pages Router, React 19, Next.js 16. Content comes from a Strapi 5 GraphQL API at build time (`getStaticProps`). There is no server-side rendering of pages and no Framer Motion.

The live site may still run an older deploy until this branch is published.

The earlier Gatsby site lives at [https://github.com/src-dbgr/personal-website](https://github.com/src-dbgr/personal-website).

## Stack

- **App**: Next.js 16, React 19, Pages Router, static generation
- **Data**: Strapi 5 (GraphQL). Documents and fetchers live in `src/lib/strapi.js`. Apollo runs on the server with a no-cache store. `STRAPI_TOKEN` stays off the client.
- **Motion**: Anime.js (launch overlay, mobile menu morph), AOS (first-load nav stagger). Three.js is opt-in behind START ANIMATION.
- **Styles**: one `src/styles/globals.css`. Do not split it.
- **Contact**: Formspree via `NEXT_PUBLIC_FS_API_URL`
- **Analytics**: Google Analytics code exists, but the cookie banner is off (`COOKIE_BANNER_ENABLED = false`). gtag does not load.

A `manifest.json` is linked for icons. There is no service worker and no offline PWA runtime. Recaptcha and Google Tag Manager are not used.

## Local

Needs Node.js 20+ and a running Strapi with the matching GraphQL schema.

```
git clone https://github.com/src-dbgr/personal-website-nextjs.git
cd personal-website-nextjs
npm install
```

Create `.env.local` from the table below. Fill `STRAPI_TOKEN` and the Formspree URL. Local GraphQL is `http://127.0.0.1:1337/graphql`. Env files stay out of git.

This repo is run on port 3001 so it does not collide with another app on 3000:

```
npx next dev -p 3001
```

Open [http://localhost:3001](http://localhost:3001). `npm run develop` starts Next on the default port 3000. After Strapi SQLite writes, restart Strapi if it caches. Hard-refresh the Next app. `getStaticProps` needs a fresh request.

## Environment

Only these are read. Do not commit env files.

| Variable | Where | Notes |
| --- | --- | --- |
| `STRAPI_GRAPHQL_URL` | server | Apollo URI |
| `STRAPI_TOKEN` | server | Bearer token. Not in `next.config` `env` |
| `NEXT_PUBLIC_FS_API_URL` | browser | Contact form action |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | browser | Unused while the cookie banner is off |

`STRAPI_API_URL`, Recaptcha keys, and `NEXT_PUBLIC_GTM_ID` are not read by the app.

## Scripts

- `npx next dev -p 3001`: local app (this project)
- `npm run develop`: `next dev` on port 3000
- `npm run build` / `npm run start`: production build and server
- `npm run lint`
- `npm run analyze`: bundle analyzer (`ANALYZE=true`)
- `npm run clean`: remove `.next`

`npm run export` is a leftover. Next 16 does not use `next export`. The app is not configured as `output: 'export'`.

## Deploy

Build with `npm run build` on a host that runs Next.js. Set the same environment variables there. Do not put `STRAPI_TOKEN` in `NEXT_PUBLIC_*` or in `next.config` `env`.

## License

Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0). See [LICENSE](LICENSE).

## Contact

[https://devsam.io/contact](https://devsam.io/contact)

[https://github.com/src-dbgr/personal-website-nextjs](https://github.com/src-dbgr/personal-website-nextjs)
