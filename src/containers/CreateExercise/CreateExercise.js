import { useState, useEffect } from 'react';

import Input from '../../components/UI/Input/Input';
import SubmitExerciseBtn from './SubmitExerciseBtn/SubmitExerciseBtn';
import { updateObject, checkValidityHandler } from '../../shared/utility';
import wgerDict from '../../shared/wgerDict';
import classes from './CreateExercise.module.css';

const CreateExercise = (props) => {
  const [muscleSelectOptionsDone, setMuscleSelectOptionsDone] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);
  const [requiredEquipmentList, setRequiredEquipmentList] = useState({
    1: { name: 'Barbell', checked: false },
    8: { name: 'Bench', checked: false },
    3: { name: 'Dumbbell', checked: false },
    4: { name: 'Gym mat', checked: false },
    9: { name: 'Incline bench', checked: false },
    10: { name: 'Kettlebell', checked: false },
    7: { name: 'Body weight', checked: false },
    6: { name: 'Pull-up bar', checked: false },
    5: { name: 'Swiss Ball', checked: false },
    2: { name: 'SZ-Bar', checked: false },
  });

  const [secondaryMusclesUsed, setSecondaryMusclesUsed] = useState(null);

  const [exerciseNameInput, setExerciseNameInput] = useState({
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Exercise name',
    },
    value: '',
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    id: 'name',
    className: 'ExerciseName',
  });
  const [descriptionInput, setDescriptionInput] = useState({
    elementType: 'textarea',
    elementConfig: {
      placeholder: 'Description of exercise...',
    },
    value: '',
    validation: {
      required: false,
    },
    valid: false,
    touched: false,
    id: 'description',
    className: 'CreateExerciseDescription',
  });
  const [categoryInput, setCategoryInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: [
        { value: '', label: '' },
        { value: 10, label: 'Abs' },
        { value: 8, label: 'Arms' },
        { value: 12, label: 'Back' },
        { value: 14, label: 'Calves' },
        { value: 11, label: 'Chest' },
        { value: 9, label: 'Legs' },
        { value: 13, label: 'Shoulders' },
        { value: 99, label: 'All Body' },
        { value: 98, label: 'Cardio' },
      ],
    },
    value: 0,
    label: 'Exercise Category',
    validation: {
      required: true,
    },
    valid: false,
    touched: false,
    id: 'category',
    className: 'CreateExerciseSelect',
    wrapperClass: 'CreateExerciseSelectWrapper',
  });
  const [primaryMuscleInput, setPrimaryMuscleInputInput] = useState({
    elementType: 'select',
    elementConfig: {
      options: [{ value: '', label: '' }],
    },
    value: 0,
    label: 'Primary Muscle',
    validation: {
      required: false,
    },
    valid: true,
    touched: false,
    id: 'primaryMuscle',
    className: 'CreateExerciseSelect',
  });

  useEffect(() => {
    document.title = 'Create Custom Exercise';
  }, []);

  const checkBoxTemplate = {
    elementType: 'input',
    elementConfig: {
      type: 'checkbox',
    },
    value: false,
    validation: { required: false },
    valid: true,
    touched: false,
    checked: false,
    label: null,
    className: 'Checkbox',
  };

  const equipment = () => {
    const equipment = [];
    for (const key in wgerDict.equipment) {
      equipment.push({ code: key, name: wgerDict.equipment[key] });
    }
    return equipment;
  };

  const equipmentCheckboxes = equipment().map((equip) => {
    const checkbox = { ...checkBoxTemplate, label: equip.name };

    const changed = (equipmentCode) =>
      setRequiredEquipmentList((prevEquipment) => ({
        ...prevEquipment,
        [equipmentCode]: {
          ...prevEquipment[equipmentCode],
          checked: !prevEquipment[equipmentCode].checked,
        },
      }));
    return (
      <Input
        elementType={checkbox.elementType}
        elementConfig={checkbox.elementConfig}
        value={checkbox.value}
        label={checkbox.label}
        key={checkbox.label}
        changed={() => changed(equip.code)}
      />
    );
  });

  const muscles = () => {
    const muscles = [];
    for (const key in wgerDict.muscles) {
      muscles.push({ code: key, name: wgerDict.muscles[key].name });
    }
    return muscles;
  };

  const muscleCheckboxes = muscles().map((muscle) => {
    const checkbox = { ...checkBoxTemplate, label: muscle.name };

    const changed = (muscleCode) =>
      setSecondaryMusclesUsed((prevMuscle) => ({
        ...prevMuscle,
        [muscleCode]: {
          ...prevMuscle[muscleCode],
          checked: !prevMuscle[muscleCode].checked,
        },
      }));
    return (
      <Input
        elementType={checkbox.elementType}
        elementConfig={checkbox.elementConfig}
        value={checkbox.value}
        label={checkbox.label}
        key={checkbox.label}
        changed={() => changed(muscle.code)}
      />
    );
  });

  const formFields = [
    exerciseNameInput,
    descriptionInput,
    categoryInput,
    primaryMuscleInput,
  ];

  useEffect(() => {
    if (!muscleSelectOptionsDone) {
      let options = [{ value: 0, label: '' }];
      for (const key in wgerDict.muscles) {
        options.push({ value: key, label: wgerDict.muscles[key].name });
      }
      setPrimaryMuscleInputInput({
        ...primaryMuscleInput,
        elementConfig: { ...primaryMuscleInput.elementConfig, options },
      });
      setMuscleSelectOptionsDone(true);
    }
  }, [muscleSelectOptionsDone, primaryMuscleInput]);

  useEffect(() => {
    if (!secondaryMusclesUsed) {
      const muscles = {};
      for (const key in wgerDict.muscles) {
        muscles[key] = { name: wgerDict.muscles[key].name, checked: false };
      }
      setSecondaryMusclesUsed(muscles);
    }
  }, [secondaryMusclesUsed]);

  const checkFormValidity = (updatedInput) => {
    if (updatedInput.id === 'name') {
      setFormIsValid(updatedInput.valid && categoryInput.valid);
    } else if (updatedInput.id === 'category') {
      setFormIsValid(updatedInput.valid && exerciseNameInput.valid);
    }
  };

  const updateFormState = (updatedInput) => {
    updatedInput.id === 'name'
      ? setExerciseNameInput(updatedInput)
      : updatedInput.id === 'category'
      ? setCategoryInput(updatedInput)
      : updatedInput.id === 'primaryMuscle'
      ? setPrimaryMuscleInputInput(updatedInput)
      : updatedInput.id === 'description'
      ? setDescriptionInput(updatedInput)
      : // TODO: Need actional error handling
        (() => {
          throw new Error();
        })();
  };

  const inputChangedHandler = (e, input) => {
    if (e.target) e.value = e.target.value;

    const updatedInput = updateObject(input, {
      value:
        input.elementType === 'select'
          ? input.elementConfig.options.filter(
              (option) => option.value === e.value
            )[0]
          : e.value,
      valid: checkValidityHandler(e.value.toString(), input.validation),
      touched: true,
    });

    updateFormState(updatedInput);

    checkFormValidity(updatedInput);
  };

  const form = formFields.map((field) => (
    <Input
      elementConfig={field.elementConfig}
      elementType={field.elementType}
      value={field.value}
      label={field.label}
      key={field.id}
      changed={(e) => inputChangedHandler(e, field)}
      required={field.validation.required}
      classname={field.className}
      wrapperClass={field.wrapperClass}
    />
  ));

  const getEquipmentUsed = () => {
    let equipment = [];
    for (let key in requiredEquipmentList) {
      if (requiredEquipmentList[key].checked) equipment.push(key);
    }
    return equipment;
  };

  const getSecondaryMusclesUsed = () => {
    let muscles = [];
    for (let key in secondaryMusclesUsed) {
      if (secondaryMusclesUsed[key].checked) muscles.push(key);
    }
    return muscles;
  };

  return (
    <>
      {form}
      <h4>Select all needed equipment</h4>
      <div className={`${classes.CheckBoxGroup} ${classes.EquipmentBoxes}`}>
        {equipmentCheckboxes}
      </div>
      <h4>Select all secondary muscles worked</h4>
      <div className={`${classes.CheckBoxGroup} ${classes.MuscleBoxes}`}>
        {muscleCheckboxes}
      </div>
      <SubmitExerciseBtn
        formIsValid={formIsValid}
        nameIsValid={exerciseNameInput.valid}
        categoryIsValid={categoryInput.valid}
        title={exerciseNameInput.value}
        description={descriptionInput.value || ''}
        category={categoryInput.value}
        primaryMuscle={
          primaryMuscleInput.value ? [primaryMuscleInput.value.value * 1] : null
        }
        equipment={getEquipmentUsed()}
        secondaryMuscles={getSecondaryMusclesUsed()}
        history={props.history}
      />
    </>
  );
};

export default CreateExercise;
