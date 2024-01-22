import { React, useState } from 'react';
import './CreatePost.css';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { createPost, uploadFile } from '../../api/posts';
import Loader from '../loader/Loader';
import { MAX_FILE_SIZE, MEDIA_TYPES, MAX_FILE_SIZE_MB } from '../../constans';
import BadActionModal from '../bad_action_modal/BadActionModal';

function CreatePost({ wantNewPost, updateWantNewPost }) {
  const authorID = localStorage.getItem('userID');
  const [mediaOpen, setMediaOpen] = useState(false);
  const [error, setError] = useState(null);
  // local Url used in video uploading rendering
  const [mediaLocalUrl, setMediaLocalUrl] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    create_timestamp: '',
    location: '',
    media_url: '',
    media_type: '',
    likedByUsers: [],
    hiddenByUsers: [],
    text: '',
    author_id: authorID,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleMediaClose = () => setMediaOpen(false);

  const handleErrorModalClose = () => {
    setError(null);
    updateWantNewPost(false);
  };

  const handleFileChange = async (event) => {
    try {
      setIsLoading(true);

      const file = event.target.files[0];
      if (file) {
      // Check for file type and size
        if (!MEDIA_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) {
          setIsLoading(false);
          setError({
            title: 'Bad File',
            description: !MEDIA_TYPES.has(file.type)
              ? 'Please check your media file type'
              : `Your file exceeds ${MAX_FILE_SIZE_MB} MB`,
          });
          return;
        }

        const fileData = new FormData();
        fileData.append('file_id', file);
        setMediaLocalUrl(URL.createObjectURL(file));

        const fileUrl = await uploadFile(fileData);
        setIsLoading(false);
        setMediaOpen(true);
        const fileType = file.type.split('/')[0];
        setMediaType(fileType);
        setFormData({
          ...formData,
          media_url: fileUrl,
          media_type: fileType,
        });
      }
    } catch (err) {
      setIsLoading(false);
    // Handle any other errors
    }
  };

  const handleSubmit = async () => {
    try {
      const timestamp = new Date().toISOString();
      const updatedData = { ...formData, create_timestamp: timestamp };

      await createPost(updatedData);
      setFormData(updatedData);
      handleMediaClose();
      updateWantNewPost(false);
      window.location.reload();
    } catch (err) {
      // do nothing
    }
  };

  return (
    <div className="newpost-modal-container">
      <Modal
        open={wantNewPost}
        onClose={() => {
          updateWantNewPost(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableAutoFocus
      >
        {isLoading ? (
          <Loader />
        ) : (
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              position: 'absolute',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '22rem',
              height: '10%',
            }}
          >
            <input
              type="file"
              id="file-upload"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </Box>
        )}
      </Modal>

      <Modal
        open={mediaOpen}
        onClose={handleMediaClose}
        aria-labelledby="media-modal-title"
        aria-describedby="media-modal-description"
      >
        <Box
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'absolute',
            backgroundColor: 'white',
            padding: '20px',
            display: 'flex',
            borderRadius: '8px',
          }}
        >
          <Box style={{ flex: '2' }}>
            {mediaType === 'image' && (
              <img
                // src={mediaFile}
                src={mediaLocalUrl}
                alt="Media"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            )}
            {mediaType === 'video' && (
              <iframe
                // src={mediaFile}
                src={mediaLocalUrl}
                alt="post video"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            )}
          </Box>
          <Box style={{ flex: '1', marginLeft: '20px' }}>

            <TextField
              label="Text"
              name="text"
              fullWidth
              variant="outlined"
              style={{ marginTop: '20px' }}
              onChange={handleChange}
            />
            <TextField
              label="Location"
              name="location"
              fullWidth
              variant="outlined"
              style={{ marginTop: '20px' }}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{ marginTop: '20px' }}
            >
              submit
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Error Modal */}
      {error && (
        <BadActionModal
          title={error.title}
          description={error.description}
          onCloseFn={handleErrorModalClose}
        />
      )}
    </div>
  );
}

CreatePost.propTypes = {
  wantNewPost: PropTypes.bool.isRequired,
  updateWantNewPost: PropTypes.func.isRequired,
};
export default CreatePost;
