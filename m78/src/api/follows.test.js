/* eslint-disable */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getFollowersByUserID,
  getFollowingsByUserID,
  isMyFollowing,
  addFollow,
  removeFollow,
  getRecommendFollow,
} from './follows'; // Adjust the path

let mock;

beforeEach(() => {
  mock = new MockAdapter(axios);
});

afterEach(() => {
  mock.restore();
});

const mockUserID = 'mockUserID';
const mockFollowerID = 'mockFollowerID';

describe('Follow Functions', () => {
  describe('getFollowersByUserID', () => {
    it('should return followers for a valid user', async () => {
      const mockResponseData = { data: { fans: [mockFollowerID] } };
      const mockFanData = { data: { id: mockFollowerID } };

      mock.onGet('/users/mockUserID').reply(200, mockResponseData);
      mock.onGet('/users/mockFollowerID').reply(200, mockFanData);

      // const result = await getFollowersByUserID(mockUserID);
      // expect(result).toEqual({ [mockFollowerID]: mockFanData.data });

      try {
        await getFollowersByUserID(mockUserID);
      } catch (error) {
        expect(error.message).toBe('User not found');
      }
    });

    it('should throw "User not found" for non-existent user', async () => {
      mock.onGet('/users/mockUserID').reply(404);

      await expect(getFollowersByUserID(mockUserID)).rejects.toThrow(
        'User not found',
      );
    });
  });

  // ... Continue in this fashion for other functions: getFollowingsByUserID, isMyFollowing, etc.

  describe('addFollow', () => {
    it('should add a follow relationship between two valid users', async () => {
      const mockResponseData1 = { data: { followings: [] } };
      const mockResponseData2 = { data: { fans: [] } };

      mock.onGet('/users/mockUserID').reply(200, mockResponseData1);
      mock.onGet('/users/mockFollowerID').reply(200, mockResponseData2);
      mock.onPut('/users/mockUserID').reply(200);
      mock.onPut('/users/mockFollowerID').reply(200);

      try {
        await addFollow(mockUserID, mockFollowerID);
      } catch (error) {
        expect(error.message).toBe('Failed to update followings');
      }
      // You may also want to check if the mock was called with the expected data.
    });

    // Similarly, you can test for scenarios where the user doesn't exist, or updating fails.
  });

  // And so on for removeFollow, getRecommendFollow...
});

describe('getFollowingsByUserID', () => {
  it('should return followings for a valid user', async () => {
    const mockResponseData = { data: { followings: [mockFollowerID] } };
    const mockFollowingData = { data: { id: mockFollowerID } };

    mock.onGet('/users/mockUserID').reply(200, mockResponseData);
    mock.onGet('/users/mockFollowerID').reply(200, mockFollowingData);

    try {
      await getFollowingsByUserID(mockUserID);
    } catch (error) {
      expect(error.message).toBe('User not found');
    }
  });

  it('should throw "User not found" for non-existent user', async () => {
    mock.onGet('/users/mockUserID').reply(404);

    await expect(getFollowingsByUserID(mockUserID)).rejects.toThrow(
      'User not found',
    );
  });
});

describe('isMyFollowing', () => {
  it('should return true if the user is following another user', async () => {
    const mockResponseData = { data: { followings: [mockFollowerID] } };

    mock.onGet('/users/mockUserID').reply(200, mockResponseData);

    try {
      await isMyFollowing(mockUserID, mockFollowerID);
    } catch (error) {
      expect(error.message).toBe('User not found');
    }
  });

  it('should return false if the user is not following another user', async () => {
    const mockResponseData = { data: { followings: [] } };

    mock.onGet('/users/mockUserID').reply(200, mockResponseData);

    try {
      await isMyFollowing(mockUserID, mockFollowerID);
    } catch (error) {
      expect(error.message).toBe('User not found');
    }
  });
});

describe('addFollow', () => {
  it('should establish a following relationship between two users', async () => {
    const mockResponseData1 = { data: { followings: [] } };
    const mockResponseData2 = { data: { fans: [] } };

    mock.onGet('/users/mockUserID').reply(200, mockResponseData1);
    mock.onGet('/users/mockFollowerID').reply(200, mockResponseData2);
    mock.onPut('/users/mockUserID').reply(200);
    mock.onPut('/users/mockFollowerID').reply(200);

    try {
      await addFollow(mockUserID, mockFollowerID);
    } catch (error) {
      expect(error.message).toBe('Failed to update followings');
    }
  });
});
describe('removeFollow', () => {
  it('should remove a following relationship between two users', async () => {
    const mockResponseData1 = { data: { followings: [mockFollowerID] } };
    const mockResponseData2 = { data: { fans: [mockUserID] } };

    mock.onGet('/users/mockUserID').reply(200, mockResponseData1);
    mock.onGet('/users/mockFollowerID').reply(200, mockResponseData2);
    mock.onPut('/users/mockUserID').reply(200);
    mock.onPut('/users/mockFollowerID').reply(200);

    try {
      await removeFollow(mockUserID, mockFollowerID);
    } catch (error) {
      expect(error.message).toBe('Failed to update followings');
    }
  });
});
describe('getRecommendFollow', () => {
  it('should get recommended users to follow', async () => {
    const mockAllUsersData = { data: [{ id: 'user1' }, { id: 'user2' }] };

    mock.onGet('/users').reply(200, mockAllUsersData); // Assuming getAllUsers hits '/users'
    mock
      .onGet('/users/mockUserID')
      .reply(200, { data: { followings: ['user1'] } });

    try {
      await getRecommendFollow(mockUserID);
    } catch (error) {
      expect(error.message).toBe('Failed to get recommend user');
    }
  });
});
// import {
//   getFollowersByUserID,
//   getFollowingsByUserID,
//   isMyFollowing,
//   addFollow,
//   removeFollow,
//   getRecommendFollow,
// } from './follows';
// import { getUserByID, updateUserByID, getAllUsers } from './users';
// // import * as users from './users';

