import classes from './SearchCategory.module.css';

const SearchCategory = (props) => {
  return (
    <div className={classes.SearchCategory} onClick={props.clicked}>
      {props.categoryName}
    </div>
  );
};

export default SearchCategory;
