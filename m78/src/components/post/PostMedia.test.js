import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PropTypes from 'prop-types';
import PostMedia from './PostMedia';

jest.mock('../error_page/ErrorPage', () => 'mocked-error-page');

describe('PostMedia Component', () => {
  const props = {
    mediaURL: 'https://example.com/image.jpg',
    mediaType: 'image',
  };

  it('renders the image when mediaType is image', () => {
    const { getByAltText } = render(<PostMedia {...props} />);

    expect(getByAltText('post img')).toBeInTheDocument();
  });

  it('renders the video when mediaType is video', () => {
    const videoProps = {
      mediaURL: 'https://example.com/video.mp4',
      mediaType: 'video',
    };
    const { getByAltText } = render(<PostMedia {...videoProps} />);

    expect(getByAltText('post video')).toBeInTheDocument();
  });

  it('renders ErrorPage when mediaType is neither image nor video', () => {
    const unknownProps = {
      mediaURL: 'https://example.com/unknown',
      mediaType: 'unknown',
    };
    const { getByText } = render(<PostMedia {...unknownProps} />);

    expect(getByText('Error Page')).toBeInTheDocument();
  });

  it('has the correct prop types', () => {
    expect(PostMedia.propTypes.mediaURL).toBe(PropTypes.string.isRequired);
    expect(PostMedia.propTypes.mediaType).toBe(PropTypes.string.isRequired);
  });
});