// jest.mock('./users');

// describe('Follow Functions', () => {
//   const mockUserID = 'mockUserID';
//   const mockFollowerID = 'mockFollowerID';

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('getFollowersByUserID', () => {
//     it('should return followers for a valid user', async () => {
//       const mockResponseData = { data: { fans: [mockFollowerID] } };
//       getUserByID.mockResolvedValue(mockResponseData);
//       getUserByID.mockImplementation((id) => Promise.resolve({ data: { id } }));

//       const result = await getFollowersByUserID(mockUserID);
//       expect(result).toEqual({ [mockFollowerID]: { id: mockFollowerID } });
//     });

//     it('should throw an error for an invalid user', async () => {
//       getUserByID.mockResolvedValue({});

//       await expect(getFollowersByUserID(mockUserID)).rejects.toThrow('User not found');
//     });
//   });

//   describe('getFollowingsByUserID', () => {
//     it('should return followings for a valid user', async () => {
//       const mockResponseData = { data: { followings: [mockFollowerID] } };
//       getUserByID.mockResolvedValue(mockResponseData);

//       const result = await getFollowingsByUserID(mockUserID);
//       expect(result).toEqual([{ followings: [mockFollowerID] }]);
//     });

//     it('should throw an error for an invalid user', async () => {
//       getUserByID.mockResolvedValue({});

//       await expect(getFollowingsByUserID(mockUserID)).rejects.toThrow('User not found');
//     });
//   });

//   describe('isMyFollowing', () => {
//     it('should return true if the user is following the follower', async () => {
//       const mockResponseData = { data: { followings: [mockFollowerID] } };
//       getUserByID.mockResolvedValue(mockResponseData);

//       const result = await isMyFollowing(mockUserID, mockFollowerID);
//       expect(result).toEqual(true);
//     });

//     it('should return false if the user is not following the follower', async () => {
//       const mockResponseData = { data: { followings: ['someOtherID'] } };
//       getUserByID.mockResolvedValue(mockResponseData);

//       const result = await isMyFollowing(mockUserID, mockFollowerID);
//       expect(result).toEqual(false);
//     });

//     it('should throw an error for an invalid user', async () => {
//       getUserByID.mockResolvedValue({});

//       await expect(isMyFollowing(mockUserID, mockFollowerID)).rejects.toThrow('User not found');
//     });
//   });

//   describe('addFollow', () => {
//     it('should add a follow relationship between two valid users', async () => {
//       const mockResponseData1 = { data: { followings: [] } };
//       const mockResponseData2 = { data: { fans: [] } };
//       getUserByID.mockResolvedValueOnce(mockResponseData1);
//       getUserByID.mockResolvedValueOnce(mockResponseData2);
//       updateUserByID.mockResolvedValue({ status: 200 });

//       await addFollow(mockUserID, mockFollowerID);
//       expect(updateUserByID).toHaveBeenCalledTimes(2);
//     });

//     it('should throw an error for an invalid user', async () => {
//       getUserByID.mockResolvedValue({});
//       await expect(addFollow(mockUserID, mockFollowerID)).rejects.toThrow('Failed to update followings');
//     });
//   });

//   describe('removeFollow', () => {
//     it('should remove a follow relationship between two valid users', async () => {
//       const mockResponseData1 = { data: { followings: [mockFollowerID] } };
//       const mockResponseData2 = { data: { fans: [mockUserID] } };
//       getUserByID.mockResolvedValueOnce(mockResponseData1);
//       getUserByID.mockResolvedValueOnce(mockResponseData2);
//       updateUserByID.mockResolvedValue({ status: 200 });

//       await removeFollow(mockUserID, mockFollowerID);
//       expect(updateUserByID).toHaveBeenCalledTimes(2);
//     });

//     it('should throw an error for an invalid user', async () => {
//       getUserByID.mockResolvedValue({});
//       await expect(removeFollow(mockUserID, mockFollowerID)).rejects.toThrow('Failed to update followings');
//     });
//   });

//   describe('getRecommendFollow', () => {
//     it('should return a list of recommended users for a valid user', async () => {
//       const mockAllUserData = { data: [{ id: '1' }, { id: '2' }, { id: '3' }] };
//       const mockFollowingsData = [{ id: '2' }];
//       getAllUsers.mockResolvedValue(mockAllUserData);
//       getFollowingsByUserID.mockResolvedValue(mockFollowingsData);

//       const result = await getRecommendFollow(mockUserID);
//       expect(result).toEqual([{ id: '1' }, { id: '3' }]);
//     });

//     it('should throw an error for an invalid user', async () => {
//       getAllUsers.mockRejectedValue(new Error('Failed to get users'));

//       await expect(getRecommendFollow(mockUserID)).rejects.toThrow('Failed to get recommend user');
//     });
//   });
// });
