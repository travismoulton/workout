import classes from './SetLevelDetail.module.css';

const SetLevelDetail = (props) => (
  <li className={classes.Container}>
    <p>Set #{props.index}</p>
    <div className={classes.Details}>
      {props.reps ? <p>Reps: {props.reps}</p> : <p>Minutes: {props.minutes}</p>}
      {props.weight ? (
        <p>Weight: {props.weight}</p>
      ) : (
        <p>Seconds: {props.seconds}</p>
      )}
    </div>
  </li>
);

export default SetLevelDetail;
