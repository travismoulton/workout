import { customRender, screen, waitFor } from '../../shared/testUtils';

import Search from './Search';
import wgerDict from '../../shared/wgerDict';
import { utils } from './searchUtils';

describe('<Search />', () => {
  test('calls to the wger api', async () => {
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
