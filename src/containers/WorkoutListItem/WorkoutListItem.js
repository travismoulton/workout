import { useState, useEffect } from 'react';

import classes from './WorkoutListItem.module.css';
import Input from '../../components/UI/Input/Input';

const WorkoutListItem = (props) => {
  const [weightInput, setWeightInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: (() => {
        let arr = [];
        for (let i = 0; i < 75; i++)
          arr.push({ value: i * 5, displayValue: i * 5 });
        return arr;
      })(),
    },
    value: 0,
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    label: 'Weight',
    id: 1,
  });

  const [setsInput, setSetsInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: (() => {
        let arr = [];
        for (let i = 1; i < 25; i++) arr.push({ value: i, displayValue: i });
        return arr;
      })(),
    },
    value: 0,
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    label: 'Number of sets',
    id: 2,
  });

  const [repsInput, setRepsInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: (() => {
        let arr = [];
        for (let i = 1; i < 25; i++) arr.push({ value: i, displayValue: i });
        return arr;
      })(),
    },
    value: 0,
    validation: {
      required: true,
    },
    valid: true,
    touched: false,
    label: 'Number of reps',
    id: 3,
  });

  useEffect(() => {
    let arr = [];
    for (let i = 0; i < 100; i++) arr.push(i * 5);
    console.log(arr);
  });

  const setWeight = (e) => {
    setWeightInput({ ...weightInput, value: e.target.value * 1 });
  };

  const setNumSets = (e) => {
    setSetsInput({ ...setsInput, value: e.target.value * 1 });
  };

  const setNumReps = (e) => {
    setRepsInput({ ...repsInput, value: e.target.value * 1 });
  };

  const formFields = [weightInput, setsInput, repsInput];
  const updateFunctions = [setWeight, setNumSets, setNumReps];

  const form = formFields.map((field, i) => (
    <Input
      elementType={field.elementType}
      elementConfig={field.elementConfig}
      key={field.id}
      value={field.value}
      changed={updateFunctions[i]}
      label={field.label}
      classname="WorkoutListItem"
    />
  ));

  return (
    <li className={classes.WorkoutListItem}>
      <div>{props.name}</div>
      <div className={classes.Form}>{form}</div>
    </li>
  );
};
export default WorkoutListItem;
