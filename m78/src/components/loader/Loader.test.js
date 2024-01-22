import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'; // Make sure to import this

import Loader from './Loader';

describe('Loader component', () => {
  test('renders loading text', () => {
    const { getByText } = render(<Loader />);
    const loadingText = getByText('Loading...');
    expect(loadingText).toBeInTheDocument();
  });

  test('renders with the correct class names', () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toHaveClass('loader-container');
    expect(container.querySelector('.loader')).toBeInTheDocument();
    expect(container.querySelector('.loader-text')).toBeInTheDocument();
  });
});
