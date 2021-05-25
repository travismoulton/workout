import classes from './Input.module.css';
import CustomSelect from './CustomSelect/CustomSelect';

const Input = (props) => {
  let inputElement = null;
  const inputClasses = [classes[props.classname] || props.classname];
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
          {props.required ? <span>*</span> : null}
        </div>
      );
      break;

    case 'select':
      inputElement = (
        <CustomSelect
          inputClasses={inputClasses.join(' ')}
          label={props.label}
          required={props.required}
          changed={props.changed}
          options={props.elementConfig.options}
          value={props.value}
        />
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

// const DropdownIndicator = (props) => (
//   <components.DropdownIndicator {...props}>
//     {props.selectProps.menuIsOpen ? <FiChevronUp /> : <FiChevronDown />}
//   </components.DropdownIndicator>
// );

// const customStyles = {
//   option: (provided, state) => ({
//     ...provided,
//     textAlign: 'left',
//     height: '4rem',
//     backgroundColor: state.isSelected
//       ? '#00bbff'
//       : state.isFocused
//       ? '#99e6ff'
//       : '#fff',
//   }),
//   control: (provided, state) => ({
//     ...provided,
//     boxShadow: state.menuIsOpen && '0 2px 2px 2px rgba(0, 191, 255, 0.3)',
//     borderColor: state.menuIsOpen ? '#00bbff' : 'hsl(0, 0%, 80%)',

//     ':focus': {
//       ...provided[':focus'],
//     },
//     ':hover': {
//       ...provided[':hover'],
//       borderColor: '#00bbff',
//     },
//   }),
// };
// inputElement = (
//   <div className={classes.SelectMenuGroup}>
//     {props.label && (
//       <label className={classes.SelectLabel}>{props.label}</label>
//     )}
//     <div>
//       <Select
//         className={inputClasses.join(' ')}
//         onChange={props.changed}
//         options={props.elementConfig.options}
//         styles={customStyles}
//         components={{ DropdownIndicator }}
//       />
//     </div>
//     {props.required ? <span>*</span> : null}
//   </div>
// );
