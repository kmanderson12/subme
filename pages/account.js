import React from 'react';
import { withApollo } from '../lib/apollo';
import Layout from '../components/layout';
import CurrentUser from '../components/CurrentUser';
import PleaseSignIn from '../components/PleaseSignIn';

function Account() {
  return (
    <PleaseSignIn>
      <CurrentUser />
    </PleaseSignIn>
  );
}

export default withApollo(Account);
