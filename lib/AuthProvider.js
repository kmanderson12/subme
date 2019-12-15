import { createContext, useState, useContext } from 'react';
import { useFetchUserSession } from './user';

const AuthContext = createContext();

const AuthContextProvider = AuthContext.Provider;

// Need to find a way to query user data if there is a user session
function AuthProvider({ children }) {
  const { session, loading } = useFetchUserSession();
  const [currentUser, setCurrentUser] = useState({
    currentUser: session
  });

  function getUser() {
    setCurrentUser({
      currentUser: session
    });
  }

  return loading ? (
    <div>
      <h1>Pretend this is a full page spinner.</h1>
    </div>
  ) : session ? (
    // AuthenticatedApp with UserQuery
    <AuthContextProvider value={{ currentUser: session }}>
      {children}
    </AuthContextProvider>
  ) : (
    // UnauthenticatedApp without UserQuery
    <AuthContextProvider value={{ currentUser: null }}>
      {children}
    </AuthContextProvider>
  );
}

export { AuthProvider, AuthContext };
