import { MdDescription } from 'react-icons/md';

import classes from '../ExerciseDetail.module.css';

const ExerciseDetailDescription = (props) =>
  props.description ? (
    <div className={`${classes.Detail} ${classes.Description}`}>
      <h3>
        Description <MdDescription />
      </h3>
      <p>{props.description}</p>
    </div>
  ) : (
    <></>
  );

export default ExerciseDetailDescription;
