This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


test queries:
https://studio.apollographql.com/sandbox/explorer

-> http://127.0.0.1:1337/graphql

Schritte zum Starten der statischen Website mit serve
npm install -g serve
serve out

---

Wenn du keinen statischen Export machen möchtest und stattdessen den vollständigen Next.js-Server mit dynamischen Funktionen verwenden willst, musst du die output: 'export'-Konfiguration aus deiner next.config.mjs entfernen. Dadurch kannst du die Vorteile der serverseitigen Funktionen von Next.js nutzen, wie z.B. SSR (Server-Side Rendering) und ISR (Incremental Static Regeneration).

Schritte zum Entfernen des statischen Exports und Verwenden des Next.js-Servers
Entferne die output: 'export'-Konfiguration:

Öffne deine next.config.mjs und entferne oder kommentiere die output: 'export'-Option:

javascript
Code kopieren
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'res.cloudinary.com' },
    ],
    // unoptimized: true, // Entferne diese Zeile, wenn du die integrierte Bildoptimierung nutzen möchtest
  },
  env: {
    STRAPI_GRAPHQL_URL: process.env.STRAPI_GRAPHQL_URL,
    STRAPI_TOKEN: process.env.STRAPI_TOKEN,
  },
  // output: 'export', // Entferne oder kommentiere diese Zeile
};

export default nextConfig;
Überprüfe getStaticProps und getStaticPaths:

Stelle sicher, dass du die revalidate-Eigenschaft in deinen getStaticProps- und getStaticPaths-Funktionen verwenden kannst, falls notwendig, um ISR zu nutzen:

javascript
Code kopieren
export async function getStaticProps() {
  const data = await fetchData();

  return {
    props: {
      data,
    },
    revalidate: 10, // ISR aktivieren, falls benötigt
  };
}
Baue das Projekt:

Führe den Build-Prozess aus:

sh
Code kopieren
npm run build
Starte den Next.js-Server:

Nach dem Build kannst du den Next.js-Server im Produktionsmodus starten:

sh
Code kopieren
npm run start
Zusammenfassung
Durch das Entfernen von output: 'export' und der Option unoptimized: true in der next.config.mjs kannst du den vollen Funktionsumfang des Next.js-Servers nutzen, einschließlich SSR und ISR. Hier sind die Schritte zusammengefasst:

Entferne output: 'export' und unoptimized: true aus deiner next.config.mjs.
Baue das Projekt mit npm run build.
Starte den Produktionsserver mit npm run start.
Beispiel next.config.mjs ohne statischen Export
javascript
Code kopieren
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'res.cloudinary.com' },
    ],
  },
  env: {
    STRAPI_GRAPHQL_URL: process.env.STRAPI_GRAPHQL_URL,
    STRAPI_TOKEN: process.env.STRAPI_TOKEN,
  },
};

export default nextConfig;
Mit dieser Konfiguration kannst du alle dynamischen Features von Next.js nutzen und den Server wie gewohnt starten und betreiben.


Um deine Next.js-Website live zu schalten und sicherzustellen, dass die Daten zur Build-Zeit aus GraphQL abgefragt und nicht zur Laufzeit verwendet werden, kannst du die folgenden Schritte befolgen:

1. Daten zur Build-Zeit abrufen
Verwende getStaticProps und getStaticPaths, um die Daten zur Build-Zeit abzurufen. Dadurch wird sicherstellt, dass die Daten nur während des Builds abgefragt und nicht zur Laufzeit erneut abgefragt werden.

3. Website bereitstellen
Es gibt verschiedene Möglichkeiten, eine Next.js-Website live zu schalten. Hier sind einige beliebte Optionen:

Option 1: Vercel

Vercel ist die einfachste und empfohlene Methode, um eine Next.js-Website bereitzustellen. Vercel bietet eine direkte Integration mit GitHub, GitLab und Bitbucket.

Repository zu Vercel hinzufügen:

Gehe zu Vercel.
Melde dich an und importiere dein Repository.
Umgebungsvariablen konfigurieren:

Füge deine Umgebungsvariablen (STRAPI_GRAPHQL_URL und STRAPI_TOKEN) in den Vercel-Projekteinstellungen hinzu.
Deploy:

Klicke auf "Deploy" und Vercel wird deine Anwendung automatisch bauen und bereitstellen.



# ACHTUNG - useQuery vs getStaticProps

