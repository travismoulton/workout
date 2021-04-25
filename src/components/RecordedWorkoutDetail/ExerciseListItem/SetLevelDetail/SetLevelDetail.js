import classes from './SetLevelDetail.module.css';

const SetLevelDetail = (props) => (
  <li>
    <p>Set #{props.index}</p>
    <div className={classes.Details}>
      <p>Reps: {props.reps}</p>
      <p>Weight: {props.weight}</p>
    </div>
  </li>
);

export default SetLevelDetail;
