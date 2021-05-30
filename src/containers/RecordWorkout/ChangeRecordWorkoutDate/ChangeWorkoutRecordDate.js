import { useState } from 'react';

import Input from '../../../components/UI/Input/Input';
import Modal from '../../../components/UI/Modal/Modal';
import DatePicker from '../../../components/UI/DatePicker/DatePicker';

const ChangeWorkoutRecordDate = (props) => {
  const [dateInput, setDateInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'date',
    },
    value: '',
    validation: {
      required: false,
    },
    label: 'Select workout date',
    valid: true,
    touched: false,
    id: 'date',
  });

  const selectNewDate = () => {
    const dateStr = dateInput.value.split('-');
    props.changeDate(new Date(dateStr[0], --dateStr[1], dateStr[2]));
  };

  const changeDateAndCloseModal = () => {
    selectNewDate();
    props.closeModal();
  };

  const changeDateBtn = (
    <button onClick={changeDateAndCloseModal}>Change Date</button>
  );

  const cancelBtn = <button onClick={props.closeModal}>Cancel</button>;

  return (
    <Modal show={props.show} modalClosed={props.closeModal}>
      <Input
        elementType={dateInput.elementType}
        elementConfig={dateInput.elementConfig}
        label={dateInput.label}
        value={dateInput.value}
        changed={(e) => setDateInput({ ...dateInput, value: e.target.value })}
      />
      {cancelBtn}
      {changeDateBtn}
    </Modal>
  );
};

// const ChangeWorkoutRecordDate = (props) => {
//   const onChange = () => {
//     console.log('onChange');
//   };
//   return (
//     <Modal show={props.show} modalClosed={props.closeModal}>
//       <DatePicker onChange={onChange} />
//       {/* {cancelBtn}
//       {changeDateBtn} */}
//     </Modal>
//   );
// };

export default ChangeWorkoutRecordDate;
