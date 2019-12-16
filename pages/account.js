import React from 'react';
import { withApollo } from '../lib/apollo';
import Layout from '../components/layout';
import CurrentUser from '../components/UserData';

function Account() {
  return (
    <>
      <CurrentUser />
    </>
  );
}

export default withApollo(Account);
