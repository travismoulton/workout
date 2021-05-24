import Select, { components } from 'react-select';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import classes from './Input.module.css';

const Input = (props) => {
  let inputElement = null;
  const inputClasses = [classes[props.classname]];
  if (props.invalid && props.touched) inputClasses.push(classes.Invalid);
  console.log(props.classname);

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

    // case 'select':
    //   inputElement = (
    //     <div className={classes.SelectMenuGroup}>
    //       {props.label && (
    //         <label className={classes.SelectLabel}>{props.label}</label>
    //       )}
    //       <div>
    //         <select
    //           {...props.elementConfig}
    //           value={props.value}
    //           onChange={props.changed}
    //           className={inputClasses.join(' ')}
    //         >
    //           {props.elementConfig.options.map((option) => (
    //             <option value={option.value} key={option.value}>
    //               {option.displayValue}
    //             </option>
    //           ))}
    //         </select>
    //       </div>
    //       {props.required ? <span>*</span> : null}
    //     </div>
    //   );
    //   break;

    case 'select':
      const DropDownIndicator = (props) => (
        <components.DropdownIndicator {...props}>
          <FiChevronUp />
        </components.DropdownIndicator>
      );

      const customStyles = {
        option: (provided, state) => ({
          ...provided,
          textAlign: 'left',
          height: '4rem',
          backgroundColor: state.isSelected
            ? '#00bbff'
            : state.isFocused
            ? '#99e6ff'
            : '#fff',
        }),
      };
      inputElement = (
        <div className={classes.SelectMenuGroup}>
          {props.label && (
            <label className={classes.SelectLabel}>{props.label}</label>
          )}
          <div>
            <Select
              className={inputClasses.join(' ')}
              onChange={props.changed}
              options={props.elementConfig.options}
              styles={customStyles}
              components={{ DropDownIndicator }}
            />
          </div>
          {props.required ? <span>*</span> : null}
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
