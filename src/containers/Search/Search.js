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
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      (async () => {
        await axios
          .get(
            `https://workout-81691-default-rtdb.firebaseio.com/customExercises/${user.authUser.uid}.json`
          )
          .then((res) => {
            if (res.data) setShowCustomOption(true);
            setLoaded(true);
          });
      })();
    } else {
      setLoaded(true);
    }
  }, [user, loaded]);

  const getSubCategories = (category) => {
    axios.get(`https://wger.de/api/v2/${category}`).then((res) => {
      setSubCategories(res.data.results);
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
      <SearchCategory
        categoryName={'Exercise Category'}
        clicked={() => controlSubCategories('exercisecategory')}
      />
      {categoryOpen === 'exercisecategory' ? displaySubCategoires : null}
      <SearchCategory
        categoryName={'Muscle'}
        clicked={() => controlSubCategories('muscle')}
      />
      {categoryOpen === 'muscle' ? displaySubCategoires : null}
      <SearchCategory
        categoryName={'Equipment'}
        clicked={() => controlSubCategories('equipment')}
      />
      {categoryOpen === 'equipment' ? displaySubCategoires : null}
      {showCustomOption ? (
        <SearchCategory
          categoryName={'My custom exercises'}
          clicked={getCustomExercises}
        />
      ) : null}
    </div>
  ) : (
    <></>
  );
};

export default Search;
