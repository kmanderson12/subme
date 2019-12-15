import Head from 'next/head';
import Header from './header';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from '../lib/AuthProvider';

function Layout({ children }) {
  const { currentUser, getCurrentUser } = useContext(AuthContext);
  return (
    <>
      <Head>
        <title>SubMe</title>
      </Head>

      <Header user={currentUser} />

      <main>
        <div className="container">{children}</div>
      </main>

      <style jsx>{`
        .container {
          max-width: 50rem;
          margin: 1.5rem auto;
        }
      `}</style>
      <style jsx global>{`
        body {
          margin: 0;
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
      `}</style>
    </>
  );
}

export default Layout;
