import { ApolloProvider } from '@apollo/client';
import apolloClient from './apolloClient';

const ApolloProviderWrapper = ({ children }) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
