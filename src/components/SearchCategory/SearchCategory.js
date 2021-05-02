import classes from './SearchCategory.module.css';

const SearchCategory = (props) => (
  <div className={classes.SearchCategory} onClick={props.clicked}>
    {props.categoryName}
  </div>
);

export default SearchCategory;
