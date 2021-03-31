import { useDispatch } from 'react-redux';

import { addExercise } from '../../store/actions';

const AddExerciseBtn = (props) => {
  const dispatch = useDispatch();
  const addWorkoutAndRedirect = () => {
    dispatch(
      addExercise({
        name: props.name,
        id: props.id,
        weight: 0,
        sets: 1,
        reps: 1,
      })
    );
    props.history.push('/create-workout');
  };

  return <button onClick={addWorkoutAndRedirect}>Add to workout</button>;
};

export default AddExerciseBtn;
