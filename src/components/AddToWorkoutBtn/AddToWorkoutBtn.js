import { useDispatch } from 'react-redux';
import uniqid from 'uniqid';

import { addExercise } from '../../store/actions';

const AddExerciseBtn = (props) => {
  const dispatch = useDispatch();
  const addWorkoutAndRedirect = () => {
    dispatch(
      addExercise({
        name: props.name,
        id: uniqid(`${props.id}-`),
        sets: [{ weight: 0, reps: 1 }],
        focus: 'reps',
      })
    );
    props.history.push('/create-workout');
  };

  return <button onClick={addWorkoutAndRedirect}>Add to workout</button>;
};

export default AddExerciseBtn;
