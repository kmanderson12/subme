import { useContext } from 'react';
import gql from 'graphql-tag';
import { withApollo } from '../lib/apollo';
import { UserContext } from '../lib/UserProvider';

function CurrentUser({ children }) {
  const { user, getUser } = useContext(UserContext);
  const userObj = user.users_by_pk;
  const { name, email } = userObj;
  return user ? (
    <div>
      <h1>Welcome, {name}!</h1>
    </div>
  ) : (
    <p>Please sign in.</p>
  );
}

export default withApollo(CurrentUser);
