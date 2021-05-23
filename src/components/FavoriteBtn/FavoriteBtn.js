import { useSelector, useDispatch } from 'react-redux';

import classes from './FavoriteBtn.module.css';
import { addToFavorites, removeFromFavorites } from '../../store/actions/';

const FavoriteBtn = (props) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const toggleFavoritesHandler = () =>
    props.isFavorite
      ? dispatch(removeFromFavorites(user.authUser.uid, props.firebaseId))
      : dispatch(addToFavorites(user.authUser.uid, props.exerciseId));

  const btnClasses = [
    classes.Btn,
    props.isFavorite ? classes.Favorite : classes.NotFavorite,
  ];

  return (
    <button onClick={toggleFavoritesHandler} className={btnClasses.join(' ')}>
      {props.isFavorite ? 'Unfavorite' : 'Favorite'}
    </button>
  );
};

export default FavoriteBtn;
