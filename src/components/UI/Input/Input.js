const Input = (props) => {
  let inputElement = null;

  switch (props.elementType) {
    case 'input':
      inputElement = (
        <div>
          {props.label ? <label>{props.label}</label> : null}
          <input
            {...props.elementConfig}
            value={props.value}
            onChange={props.changed}
            autoComplete="false"
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

    default:
      inputElement = <p>Something went wrong</p>;
  }

  return <div>{inputElement}</div>;
};

export default Input;
