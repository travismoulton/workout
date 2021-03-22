import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ExerciseDetailCategory from '../../components/ExerciseDetails/ExerciseDetailCategory/ExerciseDetailCategory';
import ExerciseDetailEquipment from '../../components/ExerciseDetails/ExerciseDetailEquipment/ExerciseDetailEquipment';

const ExerciseDetail = (props) => {
  const [exercise, setExercise] = useState({});
  const [equipment, setEquipment] = useState([]);
  const wgerDict = useSelector((state) => state.wgerDict);

  useEffect(() => {
    axios
      .get(`https://wger.de/api/v2/exercise/${props.location.state.id}`)
      .then((res) => {
        setExercise(res.data);
        setEquipment(res.data.equipment);
      });
  }, [props.location.state.id]);

  return (
    <div>
      <h3>{exercise.name}</h3>
      <ExerciseDetailCategory
        category={wgerDict.exerciseCategoryList[exercise.category]}
      />
      <ExerciseDetailEquipment
        equipment={equipment.map((el) => wgerDict.equipment[el])}
      />
    </div>
  );
};

export default ExerciseDetail;
