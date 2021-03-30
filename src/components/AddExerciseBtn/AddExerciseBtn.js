const AddExerciseBtn = (props) => {
  return (
    <button onClick={props.clicked}>Add {props.exercise} to workout</button>
  );
};

export default AddExerciseBtn;
