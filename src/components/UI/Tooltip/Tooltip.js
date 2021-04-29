import classes from './Tooltip.module.css';

const Tooltip = (props) => (
  <div className={classes.Tooltip} style={{ left: props.x, top: props.y }}>
    {props.children}
  </div>
);

export default Tooltip;
