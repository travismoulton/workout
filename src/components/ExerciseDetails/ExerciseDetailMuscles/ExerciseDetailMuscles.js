import { GiMuscleUp } from 'react-icons/gi';

import classes from '../ExerciseDetail.module.css';

const ExerciseDetailMuscles = (props) => {
  const primary = props.muscles.map((muscle) =>
    muscle ? <li key={muscle.name}>{muscle.name}</li> : null
  );
  const secondary = props.secondary.map((muscle) =>
    muscle ? <li key={muscle.name}>{muscle.name}</li> : null
  );

  return (
    <div className={`${classes.Detail} ${classes.Muscle}`}>
      {primary.length ? (
        <>
          <h3>
            Primary Muscles <GiMuscleUp />
          </h3>
          <ul>{primary}</ul>
        </>
      ) : null}
      {secondary.length ? (
        <>
          <h3>
            Secondary Muscles <GiMuscleUp />
          </h3>
          <ul>{secondary}</ul>
        </>
      ) : null}
    </div>
  );
};

export default ExerciseDetailMuscles;
