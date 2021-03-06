import classes from './SearchCategory.module.css';

const SearchCategory = (props) => (
  <div
    className={`${classes.SearchCategory} ${classes.SearchCategory__mainCategory}`}
    onClick={props.clicked}
    data-testid={props.categoryName}
  >
    {props.categoryName}
    <span
      className={`${
        props.categoryOpen ? 'ArrowDownWhite' : 'ArrowRightWhite'
      } ${classes.Arrow}`}
    ></span>
  </div>
);

export default SearchCategory;
