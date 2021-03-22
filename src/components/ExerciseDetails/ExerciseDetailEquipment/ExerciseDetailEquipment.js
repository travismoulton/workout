const ExerciseDetailEquipment = (props) => {
  const equipment = props.equipment.map((el) => <li key={el}>{el}</li>);

  return (
    <div>
      <span>Equipment:</span>
      <ul>{equipment}</ul>
    </div>
  );
};

export default ExerciseDetailEquipment;
