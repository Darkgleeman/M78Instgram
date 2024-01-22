import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { PropTypes } from 'prop-types';

const BadActionModal = ({ title, description, onCloseFn = null }) => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const handleDefaultClose = () => {
    localStorage.clear();
    setShowModal(false);
    navigate('/login');
  };

  if (!showModal) return null;

  return (
    <Modal
      open={showModal}
      onClose={onCloseFn || handleDefaultClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      disableAutoFocus
    >
      <Box
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'absolute',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '22rem',
        }}
        >
        <h2 id="modal-title">{title}</h2>
        <p id="modal-description">{description}</p>

        <Button
          variant="contained"
          color="primary"
          onClick={onCloseFn || handleDefaultClose}
          style={{ marginTop: '20px' }}
        >
          OK
        </Button>
      </Box>
    </Modal>
  );
};

BadActionModal.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onCloseFn: PropTypes.func,
};

export default BadActionModal;
