const ExerciseDetailMuscles = (props) => {
  console.log(props);

  const primary = props.muscles.map((muscle) => (
    <li key={muscle.name}>{muscle.name}</li>
  ));
  const secondary = props.secondary.map((muscle) => (
    <li key={muscle.name}>{muscle.name}</li>
  ));

  return (
    <div>
      <h3>Primary Muscles:</h3>
      <ul>{primary}</ul>
      {secondary.length ? (
        <>
          <h3>Secondary Muscles:</h3>
          <ul>{secondary}</ul>
        </>
      ) : null}
    </div>
  );
};

export default ExerciseDetailMuscles;
