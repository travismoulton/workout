import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { resetWorkoutStore } from '../../store/actions';

const SubmitWorkoutBtn = (props) => {
  const [error, setError] = useState({
    isError: false,
    msg: '',
    errorCode: null,
  });
  const { exercises } = useSelector((state) => state.workout);
  const { formData } = useSelector((state) => state.workout);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.formIsValid && error.code === 'workoutNameFormError')
      setError({ ...error, isError: false, msg: '', code: null });
  }, [props.formIsValid, error]);

  const submitOnInvalidForm = () => {
    props.setInputAsTouched();
    setError({
      ...error,
      isError: true,
      msg: <p>A workout must have a name!</p>,
      code: 'workoutNameFormError',
    });
  };

  const checkForPreviousNameUse = async () => {
    let nameTaken = false;
    await axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}.json`
      )
      .then((res) => {
        for (const key in res.data) {
          if (res.data[key].title === formData.workoutName) {
            setError({
              ...error,
              isError: true,
              msg: (
                <p>That name is already taken, please try a different name</p>
              ),
              code: 'nameTaken',
            });
            nameTaken = true;
          }
        }
      });

    return nameTaken;
  };

  const submitValidForm = async () => {
    if (
      props.createNewWorkout ||
      (props.titleChanged && !props.originalTitleEntact)
    )
      if (await checkForPreviousNameUse()) return;

    const workoutData = {
      title: props.title,
      targetAreaCode: props.targetAreaCode,
      secondaryTargetCode: props.secondaryTargetCode,
      targetArea: props.targetArea,
      secondaryTargetArea: props.secondaryTargetArea,
      exercises,
    };

    props.createNewWorkout
      ? await axios.post(
          `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}.json`,
          workoutData
        )
      : await axios.put(
          `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}/${props.firebaseId}.json`,
          workoutData
        );

    dispatch(resetWorkoutStore());
    props.clearAllFormInputs();

    props.history.push({
      pathname: '/my-profile',
      state: {
        message: props.createNewWorkout ? 'Workout created' : 'Workout Updated',
      },
    });
  };

  const onSubmit = () =>
    props.formIsValid ? submitValidForm() : submitOnInvalidForm();

  return (
    <>
      <button onClick={onSubmit}>
        {props.createNewWorkout ? 'Create Workout' : 'Update workout'}
      </button>
      {error.isError ? error.msg : null}
    </>
  );
};

export default SubmitWorkoutBtn;
