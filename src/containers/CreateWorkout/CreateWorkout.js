import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import Input from '../../components/UI/Input/Input';

const CreateWorkout = (props) => {
  const user = useSelector((state) => state.auth.user);
  const favorites = useSelector((state) => state.favorites.favorites);
  const wgerDict = useSelector((state) => state.wgerDict);
  const dispatch = useDispatch();
  const [favoritesAsExercies, setFavoritesAsExercies] = useState([]);

  useEffect(() => {
    let arr = [];
    async function fn() {
      if (favorites) {
        await favorites.forEach((fav) => {
          axios
            .get(`https://wger.de/api/v2/exercise/${fav.exercise}`)
            .then((res) => arr.push(res.data));
        });
      }
    }
    fn();

    console.log(arr);

    if (!favoritesAsExercies.length) setFavoritesAsExercies(arr);
  }, [favoritesAsExercies, favorites]);

  const [workoutNameInput, setWorkoutNameInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Workout name',
    },
    value: '',
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    id: 1,
  });

  const [targetAreaInput, setTargetAreaInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: [
        { value: 0, displayValue: '' },
        { value: 10, displayValue: 'Abs' },
        { value: 8, displayValue: 'Arms' },
        { value: 12, displayValue: 'Back' },
        { value: 14, displayValue: 'Calves' },
        { value: 11, displayValue: 'Chest' },
        { value: 9, displayValue: 'Legs' },
        { value: 13, displayValue: 'Shoulders' },
      ],
    },
    value: '',
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    id: 2,
  });

  const [secondaryTargetAreaInput, setSecondaryTargetAreaInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: [
        { value: 0, displayValue: '' },
        { value: 10, displayValue: 'Abs' },
        { value: 8, displayValue: 'Arms' },
        { value: 12, displayValue: 'Back' },
        { value: 14, displayValue: 'Calves' },
        { value: 11, displayValue: 'Chest' },
        { value: 9, displayValue: 'Legs' },
        { value: 13, displayValue: 'Shoulders' },
      ],
    },
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    id: 3,
  });

  const [addFromFavorites, setAddFromFavorites] = useState({});

  const setWorkoutNameValue = (e) => {
    setWorkoutNameInput({ ...workoutNameInput, value: e.target.value });
  };

  const setTargetAreaValue = (e) => {
    setTargetAreaInput({ ...targetAreaInput, value: e.target.value });
  };

  const setSecondaryTargetAreaValue = (e) => {
    setSecondaryTargetAreaInput({
      ...secondaryTargetAreaInput,
      value: e.target.value,
    });
  };

  const formFields = [
    workoutNameInput,
    targetAreaInput,
    secondaryTargetAreaInput,
  ];
  const updateFunctions = [
    setWorkoutNameValue,
    setTargetAreaValue,
    setSecondaryTargetAreaValue,
  ];

  const form = formFields.map((field, i) => (
    <Input
      elementType={field.elementType}
      elementConfig={field.elementConfig}
      key={field.id}
      value={field.value}
      changed={updateFunctions[i]}
    />
  ));

  return <>{form}</>;
};

export default CreateWorkout;
