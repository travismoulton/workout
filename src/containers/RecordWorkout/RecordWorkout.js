import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import WorkoutListItem from '../WorkoutListItem/WorkoutListItem';
import RecordWorkoutBtn from '../../components/RecordWorkoutBtn/RecordWorkoutBtn';
import Spinner from '../../components/UI/Spinner/Spinner';
import RecordADifferentWorkout from '../../components/RecordADifferentWorkout/RecordADifferentWorkout';
import ChangeWorkoutRecordDate from './ChangeRecordWorkoutDate/ChangeWorkoutRecordDate';
import { setExercises, resetWorkoutStore } from '../../store/actions';

const RecordWorkout = (props) => {
  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [suggestedWorkout, setSuggestedWorkout] = useState(null);
  const [exercisesDispatched, setExercisesDispatched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showChangeDateModal, setShowChangeDateModal] = useState(false);
  const [showRecordDifferentWorkoutModal, setShowRecordDifferentWorkoutModal] =
    useState(false);
  const [error, setError] = useState({ isError: false, message: '', code: '' });
  const { user } = useSelector((state) => state.auth);
  const { activeRoutine } = useSelector((state) => state.favorites);
  const { exercises } = useSelector((state) => state.workout);
  const { updated } = useSelector((state) => state.workout);
  const dispatch = useDispatch();

  useEffect(() => {
    const unlisten = props.history.listen((location, action) => {
      dispatch(resetWorkoutStore());
      unlisten();
    });
  });

  const adjustDateForSunday = useCallback(() => {
    return workoutDate.getDay() === 0 ? 6 : workoutDate.getDay() - 1;
  }, [workoutDate]);

  useEffect(() => {
    if (!suggestedWorkout) {
      if (activeRoutine) {
        const workoutFirebaseId = activeRoutine.workouts[adjustDateForSunday()];

        if (workoutFirebaseId !== 'Rest') {
          (async () =>
            await axios
              .get(
                `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}/${workoutFirebaseId}.json`,
                { timeout: 5000 }
              )
              .then((res) =>
                setSuggestedWorkout({
                  ...res.data,
                  firebaseId: workoutFirebaseId,
                })
              )
              .catch((err) => {
                setError({
                  isError: true,
                  message: (
                    <p>
                      Sorry, we can't load your workouts right now. Please
                      refresh the page or try again later
                    </p>
                  ),
                  code: 'activeRoutineError',
                });
              }))();
        } else if (workoutFirebaseId === 'Rest') setLoading(false);
      } else if (!activeRoutine) setLoading(false);
    }
  }, [suggestedWorkout, adjustDateForSunday, activeRoutine, user.authUser.uid]);

  useEffect(() => {
    if (suggestedWorkout && !exercisesDispatched) {
      dispatch(setExercises(suggestedWorkout.exercises));
      setExercisesDispatched(true);
      setLoading(false);
    }
  }, [suggestedWorkout, dispatch, exercisesDispatched]);

  // If an exercise is removed, updated suggested workout and re-render
  useEffect(() => {
    const exerciseRemoved =
      exercises.length &&
      suggestedWorkout &&
      exercises.length !== suggestedWorkout.exercises.length;
    if (exerciseRemoved)
      setSuggestedWorkout({ ...suggestedWorkout, exercises });
  }, [exercises, suggestedWorkout]);

  const displayExercises =
    suggestedWorkout &&
    exercises.map((exercise) => (
      <WorkoutListItem
        name={exercise.name}
        key={exercise.id}
        id={exercise.id}
        sets={exercise.sets}
        inRecordMode={true}
      />
    ));

  const updateWorkoutInFirebase = async () => {
    const workoutFirebaseId = suggestedWorkout.firebaseId;
    await axios({
      method: 'put',
      url: `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}/${workoutFirebaseId}.json`,
      data: {
        title: suggestedWorkout.title,
        targetAreaCode: suggestedWorkout.targetAreaCode,
        secondaryTargetCode: suggestedWorkout.secondaryTargetCode,
        targetArea: suggestedWorkout.targetArea,
        secondaryTargetArea: suggestedWorkout.secondaryTargetArea,
        exercises,
      },
      timeout: 5000,
    }).catch((err) => {
      setError({
        isError: true,
        message: (
          <p style={{ color: 'red' }}>
            Sorry, we're having trouble processing your request right now.
            Please refresh the page and record the workout again, or come back
            later
          </p>
        ),
      });

      throw new Error(
        'Workout update failed. Stop function execution so the recordWorkout will not hit firebase'
      );
    });
  };

  const recordADifferentWorkoutBtn = (
    <button onClick={() => setShowRecordDifferentWorkoutModal(true)}>
      Record a different workout today
    </button>
  );

  const recordDifferentDayBtn = (
    <button onClick={() => setShowChangeDateModal(true)}>
      Record a workout for a different day
    </button>
  );

  const switchWorkout = (workoutId) => {
    workoutId
      ? axios
          .get(
            `https://workout-81691-default-rtdb.firebaseio.com/workouts/${user.authUser.uid}/${workoutId}.json`,
            { timeout: 5000 }
          )
          .then((res) => {
            setSuggestedWorkout({ ...res.data, firebaseId: workoutId });
            dispatch(setExercises(res.data.exercises));
            if (error.code === 'noSelectedWorkout') setError(null);
          })
          .catch((err) => {
            setError({
              isError: true,
              message: (
                <p style={{ color: 'red' }}>
                  Sorry, we were not able to load the workout. Please refresh
                  the page and try again, or come back later
                </p>
              ),
              code: 'switchWorkout',
            });
          })
      : setError({
          isError: true,
          message: (
            <p style={{ color: 'red' }}>
              No Workout was selected. Please select a workout to record
            </p>
          ),
          code: 'noSelectedWorkout',
        });
  };

  const finalDisplay = (
    <>
      {error.isError && error.message}
      <h1>{workoutDate.toString().substring(0, 15)}</h1>
      {suggestedWorkout ? <h3>{suggestedWorkout.title}</h3> : <h3>Rest</h3>}
      {recordADifferentWorkoutBtn}
      {recordDifferentDayBtn}
      {displayExercises}
      {suggestedWorkout && exercises.length ? (
        <RecordWorkoutBtn
          workout={suggestedWorkout}
          exercises={exercises}
          date={workoutDate}
          history={props.history}
          updated={updated}
          updateWorkoutInFirebase={updateWorkoutInFirebase}
          userId={user.authUser.uid}
        />
      ) : null}

      <RecordADifferentWorkout
        userId={user.authUser.uid}
        show={showRecordDifferentWorkoutModal}
        closeModal={() => setShowRecordDifferentWorkoutModal(false)}
        switchWorkout={(workoutId) => switchWorkout(workoutId)}
      />

      <ChangeWorkoutRecordDate
        show={showChangeDateModal}
        closeModal={() => setShowChangeDateModal(false)}
        changeDate={(date) => setWorkoutDate(date)}
      />
    </>
  );

  return loading ? <Spinner /> : finalDisplay;
};

export default RecordWorkout;
