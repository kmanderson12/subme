import { createContext, useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AuthContext } from '../lib/AuthProvider';
import UnauthenticatedApp from '../components/UnauthenticatedApp';
import AuthenticatedApp from '../components/AuthenticatedApp';

const UserContext = createContext();

const UserContextProvider = UserContext.Provider;

// 1. Use Context to get AuthContext
// 2. Query User data based on that context
// 3. Use function to add queried data to UserContext

export const CURRENT_USER_QUERY = gql`
  query users_by_pk($id: String!) {
    users_by_pk(auth0_id: $id) {
      name
      email
      last_seen
      users_organizations {
        id
        user_id
        organization {
          name
        }
      }
    }
  }
`;

function UserProvider({ children }) {
  const { currentUser, getCurrentUser } = useContext(AuthContext);
  const sub = currentUser ? currentUser.user.sub : null;
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY, {
    variables: {
      id: sub
    }
  });
  const [user, setUser] = useState({
    user: data
  });

  function getUser() {
    setUser({
      user: data
    });
  }

  return loading ? (
    <div>
      <h1>Pretend this is a full page spinner.</h1>
    </div>
  ) : currentUser ? (
    // AuthenticatedApp with UserQuery
    <UserContextProvider value={{ user: data }}>
      <AuthenticatedApp>{children}</AuthenticatedApp>
    </UserContextProvider>
  ) : (
    // UnauthenticatedApp without UserQuery
    <UserContextProvider value={{ user: null }}>
      <UnauthenticatedApp>{children}</UnauthenticatedApp>
    </UserContextProvider>
  );
}

export { UserProvider, UserContext, UserContextProvider };
