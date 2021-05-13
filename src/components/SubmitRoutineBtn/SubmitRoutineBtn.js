import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchActiveRoutine } from '../../store/actions';

const SubmitRoutineBtn = (props) => {
  const [error, setError] = useState({ isError: false, code: '', msg: '' });
  const dispatch = useDispatch();

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

  const redirectToMyProfile = () => {
    props.history.push({
      pathname: '/my-profile',
      state: {
        message: props.createNewRoutine ? 'Routine created' : 'Routine Updated',
      },
    });
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

    if (
      props.createNewRoutine ||
      (props.titleChanged && !props.originalTitleEntact)
    )
      if (await checkForPreviousNameUse()) return;

    await axios({
      method: props.createNewRoutine ? 'post' : 'put',
      url: props.createNewRoutine
        ? `https://workout-81691-default-rtdb.firebaseio.com/routines/${props.userId}.json`
        : `https://workout-81691-default-rtdb.firebaseio.com/routines/${props.userId}/${props.firebaseId}.json`,
      timeout: 5000,
      data: {
        title: props.title,
        workouts: props.workouts,
        activeRoutine: props.isActiveRoutine,
      },
    })
      .then(() => {
        if (props.isActiveRoutine) dispatch(fetchActiveRoutine(props.userId));
        redirectToMyProfile();
      })
      .catch((err) =>
        setError({
          ...error,
          isError: true,
          code: 'axios',
          msg: (
            <p style={{ color: 'red' }}>
              We weren't able to create this workout, please try agian
            </p>
          ),
        })
      );
  };

  return (
    <>
      <button onClick={onSubmit}>
        {props.createNewRoutine ? 'Create new routine' : 'Edit routine'}
      </button>
      {error.isError ? error.msg : null}
    </>
  );
};

export default SubmitRoutineBtn;
