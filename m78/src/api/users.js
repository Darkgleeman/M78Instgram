import { axiosInstance } from './axiosConfig';

const USER_URL = 'http://localhost:8080/api/Users';
const LOGIN_URL = 'http://localhost:8080/api/login';

async function registerUser(formData) {
  try {
    const response = await axiosInstance.post(`${USER_URL}`, {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      alias: formData.alias,
      avatarURL: formData.avatarURL,
    });

    return response.status;
  } catch (err) {
    if (err.response.status === 409) {
      const error = new Error('Username already exists');
      error.code = 409;
      throw error;
    }
    throw Error('Registration failed');
  }
}

async function loginUser(userData) {
  const result = {
    loginSuccess: false, message: '', ID: -1, appToken: null,
  };
  try {
    const response = await axiosInstance.post(`${LOGIN_URL}`, {
      username: userData.username,
      password: userData.password,
    });

    const user = response.data;

    result.loginSuccess = true;
    result.ID = user._id;
    result.message = 'Login Success';
    result.appToken = user.appToken;
    return result;
  } catch (error) {
    throw Error(error.response.data.message);
  }
}

async function getUserByID(userID) {
  try {
    // setHeaders();
    const response = await axiosInstance.get(`${USER_URL}/${userID}`);
    if (!response) {
      throw new Error('User not found');
    }
    return response;
  } catch (error) {
    throw Error('User not found');
  }
}

async function updateUserByID(userID, newData) {
  try {
    const updateResponse = await axiosInstance.put(`${USER_URL}/${userID}`, newData);
    if (updateResponse.status !== 200) {
      throw Error('Failed to update user');
    }

    return updateResponse;
  } catch (error) {
    throw Error('Failed to update user');
  }
}

async function getAllUsers() {
  try {
    const response = await axiosInstance.get(`${USER_URL}`);
    return response;
  } catch (error) {
    throw Error('Failed to get all users');
  }
}

export {
  registerUser,
  loginUser,
  getUserByID,
  updateUserByID,
  getAllUsers,
};
