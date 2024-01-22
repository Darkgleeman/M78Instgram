import React from 'react';
import './ErrorPage.css';
import { PropTypes } from 'prop-types';

export default function ErrorPage({ message }) {
  return (
    <div className="error-box">
      <p className="error-msg"> Sorry, this page is not available. </p>
      {message
        || <p>
          The link you followed may be broken, or the page may have been removed.
          Please Check your URL and login status.
        </p>
      }
    </div>
  );
}

ErrorPage.propTypes = {
  message: PropTypes.string,
};
