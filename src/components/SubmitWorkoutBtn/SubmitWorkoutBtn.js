import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

const SubmitWorkoutBtn = (props) => {
  const { exercises } = useSelector((state) => state.workout);
  const { user } = useSelector((state) => state.auth);

  const onSubmit = () => {
    props.formIsValid
      ? axios.post(
          `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}.json`,
          {
            title: props.title,
            targetArea: props.targetArea,
            secondaryTarget: props.secondaryTarget,
            exercises,
          }
        )
      : props.setInputAsTouched();
  };

  return <button onClick={onSubmit}>Submit Workout</button>;
};

export default SubmitWorkoutBtn;
