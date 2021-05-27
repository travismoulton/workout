import Select, { components } from 'react-select';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import classes from './CustomSelect.module.css';

const CustomSelect = (props) => {
  const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
      {props.selectProps.menuIsOpen ? <FiChevronUp /> : <FiChevronDown />}
    </components.DropdownIndicator>
  );

  const defaultValue = props.options.filter(
    (option) => option.value === props.value
  )[0];

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
      color: (state.isFocused || state.isSelected) && '#fff',
      fontWeight: (state.isFocused || state.isSelected) && '700',
    }),
    control: (provided, state) => ({
      ...provided,
      boxShadow: state.menuIsOpen && '0 2px 2px 2px rgba(0, 191, 255, 0.3)',
      borderColor: state.menuIsOpen ? '#00bbff' : 'hsl(0, 0%, 80%)',

      // clipPath:
      //   props.setClipPath && 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)',
      // padding: props.setClipPath && '0 2rem',
      // zIndex: props.setClipPath && '2',

      ':hover': {
        ...provided[':hover'],
        borderColor: '#00bbff',
      },
    }),
  };
  return (
    <Select
      className={classes[props.inputClasses]}
      onChange={props.changed}
      options={props.options}
      styles={customStyles}
      components={{ DropdownIndicator }}
      defaultValue={defaultValue}
    />
  );
};

export default CustomSelect;
