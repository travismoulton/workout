import classes from './Input.module.css';
import CustomSelect from './CustomSelect/CustomSelect';
import IncrementBtn from '../../IncrementBtn/IncrementBtn';
import DecrementBtn from '../../DecrementBtn/DecrementBtn';

const Input = (props) => {
  let inputElement = null;
  const inputClasses = [classes[props.classname] || props.classname];
  if (props.invalid && props.touched) inputClasses.push(classes.Invalid);

  switch (props.elementType) {
    case 'input':
      if (
        props.elementConfig.type === 'text' ||
        props.elementConfig.type === 'password' ||
        props.elementConfig.type === 'email'
      )
        inputClasses.push(classes.TextInput);

      inputElement = (
        <div
          className={classes[props.wrapperClass]}
          style={{ position: 'relative' }}
        >
          {props.label ? <label>{props.label}</label> : null}
          <input
            {...props.elementConfig}
            value={props.value}
            onChange={props.changed}
            autoComplete="false"
            className={inputClasses.join(' ')}
          />
          {props.required && <span className={classes.InputAsteric}>*</span>}
        </div>
      );
      break;

    case 'select':
      inputElement = (
        <div className={classes[props.wrapperClass]}>
          {props.label && (
            <label className={classes.SelectLabel}>{props.label}</label>
          )}
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {props.SetDetails && (
              <DecrementBtn clicked={props.decrementFunction} />
            )}
            <CustomSelect
              inputClasses={inputClasses.join(' ')}
              label={props.label}
              required={props.required}
              changed={props.changed}
              options={props.elementConfig.options}
              value={props.value}
              isSearchable={!props.notSearchable}
            />
            {props.SetDetails && (
              <IncrementBtn clicked={props.incrementFunction} />
            )}
            {props.required && <span className={classes.SelectAsteric}>*</span>}
          </span>
        </div>
      );

      break;

    case 'textarea':
      inputElement = (
        <div>
          {props.label && <label>{props.label}</label>}
          <textarea
            {...props.elementConfig}
            value={props.value}
            onChange={props.changed}
            autoComplete="false"
            className={inputClasses.join(' ')}
          ></textarea>
          {props.required && <span>*</span>}
        </div>
      );
      break;

    default:
      inputElement = <p>Something went wrong</p>;
  }

  return inputElement;
};

export default Input;
