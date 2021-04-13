import axios from 'axios';
import { useState, useEffect } from 'react';

const SubmitRoutineBtn = (props) => {
  const [error, setError] = useState({ isError: false, code: '', msg: '' });

  useEffect(() => {
    if (props.valid && error.code === 'noRoutineName')
      setError({ isError: false, msg: '', code: null });
  }, [props.valid, error]);

  useEffect(() => {
    if (props.containsWorkout() && error.code === 'noWorkouts')
      setError({ isError: false, code: '', msg: '' });
  }, [props, error]);

  const checkForPreviousNameUse = async () => {
    let nameTaken = false;
    await axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/routines/${props.userId}.json`
      )
      .then((res) => {
        for (const key in res.data) {
          if (res.data[key].title === props.title) {
            setError({
              ...error,
              isError: true,
              msg: (
                <p>
                  That routine name is already taken, please try a different
                  name
                </p>
              ),
              code: 'nameTaken',
            });
            nameTaken = true;
          }
        }
      });

    return nameTaken;
  };

  const onSubmit = async () => {
    if (!props.containsWorkout()) {
      setError({
        isError: true,
        code: 'noWorkouts',
        msg: <p>A routine must contain at least one workout</p>,
      });
      return;
    }

    if (!props.valid) {
      setError({
        isError: true,
        code: 'noRoutineName',
        msg: <p>A routine must have a title</p>,
      });
      return;
    }

    if (await checkForPreviousNameUse()) return;

    axios.post(
      `https://workout-81691-default-rtdb.firebaseio.com/routines/${props.userId}.json`,
      {
        title: props.title,
        workouts: props.workouts,
      }
    );

    props.history.push(`/my-profile`);
  };

  return (
    <>
      <button onClick={onSubmit}>Create Routine</button>
      {error.isError ? error.msg : null}
    </>
  );
};

export default SubmitRoutineBtn;
