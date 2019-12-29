import { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { createPortal } from 'react-dom';

const SUB_SCHEDULE_QUERY = gql`
  query get_fulfilled_absences {
    get_fulfilled_absences {
      organization
      teacher
      date
      substitute
    }
  }
`;

const SubstituteSchedule = props => {
  const { loading, error, data } = useQuery(SUB_SCHEDULE_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  let scheduleArray = data.get_fulfilled_absences;
  console.log(scheduleArray);
  return (
    <>
      <h2>Sub Schedule:</h2>
      {scheduleArray.length > 0 ? (
        <>
          {scheduleArray.map(d => (
            <>
              <p>
                {d.date} for {d.teacher}
              </p>
            </>
          ))}
        </>
      ) : (
        <p>Looks like there's nothing on the calendar.</p>
      )}
    </>
  );
};

export default SubstituteSchedule;
