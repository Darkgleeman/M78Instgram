import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import './Navbar.css';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CreatePost from '../create_post/CreatePost';
import SiteFooter from '../site_footer/SiteFooter';
import { removeHeadersToken } from '../../api/axiosConfig';

function Navbar() {
  // const navigate = useNavigate();
  const [wantNewPost, setWantNewPost] = useState(false);

  const handleLogout = () => {
    removeHeadersToken();
    localStorage.clear();
    // navigate('/login');
    window.location = '/login';
    // window.location.reload();
  };

  const updateNewPost = (v) => {
    setWantNewPost(v);
  };

  return (
    <nav className="navbar">
      <div>
        <h1>M78 Instagram</h1>
      </div>
      <div className="links-container">
        <Link to="/home">
          <div
            className="link-option"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <HomeOutlinedIcon style={{ paddingRight: '10px' }} />
            Home
          </div>
        </Link>

        <div
          className="link-option"
          onClick={() => {
            updateNewPost(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <AddCircleOutlineIcon style={{ paddingRight: '10px' }} />
          New Post
        </div>
        {wantNewPost && (
          <CreatePost wantNewPost={wantNewPost} updateWantNewPost={updateNewPost} />
        )}

        <Link to={`/profile/${localStorage.getItem('userID')}`}>
          <div
            className="link-option"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <PermIdentityOutlinedIcon style={{ paddingRight: '10px' }} />
            My Profile
          </div>
        </Link>

        <Link to={`/followers/${localStorage.getItem('userID')}`}>
          <div
            className="link-option"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <PeopleAltOutlinedIcon style={{ paddingRight: '10px' }} />
            Followers
          </div>
        </Link>

        <Link to={`/followings/${localStorage.getItem('userID')}`}>
          <div
            className="link-option"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <FavoriteBorderIcon style={{ paddingRight: '10px' }} />
            Followings
          </div>
        </Link>
      </div>
      <Button
        className="logout-btn"
        variant="contained"
        color="primary"
        onClick={handleLogout}
      >
        Logout
      </Button>
      <div className="navbar-footer">
        <SiteFooter />
      </div>
    </nav>
  );
}

export default Navbar;
