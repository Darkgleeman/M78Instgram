import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PostHeader from './PostHeader';
import '@testing-library/jest-dom/extend-expect';

describe('PostHeader Component', () => {
  const props = {
    avatarURL: 'avatar-url',
    username: 'John Doe',
    timestamp: '2023-10-18T12:00:00Z',
    location: 'New York',
    userID: 123,
  };

  it('renders the component with the correct props', () => {
    const { getByText, getByAltText } = render(
      <MemoryRouter>
        <PostHeader {...props} />
      </MemoryRouter>
    );

    expect(getByAltText('John Doe')).toBeInTheDocument();
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('New York')).toBeInTheDocument();
    expect(getByText('1d')).toBeInTheDocument();
  });

  it('contains a link to the user profile', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostHeader {...props} />
      </MemoryRouter>
    );

    const linkElement = getByText('John Doe').closest('a');

    expect(linkElement).toHaveAttribute('href', '/profile/123');
  });

  it('has the correct prop types', () => {
    expect(PostHeader.propTypes.avatarURL).toBe(PropTypes.string.isRequired);
    expect(PostHeader.propTypes.username).toBe(PropTypes.string.isRequired);
    expect(PostHeader.propTypes.timestamp).toBe(PropTypes.string.isRequired);
    expect(PostHeader.propTypes.location).toBe(PropTypes.string);
    expect(PostHeader.propTypes.userID).toBe(PropTypes.string.isRequired);
  });
});
