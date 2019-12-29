import { createContext, useState, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AuthContext } from '../lib/AuthProvider';
import UnauthenticatedApp from '../components/UnauthenticatedApp';
import AuthenticatedApp from '../components/AuthenticatedApp';

const UserContext = createContext();

const UserContextProvider = UserContext.Provider;

// TODO: Create multiple views in Hasura that contain auth0id that can return "flattened" data
export const CURRENT_USER_QUERY = gql`
  query users {
    users {
      name
      email
      last_seen
      users_organizations {
        id
        user_id
        organization {
          name
        }
        role {
          role
        }
      }
    }
    get_teacher_absences {
      name
      organization
      date
    }
  }
`;

function UserProvider({ children }) {
  const { currentUser, getCurrentUser } = useContext(AuthContext);
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);
  const [user, setUser] = useState({
    user: data
  });
  //TODO: Destructure and organize data in Provider to make it easily accessible

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
