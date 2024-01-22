import React, { useState, useEffect } from 'react';
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import './App.css';
import LoginPage from './components/login/LoginPage';
import Signup from './components/signup/Signup';
import HomePage from './components/homepage/HomePage';
import Navbar from './components/nav/Navbar';
import Profile from './components/profile_page/Profile';
import Followings from './components/follow/Followings';
import Followers from './components/follow/Followers';
import ErrorPage from './components/error_page/ErrorPage';
import BadActionModal from './components/bad_action_modal/BadActionModal';

function App() {
  const [appToken, setAppToken] = useState(() => localStorage.getItem('appToken'));
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const userID = localStorage.getItem('userID');

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    // Set the window width initially
    handleResize();

    // Subscribe to the window resize event
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTokenValid = () => appToken !== null && appToken !== undefined && appToken !== '';
  useEffect(() => {
    if (isTokenValid()) {
      // sessionStorage.setItem('appToken', appToken);
      // addHeadersToken(appToken);
    }
  }, [appToken]);

  // Function to check if the token is valid (not expired)

  // Implement logic to check token validity (e.g., decode JWT and check expiry)
  // For now, this just checks if the token exists

  return (
    <div className="App">
      <BrowserRouter>
        {isTokenValid() && (
          <div className="navbar-container">
            <Navbar />
          </div>
        )}
        <div
          className={
            isTokenValid() && windowWidth >= 740
              ? 'content-with-navbar'
              : 'content'
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                isTokenValid() ? (
                  <HomePage userID={userID} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                !isTokenValid() ? (
                  <LoginPage updateAppToken={setAppToken} />
                ) : (
                  <Navigate to="/home" replace />
                )
              }
            />
            <Route
              path="/signup"
              element={
                !isTokenValid() ? <Signup /> : <Navigate to="/home" replace />
              }
            />
            {userID && isTokenValid() && <Route path="/home" element={<HomePage userID={userID} />} />}
            <Route path="/profile/:userID" element={<Profile />} />
            <Route path="/followers/:userID" element={<Followers />} />
            <Route path="/followings/:userID" element={<Followings />} />
            <Route path='/invalid_token' element={<BadActionModal title="Invalid Token" description="Your token is invalid. Please login again." />} />
            <Route path='/expired_token' element={<BadActionModal title="Expired Token" description="Your token has expired. Please login again" />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
