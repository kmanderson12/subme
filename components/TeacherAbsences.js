import { useContext } from 'react';
import { UserContext } from '../lib/UserProvider';

const TeacherAbsences = props => {
  const { user, getUser } = useContext(UserContext);

  const userObj = user.users[0];

  const { name, email, users_organizations } = userObj;
  let absences = user.get_teacher_absences;
  return (
    <>
      <h2>Scheduled Absences:</h2>
      {absences.map(absence => (
        <p>{absence.date}</p>
      ))}
    </>
  );
};

export default TeacherAbsences;
