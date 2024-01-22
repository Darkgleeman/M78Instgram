import React from 'react';
import { render } from '@testing-library/react';
import ErrorPage from './ErrorPage';

describe('ErrorPage Component', () => {
  test('renders the error message correctly', () => {
    const { getByText } = render(<ErrorPage />);
    const errorMessage = getByText(/Sorry, this page is not available/i);
    expect(errorMessage).toBeTruthy();
  });

  test('renders the secondary message correctly', () => {
    const { getByText } = render(<ErrorPage />);
    const secondaryMessage = getByText(/The link you followed may be broken, or the page may have been removed/i);
    expect(secondaryMessage).toBeTruthy();
  });
});
