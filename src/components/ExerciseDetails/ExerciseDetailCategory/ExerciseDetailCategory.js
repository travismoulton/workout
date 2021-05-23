import { BsClipboard } from 'react-icons/bs';

import classes from '../ExerciseDetail.module.css';

const ExerciseDetailCategory = (props) => (
  <div className={`${classes.Detail} ${classes.Category}`}>
    <h3>
      Category <BsClipboard />
    </h3>
    <div>
      <p>{props.category}</p>
    </div>
  </div>
);

export default ExerciseDetailCategory;
