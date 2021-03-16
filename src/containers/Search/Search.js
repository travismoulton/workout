import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import classes from './Search.module.css';
import SearchCategory from '../../components/SearchCategory/SearchCategory';
import SearchSubCategory from '../../components/SearchSubCategory/SearchSubCategory';

const Search = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState('');

  const getSubCategories = (query) => {
    axios.get(`https://wger.de/api/v2/${query}`).then((res) => {
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

  // useEffect(() => {
  //   const displaySubCategoires = subCategories.map((subCat) => (
  //     <SearchSubCategory subCategoryName={subCat['name']} />
  //   ));

  //   console.log(displaySubCategoires);
  // }, [subCategories]);

  const displaySubCategoires = subCategories.map((subCat) => (
    <SearchSubCategory subCategoryName={subCat['name']} key={subCat['id']} />
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
    </div>
  );
};

export default Search;
