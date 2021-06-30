import { unmountComponentAtNode } from 'react-dom';
import { customRender, screen, getByLabelText } from '../../shared/testUtils';
import userEvent from '@testing-library/user-event';

import Search from './Search';

describe('<Search />', () => {
  let container = null;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  test('renders ExerciseCategory div', async () => {
    const props = { location: { pathname: '/search' } };
    customRender(<Search {...props} />);
    screen.debug();

    const exerciseCategoryElement = screen.getByText('Exercise Category', {
      exact: false,
    });

    console.log(exerciseCategoryElement);
    expect(exerciseCategoryElement).toBeInTheDocument();
  });
});
