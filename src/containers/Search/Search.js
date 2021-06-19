import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import classes from './Search.module.css';
import SearchCategory from '../../components/SearchCategory/SearchCategory';
import SearchSubCategory from '../../components/SearchSubCategory/SearchSubCategory';
import Spinner from '../../components/UI/Spinner/Spinner';

const Search = (props) => {
  const [subCategories, setSubCategories] = useState([]);
  const [exerciseCategories, setExerciseCategoires] = useState(null);
  const [muscles, setMuscles] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState('');
  const [showCustomOption, setShowCustomOption] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState({
    isError: false,
    message: (
      <p style={{ color: 'red' }}>
        Sorry, we're having trouble right now. please refresh the page or try
        again later
      </p>
    ),
  });
  const [needLoginMessage, setNeedLoginMessage] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const page = props.location.pathname.substring(1);
    if (
      !user &&
      props.location.pathname !== '/' &&
      props.location.pathname !== '/search'
    )
      setNeedLoginMessage(<p>You need to log in to visit the {page} page</p>);
  }, [user, props]);

  useEffect(() => {
    if (user) {
      (async () => {
        await axios
          .get(
            `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${user.authUser.uid}.json?auth=${user.authUser.za}`
          )
          .then((res) => {
            res.data ? setShowCustomOption(true) : setShowCustomOption(false);
          })
          .catch((err) => {
            setError({ ...error, isError: true });
          });
      })();
    }
  }, [user, loaded, error]);

  useEffect(() => {
    if (!user && showCustomOption) setShowCustomOption(false);
  }, [user, showCustomOption]);

  useEffect(() => {
    if (!exerciseCategories && !muscles && !equipment) {
      axios
        .get(`https://wger.de/api/v2/exercisecategory`, { timeout: 5000 })
        .then((res) => setExerciseCategoires(res.data.results))
        .catch(() => setError({ ...error, isError: true }));

      axios
        .get(`https://wger.de/api/v2/muscle`, { timeout: 5000 })
        .then((res) => setMuscles(res.data.results))
        .catch(() => setError({ ...error, isError: true }));

      axios
        .get(`https://wger.de/api/v2/equipment`, { timeout: 5000 })
        .then((res) => setEquipment(res.data.results))
        .catch(() => setError({ ...error, isError: true }));
    }
  }, [error, exerciseCategories, muscles, equipment]);

  useEffect(() => {
    const wgerReady = exerciseCategories && muscles && equipment;
    if (!loaded && wgerReady)
      if ((user && showCustomOption !== null) || !user) setLoaded(true);
  }, [loaded, exerciseCategories, muscles, equipment, showCustomOption, user]);

  const closeSubCategories = () => {
    setCategoryOpen(null);
    setSubCategories([]);
  };

  const openSubCategory = (category) => {
    setCategoryOpen(category);

    switch (category) {
      case 'exercisecategory':
        return setSubCategories(exerciseCategories);
      case 'muscle':
        return setSubCategories(muscles);
      case 'equipment':
        return setSubCategories(equipment);
      default:
        setSubCategories([]);
    }
  };

  const controlSubCategories = (category) => {
    categoryOpen === category
      ? closeSubCategories()
      : openSubCategory(category);
  };

  const getCustomExercises = () => {
    props.history.push({
      pathname: '/results/my-custom-exercises',
      state: { custom: true },
    });
  };

  const displaySubCategoires = subCategories.map((subCat) => (
    <SearchSubCategory
      subCategoryName={subCat['name']}
      key={subCat['id']}
      id={subCat['id']}
      category={categoryOpen}
    />
  ));

  return loaded ? (
    <>
      <h1 className={classes.Header}>Select a category to search</h1>
      <div className={classes.Search}>
        {needLoginMessage}
        {error.isError && error.message}
        <SearchCategory
          categoryName={'Exercise Category'}
          clicked={() => controlSubCategories('exercisecategory')}
          categoryOpen={categoryOpen === 'exercisecategory'}
        />
        {categoryOpen === 'exercisecategory' && displaySubCategoires}
        <SearchCategory
          categoryName={'Muscle'}
          clicked={() => controlSubCategories('muscle')}
          categoryOpen={categoryOpen === 'muscle'}
        />
        {categoryOpen === 'muscle' && displaySubCategoires}
        <SearchCategory
          categoryName={'Equipment'}
          clicked={() => controlSubCategories('equipment')}
          categoryOpen={categoryOpen === 'Equipment'}
        />
        {categoryOpen === 'equipment' && displaySubCategoires}
        {showCustomOption && (
          <SearchCategory
            categoryName={'My custom exercises'}
            clicked={getCustomExercises}
          />
        )}
      </div>
    </>
  ) : error.isError ? (
    error.message
  ) : (
    <Spinner />
  );
};

export default Search;
