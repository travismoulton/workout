const ExerciseDetailDescription = (props) =>
  props.description ? (
    <div>
      <h3>Description</h3>
      <p>{props.description}</p>
    </div>
  ) : (
    <></>
  );

export default ExerciseDetailDescription;
