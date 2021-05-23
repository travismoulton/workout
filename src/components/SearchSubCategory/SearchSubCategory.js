import { Link } from 'react-router-dom';
import slugiy from 'slugify';

import classes from '../SearchCategory/SearchCategory.module.css';

const SearchSubCategory = (props) => {
  return (
    <Link
      to={{
        pathname: `/results/${props.category}/${slugiy(props.subCategoryName)}`,
        state: {
          subCategory: props.subCategoryName,
          id: props.id,
          category: props.category,
          wger: true,
        },
      }}
      className={`${classes.SearchCategory} ${classes.SearchCategory__subCategory}`}
    >
      {props.subCategoryName}
    </Link>
  );
};

export default SearchSubCategory;
