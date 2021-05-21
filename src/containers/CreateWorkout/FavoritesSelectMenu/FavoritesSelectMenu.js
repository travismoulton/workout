import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import uniqid from 'uniqid';

import Input from '../../../components/UI/Input/Input';
import { addExercise } from '../../../store/actions';

const FavoritesSelectMenu = (props) => {
  const { favorites } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [favoritesAsExercises, setFavoritesAsExercises] = useState([]);
  const [favoritesAsSelectOptions, setFavoritesAsSelectOptions] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState({
    isError: false,
    message: (
      <p style={{ color: 'red' }}>
        Sorry, something went wrong trying to get some of your favorites. Please
        refresh the page or try again later
      </p>
    ),
  });

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
          !error.isError
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
              setError({ ...error, isError: true });
            });

          await axios
            .get(
              `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${user.authUser.uid}.json`,
              { timeout: 5000 }
            )
            .then((res) => {
              if (res.data) filterFavorites(arr, res);
            })
            .catch((err) => {
              setError({ ...error, isError: true });
            });

          setFavoritesAsExercises(arr);
        }
    })();
  }, [
    favorites,
    favoritesAsExercises,
    user.authUser.uid,
    filterFavorites,
    error,
  ]);

  useEffect(() => {
    // After favoritesAsExercises has been created, create an array of objects to
    // be used as select options inside the Add from favroites dropdown
    if (favoritesAsExercises.length && !favoritesAsSelectOptions.length) {
      setFavoritesAsSelectOptions(
        favoritesAsExercises.map((exercise) => ({
          value: exercise.id,
          displayValue: exercise.name,
        }))
      );
      // Once the select options have been set, load the page
      setLoaded(true);
    }
  }, [favoritesAsExercises, favoritesAsSelectOptions]);

  useEffect(() => {
    // If there are no favorites, the page can be loaded immediatley
    if (favorites) if (!favorites.length && !loaded) setLoaded(true);
  }, [favorites, loaded]);

  useEffect(() => {
    if (error.isError) setLoaded(true);
  }, [error, loaded]);

  useEffect(() => {
    if (
      favoritesAsSelectOptions.length &&
      !addFromFavorites.elementConfig.options.length
    )
      setAddFromFavorites({
        ...addFromFavorites,
        elementConfig: {
          ...addFromFavorites.elementConfig,
          options: [
            { value: 0, displayValue: null },
            ...favoritesAsSelectOptions,
          ],
        },
      });
  }, [addFromFavorites, favoritesAsSelectOptions]);

  const addExerciseFromFavorites = (e) => {
    const exercise = favoritesAsExercises.filter(
      (fav) => fav.id.toString() === e.target.value
    )[0];

    dispatch(
      addExercise({
        name: exercise.name,
        id: uniqid(`${exercise.id}-`),
        sets: [{ weight: 0, reps: 1 }],
      })
    );
  };

  useEffect(() => {
    if (loaded) props.setLoaded();
  }, [loaded, props]);

  useEffect(() => {
    if (error.isError) props.setError();
  }, [error, props]);

  return loaded && favorites.length ? (
    <Input
      elementType={addFromFavorites.elementType}
      elementConfig={addFromFavorites.elementConfig}
      label={addFromFavorites.label}
      value={addFromFavorites.value}
      changed={(e) => addExerciseFromFavorites(e)}
    />
  ) : null;
};

export default FavoritesSelectMenu;
