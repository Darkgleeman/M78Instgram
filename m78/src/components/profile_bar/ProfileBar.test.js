import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import ProfileBar from './ProfileBar';
import * as followsApi from '../../api/follows';
import '@testing-library/jest-dom';

jest.mock('../../api/follows');

describe('ProfileBar component', () => {
  const stats = {
    username: 'Test User',
    avatarURL: 'test_avatar_url',
    fans: 10,
    followings: 20,
    posts: 30,
  };

  const userID = 123;

  it('renders the component with provided props', () => {
    const { getByText, getByAltText } = render(
      <MemoryRouter>
        <ProfileBar stats={stats} userID={userID} />
      </MemoryRouter>,
    );

    expect(getByText(stats.username)).toBeInTheDocument();
    expect(getByAltText(stats.username)).toBeInTheDocument();
  });
  it('calls handleFollow function on button click', async () => {
    const addFollowMock = jest.fn();
    followsApi.addFollow = addFollowMock;

    const { getByText } = render(
      <MemoryRouter>
        <ProfileBar stats={stats} userID={userID} />
      </MemoryRouter>
    );

    const followButton = getByText('Follow');

    fireEvent.click(followButton);

    await waitFor(() => {
      expect(addFollowMock).toHaveBeenCalledTimes(1);
    });

    // ... Rest of your tests
  });
})