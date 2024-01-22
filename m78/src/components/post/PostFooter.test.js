import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PropTypes from 'prop-types';
import PostFooter from './PostFooter';

jest.mock('@mui/icons-material/FavoriteBorder', () => 'FavoriteBorderIcon');
jest.mock('@mui/icons-material/Favorite', () => 'FavoriteIcon');

describe('PostFooter Component', () => {
  const props = {
    liked: false,
    updateLiked: jest.fn(),
    username: 'John Doe',
    postText: 'This is a post.',
  };

  it('renders the component with the correct props', () => {
    const { getByText } = render(<PostFooter {...props} />);

    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('This is a post.')).toBeInTheDocument();
  });

  it('calls the updateLiked function when like button is clicked', () => {
    const { getByText } = render(<PostFooter {...props} />);

    const likeButton = getByText('♡');
    fireEvent.click(likeButton);

    expect(props.updateLiked).toHaveBeenCalledTimes(1);
    expect(props.updateLiked).toHaveBeenCalledWith(true);
  });

  it('displays the emoji when emoji button is clicked', () => {
    const { getByText } = render(<PostFooter {...props} />);

    const emojiButton = getByText('😀');
    fireEvent.click(emojiButton);

    expect(getByText('😀')).toBeInTheDocument();
  });

  it('has the correct prop types', () => {
    expect(PostFooter.propTypes.liked).toBe(PropTypes.bool.isRequired);
    expect(PostFooter.propTypes.updateLiked).toBe(PropTypes.func.isRequired);
    expect(PostFooter.propTypes.username).toBe(PropTypes.string.isRequired);
    expect(PostFooter.propTypes.postText).toBe(PropTypes.string.isRequired);
  });
});