Wenn man auf GraphQl Queries nach dem Deployment verzichten will, weil keine GraphQl Schnittstelle zur verfügung steht, darf man nicht useQuery verwenden, sondern muss mit getStaticProps() Arbeiten, das nachfolgende beispiel zeigt wie es NICHT gemacht werden soll.

*WICHTIG* getStaticProps() darf aber nur aus pages heraus getriggert werden! man kann das nicht in Komponenten selbst verwenden, sondern muss es in der page aufrufen und an die Komponente mittels props weitergeben!


```
const GET_PROJECTS = gql`
    query Techstacks {
        projects(sort: ["orderid:asc"]) {
        data {
            attributes {
            github
            orderid
            description
            title
            url
            image {
                data {
                attributes {
                    url
                }
                }
            }
            stack {
                id
                title
            }
            }
        }
        }
    }
`;

const ProjectsPage = () => {
  const { loading, error, data } = useQuery(GET_PROJECTS, {
    variables: { sort: 'orderid:asc' },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const projects = data.projects.data.map(project => ({
    ...project.attributes,
  }));

```
---

# Deployment von Next.js auf Netlify -> https://sblm.netlify.app/ -> https://devsam.io

Diese Anleitung beschreibt, wie du deine Next.js-App auf Netlify deployen kannst.

## Schritte zum Deployment

### 1. Verbinde dein Repository mit Netlify

- Gehe zu deinem Netlify-Dashboard.
- Klicke auf "New site from Git".
- Wähle das Repository deiner Next.js-App aus.

### 2. Setze die Build- und Veröffentlichungs-Einstellungen

- **Build Command**: `npm run build`
- **Publish Directory**: `.next`

### 3. Umgebungsvariablen hinzufügen

Füge die notwendigen Umgebungsvariablen zu deinem Netlify-Projekt hinzu:

1. Gehe zu "Site settings" > "Build & deploy" > "Environment" > "Environment variables".
2. Füge die folgenden Variablen hinzu:

    - **NEXT_PUBLIC_STRAPI_API_URL**: Die Basis-URL deines Strapi-Servers.
    - **STRAPI_GRAPHQL_URL**: Die vollständige URL zu deinem GraphQL-Endpunkt (z.B. `https://<your-strapi-service-name>.onrender.com/graphql`).
    - **STRAPI_TOKEN**: Dein Strapi-API-Token.

Beispiel:

- **NEXT_PUBLIC_STRAPI_API_URL** = `https://<your-strapi-service-name>.onrender.com`
- **STRAPI_GRAPHQL_URL** = `https://<your-strapi-service-name>.onrender.com/graphql`
- **STRAPI_TOKEN** = `your-strapi-api-token`

FS_API_URL=<>
STRAPI_GRAPHQL_URL=https://portfolio-api-5o00.onrender.com/graphql  <- kann auch eine andere sein, wenn strapi erneut deplyed wurde, muss man anpassen.
STRAPI_API_URL=https://portfolio-api-5o00.onrender.com/api  <- kann auch eine andere sein, wenn strapi erneut deplyed wurde, muss man anpassen.
Call:
````
https://portfolio-api-5o00.onrender.com
```
STRAPI_TOKEN=<strapi token>
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=<google analytics id>

### 4. Branch für das Deployment festlegen

Wenn du von einem bestimmten Branch deployen möchtest:

- Gehe zu deinem Netlify-Dashboard.
- Wähle dein Projekt aus.
- Gehe zu "Site settings" > "Build & deploy" > "Build settings" > "Branch to deploy".
- Gib den Namen des Branches ein, den du deployen möchtest (z.B. `main`, `development`).

### 5. Fehlerbehebung

Falls der Build fehlschlägt, überprüfe die Build-Logs auf Netlify, um die genaue Ursache zu identifizieren:

1. Gehe zu deinem Netlify-Dashboard.
2. Wähle dein Projekt aus.
3. Gehe zu "Deploys".
4. Klicke auf den letzten fehlgeschlagenen Build.
5. Überprüfe die Logs für Fehler.

## Zusammenfassung

1. **Verbinde dein Repository mit Netlify**.
2. **Setze die Build- und Veröffentlichungs-Einstellungen**.
3. **Füge notwendige Umgebungsvariablen hinzu**.
4. **Lege den Branch für das Deployment fest**.
5. **Überprüfe die Logs bei Fehlern**.
