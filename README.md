# Personal Website - Next.js Edition

## Overview

This repository contains the source code for my personal website, built with Next.js. It's a modern, responsive web application showcasing my portfolio, blog, and professional experience. Originally built with Gatsby, this project has been successfully migrated to Next.js to take advantage of its enhanced features and performance capabilities.

The live version of this website can be accessed at [https://devsam.io](https://devsam.io).

## Project History

This Next.js project is the evolved version of my original Gatsby-based personal website. The Gatsby version, which served as the foundation for this project, can be found at:

[https://github.com/src-dbgr/personal-website](https://github.com/src-dbgr/personal-website)

The migration from Gatsby to Next.js was undertaken to leverage Next.js's enhanced features, improved performance, and better alignment with my current development needs.

While the core content and purpose remain the same, this Next.js version incorporates several improvements and new features that were not present in the original Gatsby site.

## Key Features

- **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** for optimal performance and SEO
- **GraphQL integration** with Apollo Client for efficient data fetching
- **Dynamic content management** via Strapi Headless CMS
- **Responsive design** with custom CSS
- **Interactive animations** using Framer Motion and Anime.js
- **3D graphics** with Three.js and React Three Fiber
- **Progressive Web App (PWA)** capabilities

## Tech Stack

- **Frontend**: Next.js, React
- **State Management**: Apollo Client
- **CMS**: Strapi (Headless CMS)
- **Animations**: Framer Motion, Anime.js
- **3D Graphics**: Three.js, React Three Fiber
- **Deployment**: Flexible (currently deployed on Netlify)
- **Version Control**: Git, GitHub
- **Analytics**: Google Analytics, Google Tag Manager

## Getting Started

### Prerequisites

- Node.js (version compatible with Next.js 14.2.6)
- npm or yarn
- Strapi instance (for backend) - **Required for local development**

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/src-dbgr/personal-website-nextjs.git
   cd personal-website-nextjs
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create `.env.local` and `.env.production` files in the root directory and add the following variables to both:
   ```
   NEXT_PUBLIC_FS_API_URL=<form-spree-api-url>
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<google-recaptcha-site-key>
   STRAPI_GRAPHQL_URL=http://127.0.0.1:1337/graphql
   STRAPI_API_URL=http://127.0.0.1:1337/api
   STRAPI_TOKEN=<strapi-token>
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=<google-analytics-id>
   NEXT_PUBLIC_GTM_ID=<google-tag-manager-id>
   ```
   Note: Adjust the URLs and tokens as necessary for your local and production environments.

4. Run the development server:
   ```
   npm run develop
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Important Notes for Development

### Strapi Backend Dependency
This application is designed to work with a specific Strapi backend configuration. The GraphQL queries in the codebase expect a particular data structure. As the Strapi backend is not included in this repository, developers who wish to run this project locally or adapt it for their own use should be aware of the following:

1. The project requires a running Strapi instance with a matching data structure.
2. GraphQL queries in the codebase are tailored to the original Strapi setup.
3. If you're setting up your own Strapi instance, you may need to modify the GraphQL queries to match your data structure.
4. Examine the GraphQL queries in the codebase to understand the expected data format.

We encourage developers to use this project as a reference or starting point, adapting the Strapi setup and GraphQL queries as needed for their specific use cases.

## Additional Scripts

- `npm run build`: Build the Next.js application
- `npm run start`: Start the production server
- `npm run export`: Export the application as static HTML
- `npm run lint`: Run ESLint for code quality
- `npm run update-check`: Check for package updates
- `npm run update`: Update packages to their latest versions
- `npm run clean`: Remove the `.next` directory
- `npm run clean-cache`: Clean npm cache
- `npm run clean-install`: Perform a clean installation of dependencies

## Deployment

This project is flexible and can be deployed on various platforms. It's currently deployed on Netlify, but can be easily adapted for other hosting services like Vercel, GitHub Pages, or any platform supporting Next.js applications.

For deployment on Netlify:

1. Connect your GitHub repository to Netlify
2. Set the build command to `npm run build`
3. Set the publish directory to `out`
4. Configure your environment variables in Netlify's settings

## Progressive Web App (PWA) Features

This website is configured as a Progressive Web App, offering enhanced capabilities on supported devices:

- **Installable**: Can be added to the home screen for quick access
- **Offline Support**: Basic functionality available without an internet connection
- **Responsive Design**: Adapts to various screen sizes and orientations
- **Theme Colors**: Custom theme color (#3d8b68) and background color (#b5aba6)

## Contributing

While this is primarily a personal project, I welcome suggestions and feedback for non-commercial purposes. Please feel free to open an issue or submit a pull request, keeping in mind the project's license terms.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) License. For more details, see the [LICENSE](LICENSE) file in the repository.

## Contact

src-dbgr - https://devsam.io/contact

Project Link: [https://github.com/yourusername/personal-website-nextjs](https://github.com/yourusername/personal-website-nextjs)

---

Built with ❤️ using Next.js
