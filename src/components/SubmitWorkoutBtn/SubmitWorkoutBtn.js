import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { clearExercises, clearForm } from '../../store/actions';

const SubmitWorkoutBtn = (props) => {
  const [error, setError] = useState({
    isError: false,
    msg: '',
    errorCode: null,
  });
  const { exercises } = useSelector((state) => state.workout);
  const { user } = useSelector((state) => state.auth);
  const { formData } = useSelector((state) => state.workout);
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
    if (await checkForPreviousNameUse()) return;

    axios.post(
      `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}.json`,
      {
        title: props.title,
        targetAreaCode: props.targetAreaCode,
        secondaryTargetCode: props.secondaryTargetCode,
        targetArea: props.targetArea,
        secondaryTargetArea: props.secondaryTargetArea,
        exercises,
      }
    );

    dispatch(clearExercises());
    dispatch(clearForm());
    props.clearAllFormInputs();
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
