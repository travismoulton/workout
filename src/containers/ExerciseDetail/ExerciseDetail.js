import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ExerciseDetailCategory from '../../components/ExerciseDetails/ExerciseDetailCategory/ExerciseDetailCategory';
import ExerciseDetailEquipment from '../../components/ExerciseDetails/ExerciseDetailEquipment/ExerciseDetailEquipment';
import ExerciseDetailDescription from '../../components/ExerciseDetails/ExerciseDetailDescription/ExerciseDetailDescription';
import ExerciseDetailMuscles from '../../components/ExerciseDetails/ExerciseDetailMuscles/ExerciseDetailMuscles';

const ExerciseDetail = (props) => {
  const [exercise, setExercise] = useState();

  const wgerDict = useSelector((state) => state.wgerDict);

  useEffect(() => {
    axios
      .get(`https://wger.de/api/v2/exercise/${props.location.state.id}`)
      .then((res) => setExercise(res.data));
  }, [props.location.state.id]);

  const display = exercise ? (
    <div>
      <h3>{exercise.name}</h3>
      <ExerciseDetailCategory
        category={wgerDict.exerciseCategoryList[exercise.category]}
      />
      <ExerciseDetailEquipment
        equipment={exercise.equipment.map((el) => wgerDict.equipment[el])}
      />
      <ExerciseDetailDescription
        description={exercise.description.substring(
          3,
          exercise.description.length - 4
        )}
      />
      <ExerciseDetailMuscles
        muscles={exercise.muscles.map((muscle) => wgerDict.muscles[muscle])}
        secondary={exercise.muscles_secondary.map(
          (muscle) => wgerDict.muscles[muscle]
        )}
      />
    </div>
  ) : null;

  return <>{display}</>;
};

export default ExerciseDetail;
