import classes from './SearchCategory.module.css';

const SearchCategory = (props) => (
  <div className={classes.SearchCategory} onClick={props.clicked}>
    {props.categoryName}
    <span
      className={`${
        props.categoryOpen ? 'ArrowDownWhite' : 'ArrowRightWhite'
      } ${classes.Arrow}`}
    ></span>
  </div>
);

export default SearchCategory;
