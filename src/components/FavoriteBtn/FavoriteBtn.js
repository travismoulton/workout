import { useSelector, useDispatch } from 'react-redux';
import { GoThumbsup, GoThumbsdown } from 'react-icons/go';

import classes from './FavoriteBtn.module.css';
import { addToFavorites, removeFromFavorites } from '../../store/actions/';

const FavoriteBtn = (props) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { uid, za: accessToken } = user.authUser;

  const toggleFavoritesHandler = () =>
    props.isFavorite
      ? dispatch(removeFromFavorites(uid, props.firebaseId, accessToken))
      : dispatch(addToFavorites(uid, props.exerciseId, accessToken));

  const btnClasses = [
    classes.Btn,
    props.isFavorite ? classes.Favorite : classes.NotFavorite,
  ];

  return (
    <button onClick={toggleFavoritesHandler} className={btnClasses.join(' ')}>
      {props.isFavorite ? 'Unfavorite' : 'Favorite'}
      {props.isFavorite ? (
        <GoThumbsdown className={classes.Icon} />
      ) : (
        <GoThumbsup className={classes.Icon} />
      )}
    </button>
  );
};

export default FavoriteBtn;
