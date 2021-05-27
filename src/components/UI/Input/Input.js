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
      if (props.elementConfig.type === 'text')
        inputClasses.push(classes.TextInput);
      inputElement = (
        <>
          {props.label ? <label>{props.label}</label> : null}
          <input
            {...props.elementConfig}
            value={props.value}
            onChange={props.changed}
            autoComplete="false"
            className={inputClasses.join(' ')}
          />
          {props.required ? <span>*</span> : null}
        </>
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
              // setClipPath={props.setClipPath}
            />
            {props.SetDetails && (
              <IncrementBtn clicked={props.incrementFunction} />
            )}
            {props.required ? <span>*</span> : null}
          </span>
        </div>
      );

      break;

    case 'textarea':
      inputElement = (
        <div>
          {props.label ? <label>{props.label}</label> : null}
          <textarea
            {...props.elementConfig}
            value={props.value}
            onChange={props.changed}
            autoComplete="false"
            className={inputClasses.join(' ')}
          ></textarea>
          {props.required ? <span>*</span> : null}
        </div>
      );
      break;

    default:
      inputElement = <p>Something went wrong</p>;
  }

  return inputElement;
};

export default Input;
