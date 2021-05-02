const ExerciseDetailEquipment = (props) => {
  const equipment = props.equipment.map((el) => <li key={el}>{el}</li>);

  return equipment.length ? (
    <div>
      <h3>Equipment:</h3>
      <ul>{equipment}</ul>
    </div>
  ) : (
    <></>
  );
};

export default ExerciseDetailEquipment;
