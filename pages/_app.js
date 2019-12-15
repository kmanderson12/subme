import React from 'react';
import App from 'next/app';
import { withApollo } from '../lib/apollo';
import { AuthProvider } from '../lib/AuthProvider';
import { UserProvider } from '../lib/UserProvider';
import '../css/tailwind.css';
import Layout from '../components/layout';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // this exposes the query to the user.
    pageProps.query = ctx.query;
    return { pageProps };
  }
  render() {
    const { Component, pageProps, router } = this.props;

    return (
      <AuthProvider>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </AuthProvider>
    );
  }
}

export default withApollo(MyApp);
