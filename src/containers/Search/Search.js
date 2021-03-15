import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import classes from './Search.module.css';
import SearchCategory from '../../components/SearchCategory/SearchCategory';

const Search = () => {
  const [subCategories, setSubCategories] = useState([]);

  const getSubCategories = (query) => {
    axios.get(`https://wger.de/api/v2/${query}`).then((res) => {
      setSubCategories(res.data.results);
    });
  };

  useEffect(() => {
    console.log(subCategories);
  }, [subCategories]);

  return (
    <div>
      <SearchCategory
        categoryName={'Exercise Category'}
        clicked={() => getSubCategories('exercisecategory')}
      />
      <SearchCategory
        categoryName={'Muscle'}
        clicked={() => getSubCategories('muscle')}
      />
      <SearchCategory
        categoryName={'Equipment'}
        clicked={() => getSubCategories('equipment')}
      />
    </div>
  );
};

export default Search;
