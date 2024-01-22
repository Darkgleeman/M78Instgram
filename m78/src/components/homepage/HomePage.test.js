import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HomePage from './HomePage';
// import { getRecommendFollow } from '../../api/follows';
import '@testing-library/jest-dom';

// jest.mock('../../api/users', () => ({
//   getRecommendFollow: jest.fn(),
// }));
jest.mock('../../api/follows');

describe('HomePage component', () => {
  test('renders the homepage', async () => {
    render(
      <HomePage userID={1} />,
    );

    await waitFor(() => {
      expect(screen.queryByText('Sorry, this page is not available.')).not.toBeInTheDocument();
    });
  });
});
