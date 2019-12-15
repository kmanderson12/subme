import React from 'react';
import { withApollo } from '../lib/apollo';
import Layout from '../components/layout';

function Index() {
  return (
    <>
      <h1>Hey there! Let's try this again!</h1>
    </>
  );
}

export default withApollo(Index);
