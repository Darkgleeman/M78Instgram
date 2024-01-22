import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Followers from './Followers';
import * as followsApi from '../../api/follows';

jest.mock('../../api/follows');

describe('Followers component', () => {
  test('renders without error', () => {
    render(
      <MemoryRouter initialEntries={['/followers/1']}>
        <Routes>
          <Route path="/followers/:userID" element={<Followers />} />
        </Routes>
      </MemoryRouter>
    );
    const titleElement = screen.getByText(/Followers/i);
    expect(titleElement).toBeTruthy();
  });

  test('displays error message when followers cannot be fetched', async () => {
    followsApi.getFollowersByUserID.mockRejectedValueOnce(new Error('API is down'));

    render(
      <MemoryRouter initialEntries={['/followers/1']}>
        <Routes>
          <Route path="/followers/:userID" element={<Followers />} />
        </Routes>
      </MemoryRouter>
    );
    const errorMessage = await screen.findByText(/Sorry, this page is not available/i);
    expect(errorMessage).toBeTruthy();
  });
});
