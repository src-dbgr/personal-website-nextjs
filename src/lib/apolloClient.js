import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

// HTTP-Verbindung zu deinem GraphQL-Endpunkt
const httpLink = createHttpLink({
    uri: process.env.STRAPI_GRAPHQL_URL
  });
  
  // Auth-Link, der den Token zu jeder Anfrage hinzufügt
  const authLink = setContext((_, { headers }) => {
    // Hole das Token aus dem lokalen Speicher oder einer anderen Quelle
    const token = process.env.STRAPI_TOKEN
  
    // Rückgabe der Header, inklusive des Authorization-Headers
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    };
  });

  const apolloClient = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
  });

  export default apolloClient;
