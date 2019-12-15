import React from 'react';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import fetch from 'isomorphic-unfetch';

// those two imports should not be necessary. But can't figure out why cookies are not
// sent to apollo requests with current HttpLink's `credentials` prop value.
// some links that didn't help:
// https://github.com/apollographql/apollo-client/issues/4190
// https://github.com/apollographql/apollo-client/issues/4455
// https://github.com/apollographql/apollo-client/issues/4190
import cookie from 'js-cookie'; // TODO remove when cookie solution found

let apolloClient = null;

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 * @param {Function|Class} PageComponent
 * @param {Object} [config]
 * @param {Boolean} [config.ssr=true]
 */
export function withApollo(PageComponent, { ssr = true } = {}) {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const client = apolloClient || initApolloClient(apolloState);
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName =
      PageComponent.displayName || PageComponent.name || 'Component';

    if (displayName === 'App') {
      console.warn('This withApollo HOC only works with PageComponents.');
    }

    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async ctx => {
      const { AppTree } = ctx;

      // Initialize ApolloClient, add it to the ctx object so
      // we can use it in `PageComponent.getInitialProp`.
      const apolloClient = (ctx.apolloClient = initApolloClient());

      // Run wrapped getInitialProps methods
      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return pageProps;
        }

        // Only if ssr is enabled
        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import('@apollo/react-ssr');
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient
                }}
              />
            );
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getDataFromTree`', error);
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind();
        }
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState
      };
    };
  }

  return WithApollo;
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {Object} initialState
 */
function initApolloClient(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
}

const httpLink = new HttpLink({
  uri: process.env.HASURA_GRAPHQL_URL, // Server URL (must be absolute)
  credentials: 'include', // Additional fetch() options like `credentials` or `headers`
  fetch
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token');
  const token = cookie.get('token'); // TODO remove when cookie solution found
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 */
function createApolloClient(initialState = {}) {
  // const token =
  //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFUZEZSVU5GTkRsQ05rUkdRa1F5TVVFNU1ESTVNRFJCTWpsQ1FrUXlRelkzT0VNNU1UVXlOUSJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtdXNlci1pZCI6ImF1dGgwfDVkZWE3OWMwMTc1MzE3MGU5ZTcyN2I4OCJ9LCJuaWNrbmFtZSI6ImttYW5kZXJzb24xMiIsIm5hbWUiOiJrbWFuZGVyc29uMTJAZ21haWwuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzhmMjg2MjQ1ODUzMDFlMDQxNjM0NzE4ODM2NmMxNzBlP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGa20ucG5nIiwidXBkYXRlZF9hdCI6IjIwMTktMTItMDZUMTg6MTA6MzguNjUxWiIsImlzcyI6Imh0dHBzOi8vc3VibWUtYXV0aC5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWRlYTc5YzAxNzUzMTcwZTllNzI3Yjg4IiwiYXVkIjoiOEdsYnFhVWNMWUtFdnVUa2N4UkhWVHQ0UzFGaHQxVDQiLCJpYXQiOjE1NzU2NTU4NDAsImV4cCI6MTU3NTY5MTg0MH0.Ptc-B_SZUwHNdQe-BzgsWddBQeKuetrLVDquMORXy1gbQ-x4rh4V-k9btkSpdSmRFSH_i4wj01OqKas15BC40nMBR3yFrmdks_Bv7bXCqfFavputg0Pmsf1kHwC2trxGK3jQbt3t7t7XBfiG-mCo3V2-7rYzNJdg1dOKfsiFQbKcSB1ihfUWEVLayPHxWQxmSYIrk495bvMmP3qFDe7WQpGxgSNQ31H5SLAdtQfsF4bxfMaKIQkpDjTtfdwLixRpPzqSh46ASYlvaM9oScu6zG08MbvXg2T49PDMSW5aYp9vChyW17Rj5tdk6QuOWjVF7Tq_Zd9nXS5DQ4bH_IcNfw';
  return new ApolloClient({
    connectToDevTools: true,
    ssrMode: typeof window === 'undefined', // Disables forceFetch on the server (so queries are only run once)
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState)
  });
}
