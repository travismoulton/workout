import { Link } from 'react-router-dom';

import classes from './SearchSubCategory.module.css';

const SearchSubCategory = (props) => {
  return (
    <Link
      to={{
        pathname: `/results/${props.category}/${props.subCategoryName}`,
        state: {
          subCategory: props.subCategoryName,
          id: props.id,
          category: props.category,
        },
      }}
      className={classes.SearchSubCategory}
    >
      {props.subCategoryName}
    </Link>
  );
};

export default SearchSubCategory;
