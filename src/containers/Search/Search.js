import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import classes from './Search.module.css';
import SearchCategory from '../../components/SearchCategory/SearchCategory';
import SearchSubCategory from '../../components/SearchSubCategory/SearchSubCategory';

const Search = (props) => {
  const [subCategories, setSubCategories] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState('');
  const [showCustomOption, setShowCustomOption] = useState(false);
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
            `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${user.authUser.uid}.json`,
            { timeout: 5000 }
          )
          .then((res) => {
            if (res.data) setShowCustomOption(true);
            setLoaded(true);
          })
          .catch((err) => {
            setError({ ...error, isError: true });
          });
      })();
    } else if (!user) {
      setLoaded(true);
    }
  }, [user, loaded, error]);

  useEffect(() => {
    if (!user && showCustomOption) setShowCustomOption(false);
  }, [user, showCustomOption]);

  const getSubCategories = (category) => {
    axios
      .get(`https://wger.de/api/v2/${category}`, { timeout: 5000 })
      .then((res) => {
        setSubCategories(res.data.results);
      })
      .catch((err) => {
        setError({ ...error, isError: true });
      });
  };

  const controlSubCategories = (category) => {
    if (categoryOpen === category) {
      setSubCategories([]);
      setCategoryOpen('');
    } else {
      getSubCategories(category);
      setCategoryOpen(category);
    }
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
    <div className={classes.Search}>
      {needLoginMessage}
      {error.isError && error.message}
      <SearchCategory
        categoryName={'Exercise Category'}
        clicked={() => controlSubCategories('exercisecategory')}
      />
      {categoryOpen === 'exercisecategory' && displaySubCategoires}
      <SearchCategory
        categoryName={'Muscle'}
        clicked={() => controlSubCategories('muscle')}
      />
      {categoryOpen === 'muscle' && displaySubCategoires}
      <SearchCategory
        categoryName={'Equipment'}
        clicked={() => controlSubCategories('equipment')}
      />
      {categoryOpen === 'equipment' && displaySubCategoires}
      {showCustomOption && (
        <SearchCategory
          categoryName={'My custom exercises'}
          clicked={getCustomExercises}
        />
      )}
    </div>
  ) : error.isError ? (
    error.message
  ) : (
    <></>
  );
};

export default Search;
