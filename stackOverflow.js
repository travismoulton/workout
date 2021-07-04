// import { useState, useEffect } from 'react';
// import axios from 'axios';

// import Spinner from 'path-to-spinner';

// const Example = () => {
//   const [data1, setData1] = useState(null);
//   const [data2, setData2] = useState(null);
//   const [data3, setData3] = useState(null);
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     if (!data1 && !data2 && !data3) {
//       axios.get('apiResource1').then((res) => setData1(res.data));
//       axios.get('apiResource2').then((res) => setData2(res.data));
//       axios.get('apiResource3').then((res) => setData3(res.data));
//     }
//   }, [data1, data2, data3]);

//   useEffect(() => {
//     if (data1 && data2 && data3 && !loaded) {
//       setLoaded(true);
//     }
//   }, [loaded, data1, data2, data3]);

//   return !loaded ? <Spinner /> : <HTML I want rendered />;
// };

import { customRender, screen, waitFor } from '../../shared/testUtils';

import Search from './Search';
import wgerDict from '../../shared/wgerDict';
import { utils } from './searchUtils';

describe('<Search />', () => {
  test('calls to the wger api', async () => {
    const mockCategories = () => {
      const returnArr = [];
      for (let category in wgerDict.exerciseCategoryList) {
        returnArr.push({ [category]: wgerDict.exerciseCategoryList[category] });
      }
      return returnArr;
    };

    jest
      .spyOn(utils, 'fetchWgerData')
      .mockImplementation(jest.fn(() => Promise.resolve(mockCategories())));
    const testVal = jest.spyOn(utils, 'fetchWgerData');

    const props = { location: { pathname: '/search' } };
    customRender(<Search {...props} />);

    expect(testVal).toHaveBeenCalled();
  });

  test('renders ExerciseCategory div', async () => {
    const mockCategories = () => {
      const returnArr = [];
      for (let category in wgerDict.exerciseCategoryList) {
        returnArr.push({ [category]: wgerDict.exerciseCategoryList[category] });
      }
      return returnArr;
    };

    jest
      .spyOn(utils, 'fetchWgerData')
      .mockImplementation(jest.fn(() => Promise.resolve(mockCategories())));

    const props = { location: { pathname: '/search' } };
    customRender(<Search {...props} />);

    const exerciseCategoryElement = await waitFor(() =>
      screen.getByTestId('Exercise Category')
    );

    screen.debug();

    expect(exerciseCategoryElement).toBeInTheDocument();
  });
});
