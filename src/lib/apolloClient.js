import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

// HTTP-Verbindung zu deinem GraphQL-Endpunkt
const httpLink = createHttpLink({
  uri: process.env.STRAPI_GRAPHQL_URL
});

// Auth-Link, der den Token zu jeder Anfrage hinzufügt
const authLink = setContext((_, { headers }) => {
  const token = process.env.STRAPI_TOKEN;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      About: {
        // Hier sagen wir Apollo, dass "documentId" das eindeutige Feld ist.
        keyFields: ["documentId"]
      },
      Query: {
        fields: {
          about: {
            // Überschreibt bestehende Daten bei erneutem Fetch.
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
      BlogEntity: {
        fields: {
          attributes: {
            merge(existing, incoming) {
              return { ...existing, ...incoming };
            }
          }
        }
      }
    },
  }),
  connectToDevTools: process.env.NODE_ENV === 'development',
});

export default apolloClient;