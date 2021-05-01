import axios from 'axios';
import { useState } from 'react';

import classes from './Search.module.css';
import SearchCategory from '../../components/SearchCategory/SearchCategory';
import SearchSubCategory from '../../components/SearchSubCategory/SearchSubCategory';

const Search = (props) => {
  const [subCategories, setSubCategories] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState('');

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
    props.history.push('/results/my-custom-exercises');
  };

  const displaySubCategoires = subCategories.map((subCat) => (
    <SearchSubCategory
      subCategoryName={subCat['name']}
      key={subCat['id']}
      id={subCat['id']}
      category={categoryOpen}
    />
  ));

  return (
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
      <SearchCategory
        categoryName={'My custom exercises'}
        clicked={getCustomExercises}
      />
    </div>
  );
};

export default Search;
