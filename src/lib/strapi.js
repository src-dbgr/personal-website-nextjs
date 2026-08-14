import { gql } from "@apollo/client";
import apolloClient from "./apolloClient";

export const GET_HOME_PAGE = gql`
  query GetHomePage {
    blogs(sort: "date:desc", pagination: { limit: 3 }) {
      date
      slug
      desc
      title
      category
      createdAt
      image {
        url
      }
      documentId
    }
    projects(filters: { featured: { eq: true } }, sort: "orderid:asc") {
      title
      description
      image {
        url
      }
      github
      url
      stack {
        id
        title
      }
      orderid
    }
    about {
      documentId
      infomain
      stack {
        id
        title
      }
    }
    jobs(sort: "id:desc") {
      company
      short_company
      date
      desc {
        id
        name
      }
      position
      documentId
    }
  }
`;

export const GET_ABOUT_PAGE = gql`
  query GetAboutPage {
    about {
      documentId
      title
      stack {
        id
        title
      }
      info
    }
    stations(
      pagination: { pageSize: 1000 }
      sort: "Order_Id:desc"
      filters: { Activated: { eq: true } }
    ) {
      Date
      Description
      From_Month
      From_Year
      Order_Id
      To_Month
      To_Year
      To_Text
      Graduation
      Institution
      stack {
        id
        title
      }
      urls {
        id
        title
        url
      }
      stationctgry {
        title
        description
        icon {
          url
          mime
        }
      }
    }
    stationctgries {
      title
      description
      icon {
        mime
        url
      }
    }
    techstacks(pagination: { pageSize: 1000 }, filters: { active: { eq: true } }) {
      skilldescription
      imgfilename
      skilltitle
      techurl
      imgurl
      categorylabel
    }
  }
`;

export const GET_BLOGS = gql`
  query GetBlogs {
    blogs(pagination: { pageSize: 1000 }, sort: ["date:desc"]) {
      slug
      desc
      date
      title
      category
      documentId
      image {
        url
      }
    }
  }
`;

export const GET_BLOG_BY_SLUG = gql`
  query GetBlogBySlug($slug: String!) {
    blogs(filters: { slug: { eq: $slug } }) {
      content
      title
      desc
      slug
      documentId
    }
  }
`;

export const GET_ALL_BLOGS = gql`
  query GetAllBlogs {
    blogs {
      slug
      documentId
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects {
    projects(sort: ["orderid:asc"]) {
      github
      orderid
      description
      title
      documentId
      url
      image {
        url
        caption
        name
      }
      stack {
        id
        title
      }
    }
  }
`;

export async function fetchHomePage() {
  const { data } = await apolloClient.query({
    query: GET_HOME_PAGE,
  });

  return {
    about: data.about.infomain,
    aboutStack: data.about.stack,
    blogs: data.blogs.map((blog) => ({
      id: blog.documentId,
      ...blog,
    })),
    projects: data.projects,
    jobs: data.jobs,
  };
}

export async function fetchAboutPage() {
  const { data } = await apolloClient.query({
    query: GET_ABOUT_PAGE,
  });

  return {
    about: data.about,
    stations: data.stations.map((station) => ({
      ...station,
      stationctgry: station.stationctgry,
    })),
    categories: data.stationctgries.map((category) => ({
      ...category,
      icon: category.icon,
    })),
    techstacks: data.techstacks,
  };
}

export async function fetchBlogs() {
  const { data } = await apolloClient.query({
    query: GET_BLOGS,
  });

  return data.blogs.map((blog) => ({
    ...blog,
    id: blog.documentId,
  }));
}

export async function fetchBlogBySlug(slug) {
  const { data } = await apolloClient.query({
    query: GET_BLOG_BY_SLUG,
    variables: { slug },
  });

  return data.blogs[0] ?? null;
}

export async function fetchBlogPaths() {
  const { data } = await apolloClient.query({
    query: GET_ALL_BLOGS,
  });

  return data.blogs.map((blog) => ({
    params: { slug: blog.slug },
  }));
}

export async function fetchProjects() {
  const { data } = await apolloClient.query({
    query: GET_PROJECTS,
  });

  return data.projects;
}
