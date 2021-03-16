import classes from './SearchSubCategory.module.css';

const SearchSubCategory = (props) => {
  return (
    <div className={classes.SearchSubCategory}>{props.subCategoryName}</div>
  );
};

export default SearchSubCategory;
