// import React from 'react';
// import './Loader.css';
// import PropTypes from 'prop-types';

// function Loader() {
//   return (
//     <div className="loader-container">
//       <div className="loader"></div>
//       <div className="loader-text">Loading...</div>
//     </div>
//   );
// }

// export default Loader;
// Loader.js
import React from 'react';
import './Loader.css';
import PropTypes from 'prop-types';

function Loader({ text }) {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <div className="loader-text">{text || 'Loading...'}</div>
    </div>
  );
}

Loader.propTypes = {
  text: PropTypes.string,
};

export default Loader;
