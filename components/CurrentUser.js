import { useContext } from 'react';
import gql from 'graphql-tag';
import _ from 'lodash';
import { withApollo } from '../lib/apollo';
import { UserContext } from '../lib/UserProvider';
import PleaseSignIn from '../components/PleaseSignIn';
import TeacherAbsences from '../components/TeacherAbsences';
import SubstituteSchedule from './SubstituteSchedule';

// Consider putting basic info destructured in context

function CurrentUser({ children }) {
  const { user, getUser } = useContext(UserContext);

  const userObj = user.users[0];

  const { name, email, users_organizations } = userObj;
  return (
    <PleaseSignIn>
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
              {role === 'Teacher' ? (
                <TeacherAbsences />
              ) : (
                <SubstituteSchedule />
              )}
            </>
          );
        })}
      </div>
    </PleaseSignIn>
  );
}

export default withApollo(CurrentUser);
