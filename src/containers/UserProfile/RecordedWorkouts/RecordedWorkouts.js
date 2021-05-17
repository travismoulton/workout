import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import RecordedWorkoutLink from '../../../components/RecordedWorkoutLink/RecordedWorkoutLink';
import classes from './RecordedWorkouts.module.css';
import { setRecordedWorkouts } from '../../../store/actions';

const RecordedWorkouts = (props) => {
  const [initialFetchCompleted, setInitialFetchCompleted] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { recordedWorkouts } = useSelector((state) => state.userProfile);
  const dispatch = useDispatch();

  const bubbleSortWorkoutDates = useCallback((arr) => {
    const temp = [...arr];
    const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]]);

    for (let i = 0; i < temp.length; i++) {
      let isSwapped = false;
      for (let j = 0; j < temp.length - 1; j++) {
        if (
          new Date(
            temp[j + 1].date.year,
            temp[j + 1].date.month,
            temp[j + 1].date.day
          ) > new Date(temp[j].date.year, temp[j].date.month, temp[j].date.day)
        ) {
          swap(temp, j, j + 1);
          isSwapped = true;
        }
      }
      if (!isSwapped) break;
    }
    return temp;
  }, []);

  const fetchRecordedWorkouts = useCallback(() => {
    axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/recordedWorkouts/${user.authUser.uid}.json`
      )
      .then((res) => {
        if (res.data) {
          const tempArr = [];
          for (const key in res.data) {
            tempArr.push({ ...res.data[key], firebaseId: key });
          }
          dispatch(setRecordedWorkouts(bubbleSortWorkoutDates(tempArr)));
        } else if (!res.data) {
          dispatch(setRecordedWorkouts(null));
        }
      });
  }, [user.authUser.uid, bubbleSortWorkoutDates, dispatch]);

  useEffect(() => {
    if (!initialFetchCompleted) {
      fetchRecordedWorkouts();
      setInitialFetchCompleted();
      props.setFetchCompleted();
    }
  }, [initialFetchCompleted, fetchRecordedWorkouts, props]);

  const recordedWorkoutLinks =
    recordedWorkouts &&
    recordedWorkouts.map((record) => (
      <RecordedWorkoutLink
        key={record.firebaseId}
        title={record.title}
        date={record.date}
        firebaseId={record.firebaseId}
      />
    ));

  return (
    <div className={classes.RecordedWorkouts}>
      <span
        className={classes.SectionHeader}
        onClick={props.triggerRecordedWorkoutsShowing}
      >
        <h3>My Recorded Workouts</h3>
        <div
          className={
            props.showRecordedWorkouts ? classes.ArrowDown : classes.ArrowRight
          }
        ></div>
      </span>
      {props.showRecordedWorkouts && recordedWorkoutLinks}
    </div>
  );
};

export default RecordedWorkouts;
