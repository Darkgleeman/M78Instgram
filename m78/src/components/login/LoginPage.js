import { React, useState } from 'react';
import './LoginPage.css';
import { PropTypes } from 'prop-types';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Footer from '../site_footer/SiteFooter';
// import logo from '../../m78.jpg';
import { loginUser } from '../../api/users';

function LoginPage({ updateAppToken }) {
  const [passwdValidation, setPasswdValidation] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      if (response.loginSuccess && response.appToken !== null) {
        setPasswdValidation(true);
        updateAppToken(response.appToken);
        localStorage.setItem('userID', response.ID);
        localStorage.setItem('appToken', response.appToken);
      } else {
        setErrorMessage(response.message);
        setPasswdValidation(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setPasswdValidation(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="container">
        <div id="two" className="item">
          <h1 color='white' className='app-name'>M78</h1>
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            onChange={handleChange}
            className="custom-textfield"
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={handleChange}
            onKeyDown={handleEnter}
            className="custom-textfield"
          />
          <Link
            style={{
              marginTop: '10px', color: 'white', float: 'left',
            }}
            className="forget-password-prompt">
              Forgot your password?
          </Link>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              color: 'white',
              backgroundColor: '#3f51b5',
              '&:hover': {
                backgroundColor: '#4558c4',
                color: 'white',
              },
            }}
            onClick={handleSubmit}
          >
            Sign In
          </Button>
          {!passwdValidation && <div style={{ color: 'red', paddingBottom: '8px' }}> {errorMessage} </div> }
          <div style={{ marginRight: 'auto' }}>
            <div>
               Don&apos;t have an account? <Link style={{ color: 'white' }} to="/signup"> Sign Up! </Link>
            </div>
          </div>
        </div>
        <div className="login-footer">
          <Footer />
        </div>
      </div>
  );
}

LoginPage.propTypes = {
  updateAppToken: PropTypes.func.isRequired,
};
export default LoginPage;
