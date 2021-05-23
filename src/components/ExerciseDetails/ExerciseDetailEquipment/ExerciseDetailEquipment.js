import { GiWeightLiftingUp } from 'react-icons/gi';

import classes from '../ExerciseDetail.module.css';

const ExerciseDetailEquipment = (props) => {
  const equipment = props.equipment.map((el) => <li key={el}>{el}</li>);

  return equipment.length ? (
    <div className={`${classes.Detail} ${classes.Equipment}`}>
      <h3>
        Equipment <GiWeightLiftingUp />
      </h3>
      <ul>{equipment}</ul>
    </div>
  ) : (
    <></>
  );
};

export default ExerciseDetailEquipment;
