import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { clearExercises } from '../../store/actions';

const SubmitWorkoutBtn = (props) => {
  const [error, setError] = useState({ isError: false, msg: '' });
  const { exercises } = useSelector((state) => state.workout);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.formIsValid && error)
      setError({ ...error, isError: false, msg: '' });
  }, [props.formIsValid, error]);

  const submitOnInvalidForm = () => {
    props.setInputAsTouched();
    setError({
      ...error,
      isError: true,
      msg: <p>A workout must have a name!</p>,
    });
  };

  const checkForPreviousNameUse = () => {
    axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}.json`
      )
      .then((res) => {
        for (const key in res.data) {
          if (res.data[key].name === '')
            setError({
              ...error,
              isError: true,
              msg: (
                <p>That name is already taken, please try a different name</p>
              ),
            });
        }
      });
  };

  const submitValidForm = () => {
    // axios.post(
    //   `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}.json`,
    //   {
    //     title: props.title,
    //     targetArea: props.targetArea,
    //     secondaryTarget: props.secondaryTarget,
    //     exercises,
    //   }
    // );

    // dispatch(clearExercises());

    checkForPreviousNameUse();
  };

  const onSubmit = () =>
    props.formIsValid ? submitValidForm() : submitOnInvalidForm();

  return (
    <>
      <button onClick={onSubmit}>Submit Workout</button>
      {error.isError ? error.msg : null}
    </>
  );
};

export default SubmitWorkoutBtn;
