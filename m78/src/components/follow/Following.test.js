// Existing code

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Followings from './Followings';
import * as api from '../../api/follows'; // Update the import to point to the correct module

jest.mock('../../api/follows'); // Update the path to point to the correct module

describe('Followings component', () => {
  test('renders without error', () => {
    render(
      <MemoryRouter initialEntries={['/followings/1']}>
        <Routes>
          <Route path="/followings/:userID" element={<Followings />} />
        </Routes>
      </MemoryRouter>,
    );
    const titleElement = screen.queryByText(/Followings/i);
    expect(titleElement).toBeTruthy();
  });

  test('displays error message when followings cannot be fetched', async () => {
    api.getFollowingsByUserID.mockRejectedValueOnce(new Error('API is down')); // Make sure the mock is properly set
    render(
      <MemoryRouter initialEntries={['/followings/1']}>
        <Routes>
          <Route path="/followings/:userID" element={<Followings />} />
        </Routes>
      </MemoryRouter>,
    );
    const errorMessage = await screen.findByText(/Sorry, this page is not available/i);
    expect(errorMessage).toBeTruthy();
  });
});
