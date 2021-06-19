import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import uniqid from 'uniqid';

import Input from '../../../components/UI/Input/Input';
import { addExercise } from '../../../store/actions';

const FavoritesSelectMenu = (props) => {
  const { favorites } = useSelector((state) => state.favorites);
  const { uid, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [favoritesAsExercises, setFavoritesAsExercises] = useState([]);
  const [favoritesAsSelectOptions, setFavoritesAsSelectOptions] = useState([]);

  const [addFromFavorites, setAddFromFavorites] = useState({
    elementType: 'select',
    elementConfig: {
      options: [],
    },
    value: 0,
    label: 'Add exercise from favorites',
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    id: 4,
    className: 'CreateWorkoutSelect',
  });

  const filterFavorites = useCallback(
    (arr, res) => {
      for (const key in res.data) {
        const exercise = favorites.filter(
          (fav) => fav.exercise.toString() === res.data[key].id.toString()
        )[0];

        if (exercise) arr.push(res.data[key]);
      }
    },
    [favorites]
  );

  useEffect(() => {
    let arr = [];

    (async () => {
      if (favorites)
        if (
          favorites.length &&
          !favoritesAsExercises.length &&
          !props.isError
        ) {
          await axios
            .get(
              `https://workout-81691-default-rtdb.firebaseio.com/masterExerciseList.json`,
              { timeout: 5000 }
            )
            .then((res) => {
              filterFavorites(arr, res);
            })
            .catch((err) => {
              props.toggleError();
            });

          await axios
            .get(
              `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${uid}.json?auth=${accessToken}`,
              { timeout: 5000 }
            )
            .then((res) => {
              if (res.data) filterFavorites(arr, res);
            })
            .catch((err) => {
              props.toggleError();
            });

          setFavoritesAsExercises(arr);
        }
    })();
  }, [
    favorites,
    favoritesAsExercises,
    uid,
    accessToken,
    filterFavorites,
    props,
  ]);

  useEffect(() => {
    // After favoritesAsExercises has been created, create an array of objects to
    // be used as select options inside the Add from favroites dropdown
    if (favoritesAsExercises.length && !favoritesAsSelectOptions.length) {
      setFavoritesAsSelectOptions(
        favoritesAsExercises.map((exercise) => ({
          value: exercise.id,
          label: exercise.name,
        }))
      );
      // Once the select options have been set, load the page
      props.toggleLoaded();
    }
  }, [favoritesAsExercises, favoritesAsSelectOptions, props]);

  useEffect(() => {
    // If there are no favorites, the page can be loaded immediatley
    if (favorites)
      if (!favorites.length && !props.isLoaded) props.toggleLoaded();
  }, [favorites, props]);

  useEffect(() => {
    if (props.isError) props.toggleLoaded();
  }, [props]);

  useEffect(() => {
    if (
      favoritesAsSelectOptions.length &&
      !addFromFavorites.elementConfig.options.length
    )
      setAddFromFavorites({
        ...addFromFavorites,
        elementConfig: {
          ...addFromFavorites.elementConfig,
          options: [{ value: 0, label: null }, ...favoritesAsSelectOptions],
        },
      });
  }, [addFromFavorites, favoritesAsSelectOptions]);

  const addExerciseFromFavorites = (e) => {
    const exercise = favoritesAsExercises.filter(
      (fav) => fav.id === e.value
    )[0];

    if (exercise)
      dispatch(
        addExercise({
          name: exercise.name,
          id: uniqid(`${exercise.id}-`),
          sets: [{ weight: 0, reps: 0 }],
          focus: 'reps',
        })
      );
  };

  return favoritesAsExercises.length ? (
    <Input
      elementType={addFromFavorites.elementType}
      elementConfig={addFromFavorites.elementConfig}
      label={addFromFavorites.label}
      value={addFromFavorites.value}
      changed={addExerciseFromFavorites}
      classname={addFromFavorites.className}
      wrapperClass="WorkoutDetailsSelectWrapper"
    />
  ) : null;
};

export default FavoritesSelectMenu;
