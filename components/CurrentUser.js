import { useContext } from 'react';
import gql from 'graphql-tag';
import _ from 'lodash';
import { withApollo } from '../lib/apollo';
import { UserContext } from '../lib/UserProvider';

// Consider putting basic info destructured in context

function CurrentUser({ children }) {
  const { user, getUser } = useContext(UserContext);

  const userObj = user.users[0];

  const { name, email, users_organizations, teachers } = userObj;
  let absences = teachers[0].teacher_absences;
  return user ? (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>{email}</p>
      <h2>Organizations:</h2>
      {users_organizations.map(org => {
        let role = _.capitalize(org.role.role);
        let orgName = org.organization.name;
        return (
          <>
            <p key={org.id}>
              {orgName} - {role}
            </p>
          </>
        );
      })}
      <h2>Scheduled Absences:</h2>
      {absences.map(absence => (
        <p>{absence.date}</p>
      ))}
    </div>
  ) : (
    <p>Please sign in.</p>
  );
}

export default withApollo(CurrentUser);
