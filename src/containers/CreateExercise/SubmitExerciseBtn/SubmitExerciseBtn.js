import { useState, useEffect } from 'react';
import axios from 'axios';
import uniqid from 'uniqid';

import Tooltip from '../../../components/UI/Tooltip/Tooltip';

const SubmitExerciseBtn = (props) => {
  const [error, setError] = useState(null);
  const [TooltipData, setTooltipData] = useState({
    show: false,
    x: null,
    y: null,
  });

  const checkForPreviousNameUse = async () => {
    let nameTaken = false;
    await axios
      .get(
        `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${props.userid}.json`
      )
      .then((res) => {
        for (const key in res.data) {
          if (res.data[key].title === props.title) {
            setError({
              msg: (
                <p>That name is already taken, please try a different name</p>
              ),
              code: 'nameTaken',
            });
            nameTaken = true;
          }
        }
      });

    return nameTaken;
  };

  const submitInvalidFormHandler = () => {};

  const submitValidFormHandler = () => {
    axios.post(
      `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${props.userId}.json`,
      {
        name: props.title,
        description: props.description,
        category: props.category,
        muscles: props.primaryMuscle,
        equipment: props.equipment,
        muscles_secondary: props.secondaryMuscles,
        id: uniqid(),
      }
    );
  };

  const tooltip = TooltipData.show ? (
    <Tooltip x={TooltipData.x} y={TooltipData.y}>
      Tooltip
    </Tooltip>
  ) : null;

  const showTooltipTestFunc = (e) => {
    if (!props.formIsValid) {
      console.log(e);
      setTooltipData({
        show: true,
        x: e.pageX - 50 + 'px',
        y: e.pageY - 75 + 'px',
      });
    }
  };

  const hideToolTip = () => {
    setTooltipData({ show: false, x: null, y: null });
  };

  return (
    <>
      <button
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
