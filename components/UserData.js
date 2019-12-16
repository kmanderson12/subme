import { useContext } from 'react';
import gql from 'graphql-tag';
import _ from 'lodash';
import { withApollo } from '../lib/apollo';
import { UserContext } from '../lib/UserProvider';

// Consider putting basic info destructured in context

function CurrentUser({ children }) {
  const { user, getUser } = useContext(UserContext);

  const userObj = user
    ? user.users_by_pk
    : { user: { name: null, email: null } };

  console.log(userObj);
  const { name, email, users_organizations } = userObj;

  return user ? (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>{email}</p>
      <h2>Organizations:</h2>
      {users_organizations.map(org => {
        let role = _.capitalize(org.role.role);
        let orgName = org.organization.name;
        let absences = org.organization.teacher_absences;
        return (
          <>
            <p key={org.id}>
              {orgName} - {role}
            </p>
            <h2>Scheduled Absences:</h2>
            {absences.map(absence => (
              <p>{absence.date}</p>
            ))}
          </>
        );
      })}
    </div>
  ) : (
    <p>Please sign in.</p>
  );
}

export default withApollo(CurrentUser);
