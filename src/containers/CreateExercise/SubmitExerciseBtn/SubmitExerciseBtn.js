import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import uniqid from 'uniqid';

import Tooltip from '../../../components/UI/Tooltip/Tooltip';
import classes from './SubmitExerciseBtn.module.css';

const SubmitExerciseBtn = (props) => {
  const [error, setError] = useState(null);
  const [tooltipData, setTooltipData] = useState({
    show: false,
    x: null,
    y: null,
    innerTxt: null,
  });

  useEffect(() => {
    if (error)
      if (error.takenName && error.takenName !== props.title) setError(null);
  }, [error, props.title]);

  const checkForPreviousNameUse = async () => {
    let nameTaken = false;
    await axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${props.userId}.json`
      )
      .then((res) => {
        for (const key in res.data) {
          if (res.data[key].name === props.title) {
            setError({
              msg: (
                <p style={{ color: 'red' }}>
                  That name is already taken, please try a different name
                </p>
              ),
              code: 'nameTaken',
              takenName: props.title,
            });
            nameTaken = true;
            break;
          }
        }
      });

    return nameTaken;
  };

  const exerciseData = {
    name: props.title,
    description: props.description,
    category: props.category,
    muscles: [props.primaryMuscle],
    equipment: props.equipment,
    muscles_secondary: props.secondaryMuscles,
    id: uniqid(),
  };

  const submitValidFormHandler = async () => {
    if (await checkForPreviousNameUse()) return;

    axios.post(
      `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${props.userId}.json`,
      exerciseData
    );

    props.history.push(`/my-profile`);
  };

  const createTooltipInnerTxt = () => {
    if (!props.nameIsValid && !props.categoryIsValid) {
      return <p>Name and category are required to create an exercise</p>;
    } else if (props.nameIsValid && !props.categoryIsValid) {
      return <p>Category is required to create an exercise</p>;
    } else if (!props.nameIsValid && props.categoryIsValid) {
      return <p>Name is required to create an exercise</p>;
    }
  };

  const tooltip = tooltipData.show ? (
    <Tooltip x={tooltipData.x} y={tooltipData.y}>
      {createTooltipInnerTxt()}
    </Tooltip>
  ) : null;

  const showTooltipTestFunc = (e) => {
    if (!props.formIsValid) {
      const btnCoordinateData = e.target.getBoundingClientRect();
      setTooltipData({
        show: true,
        x: btnCoordinateData.x + btnCoordinateData.width / 2 + 'px',
        y: btnCoordinateData.y - btnCoordinateData.height - 10 + 'px',
      });
    }
  };

  const hideToolTip = () => {
    setTooltipData({ show: false, x: null, y: null, innerTxt: null });
  };

  return (
    <>
      {error ? error.msg : null}
      <button
        className={classes.Btn}
        disabled={!props.formIsValid}
        onClick={submitValidFormHandler}
        style={{ cursor: !props.formIsValid ? 'not-allowed' : 'auto' }}
        onMouseOver={showTooltipTestFunc}
        onMouseOut={hideToolTip}
      >
        Submit Exercise
      </button>

      {tooltip}
    </>
  );
};

export default SubmitExerciseBtn;
