import classes from './Input.module.css';

const Input = (props) => {
  let inputElement = null;
  const inputClasses = [classes[props.className]];
  if (props.invalid && props.touched) inputClasses.push(classes.Invalid);

  switch (props.elementType) {
    case 'input':
      if (props.elementConfig.type === 'text')
        inputClasses.push(classes.TextInput);
      inputElement = (
        <div>
          {props.label ? <label>{props.label}</label> : null}
          <input
            {...props.elementConfig}
            value={props.value}
            onChange={props.changed}
            autoComplete="false"
            className={inputClasses.join(' ')}
          />
        </div>
      );
      break;

    case 'select':
      inputElement = (
        <div>
          {props.label ? <label>{props.label}</label> : null}
          <select
            {...props.elementConfig}
            value={props.value}
            onChange={props.changed}
          >
            {props.elementConfig.options.map((option) => (
              <option value={option.value} key={option.value}>
                {option.displayValue}
              </option>
            ))}
          </select>
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
        </div>
      );
      break;

    default:
      inputElement = <p>Something went wrong</p>;
  }

  return inputElement;
};

export default Input;
