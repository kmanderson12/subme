import { useContext } from 'react';
import { UserContext } from '../lib/UserProvider';

const PleaseSignIn = props => {
  const { user, getUser } = useContext(UserContext);
  if (user) {
    return props.children;
  }
  return (
    <div>
      <h1>Please sign in.</h1>
    </div>
  );
};

export default PleaseSignIn;
