import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserStatsBar from './UserStatsBar';
import '@testing-library/jest-dom/extend-expect'; // Import necessary extend-expect

describe('UserStatsBar component', () => {
  const fans = ['Fan1', 'Fan2', 'Fan3'];
  const followings = ['Following1', 'Following2'];
  const posts = ['Post1', 'Post2', 'Post3'];
  const userID = 123;

  test('renders user statistics with correct values and links', () => {
    render(
      <MemoryRouter>
        <UserStatsBar fans={fans} followings={followings} posts={posts} userID={userID} />
      </MemoryRouter>
    );

    const fansLink = screen.getByText(`${fans.length} Fans`);
    const followingsLink = screen.getByText(`${followings.length} Followings`);
    const postsLink = screen.getByText(`${posts.length} Posts`);

    expect(fansLink).toBeInTheDocument();
    expect(followingsLink).toBeInTheDocument();
    expect(postsLink).toBeInTheDocument();

    expect(fansLink).toHaveAttribute('href', `/followers/${userID}`);
    expect(followingsLink).toHaveAttribute('href', `/followings/${userID}`);
    expect(postsLink).toHaveAttribute('href', '/posts');
  });
});
