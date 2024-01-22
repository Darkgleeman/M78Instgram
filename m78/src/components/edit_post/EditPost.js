import { React, useState, useEffect } from 'react';
import './EditPost.css';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { editPost, getPostByID, uploadFile } from '../../api/posts';
import Loader from '../loader/Loader';

function EditPost({ postID, wantToEdit, updateEdit }) {
  const [mediaOpen, setMediaOpen] = useState(false);
  // const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mediaLocalUrl, setMediaLocalUrl] = useState(null);
  const [formData, setFormData] = useState({
    create_timestamp: '',
    location: '',
    media_url: '',
    media_type: '',
    likedByUsers: [],
    hiddenByUsers: [],
    text: '',
    author_id: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const post = await getPostByID(postID);
        setFormData(post);
      } catch (error) {
        // Handle error
      }
    };
    fetchData();
  }, [postID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleMediaClose = () => setMediaOpen(false);

  const handleFileChange = async (event) => {
    try {
      setIsLoading(true);

      const fileData = new FormData();
      const file = event.target.files[0];
      // console.log(file);
      if (file) {
        // const fileUrl = URL.createObjectURL(file); // Create the URL once
        // handleMediaOpen(fileUrl);
        // setMediaFile(fileUrl);
        fileData.append('file_id', file);
        setMediaLocalUrl(URL.createObjectURL(file));

        const fileUrl = await uploadFile(fileData);

        setIsLoading(false); // Stop loading
        // setMediaFile(fileUrl);
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
      setIsLoading(false); // Stop loading
    }
  };

  const handleSubmit = async () => {
    try {
      await editPost(formData);
      setFormData(formData);
      handleMediaClose();
      updateEdit(false);
      window.location.reload();
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className='editpost-modal-container'>
      <Modal
        open={wantToEdit}
        onClose={() => {
          updateEdit(false);
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
            width: '15%',
            height: '10%',
          }}
        >
          <input
            type="file"
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
          }}
        >
          <Box style={{ flex: '2' }}>
            {mediaType === 'image' && (
              <img
                src={mediaLocalUrl}
                alt="Media"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            )}
            {mediaType === 'video' && (
              <iframe
                src={mediaLocalUrl}
                alt="post video"
                style={{ maxWidth: '100%', maxHeight: '400px' }}/>
            )}
        </Box>
          <Box style={{ flex: '1', marginLeft: '20px' }}>
          {/* <TextField
            label="Media URL"
            name="media_url"
            fullWidth
            variant="outlined"
            style={{ marginTop: '20px' }}
            value={formData.media_url}
            onChange={handleChange}
          /> */}
          <TextField
            label="Text"
            name="text"
            fullWidth
            variant="outlined"
            style={{ marginTop: '20px' }}
            value={formData.text}
            onChange={handleChange}
          />
          <TextField
            label="Location"
            name="location"
            fullWidth
            variant="outlined"
            style={{ marginTop: '20px' }}
            value={formData.location}
            onChange={handleChange}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginTop: '20px' }}
          >
            Submit
          </Button>
        </Box>
       </Box>
      </Modal>
    </div>
  );
}

EditPost.propTypes = {
  postID: PropTypes.string.isRequired,
  wantToEdit: PropTypes.bool.isRequired,
  updateEdit: PropTypes.func.isRequired,
};

export default EditPost;
