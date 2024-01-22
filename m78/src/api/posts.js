import { axiosInstance } from './axiosConfig';
import { getUserByID, updateUserByID } from './users';

const POST_URL = 'http://localhost:8080/api/Posts';

async function getPostByID(postID) {
  try {
    const response = await axiosInstance.get(`${POST_URL}/${postID}`);

    if (!response.data) {
      throw Error('Post not found');
    }
    return response.data;
  } catch (error) {
    throw Error('Post not found');
  }
}

async function getAllPostIDsByUserID(userID) {
  try {
    const response = await getUserByID(userID);
    if (!response.data) {
      throw Error('Posts not found');
    }
    return response.data.posts;
  } catch (error) {
    throw Error('Posts not found');
  }
}

async function getAllLikesByUserID(userID) {
  try {
    const response = await getUserByID(userID);

    if (!response.data) {
      throw Error('User not found');
    }

    return response.data.likedPosts;
  } catch (error) {
    throw Error('User not found');
  }
}

async function getAllHidesByUserID(userID) {
  try {
    const response = await getUserByID(userID);

    if (!response.data) {
      throw Error('User not found');
    }

    return response.data.hiddenPosts;
  } catch (error) {
    throw Error('User not found');
  }
}

async function postIDLikedByUserID(postID, userID) {
  try {
    const response = await getUserByID(userID);

    if (!response.data) {
      throw Error('Error Getting User');
    }

    return response.data.likedPosts.includes(postID);
  } catch (error) {
    throw Error('User not found');
  }
}

async function postIDHiddenByUserID(postID, userID) {
  try {
    const response = await getUserByID(userID);

    if (!response.data) {
      throw Error('Error Getting User');
    }

    return response.data.hiddenPosts.includes(postID);
  } catch (error) {
    throw Error('User not found');
  }
}
// async function updateUserIDLikesPostID(postID, userID, isLiked) {
//   try {
//     const response = await getUserByID(userID);
//     if (!response.data) {
//       throw Error('Error Getting User');
//     }

//     // update User collection
//     // update the User.likedPosts list
//     const likedPostsList = [...response.data.likedPosts];

//     if (likedPostsList.includes(postID)) {
// if (!isLiked) {
//   const index = likedPostsList.indexOf(postID);
//   if (index > -1) likedPostsList.splice(index, 1);
// }
//     } else if (isLiked) {
//       likedPostsList.push(postID);
//     }

//     // put the updated list back to the user
//     const updateResponse = await updateUserByID(userID, {
//       likedPosts: likedPostsList,
//     });
//     if (updateResponse.status !== 200) {
//       throw Error('Failed to update likedPosts');
//     }
//   } catch (error) {
//     throw Error('Failed to update likedPosts');
//   }
// }
async function updateUserIDLikesPostID(postID, userID, isLiked) {
  try {
    const response = await getUserByID(userID);
    const post = await getPostByID(postID);
    if (!response.data) {
      throw Error('Error Getting User');
    }
    if (!post) {
      throw Error('Error Getting Post');
    }

    // update User collection
    // update the User.likedPosts list
    const userLikeList = [...response.data.likedPosts];
    const postFansList = [...post.likedByUsers];

    // unlike post
    if (userLikeList.includes(postID) && !isLiked) {
      // remove post from user's likedPosts list
      const index = userLikeList.indexOf(postID);
      if (index > -1) userLikeList.splice(index, 1);

      const updateResponse = await updateUserByID(userID, {
        likedPosts: userLikeList,
      });
      if (updateResponse.status !== 200) {
        throw Error('Failed to update likedPosts 1');
      }

      // remove user from post's fans list
      const postIndex = postFansList.indexOf(userID);
      if (postIndex > -1) postFansList.splice(postIndex, 1);

      const updatePostResponse = await axiosInstance.put(
        `${POST_URL}/${postID}`,
        {
          likedByUsers: postFansList,
        },
      );
      if (updatePostResponse.status !== 200) {
        throw Error('Failed to update likedPosts 2');
      }
      return;
    }

    // like post
    // update user's likedPosts list
    if (!userLikeList.includes(postID) && isLiked) {
      userLikeList.push(postID);
      const updateResponse = await updateUserByID(userID, {
        likedPosts: userLikeList,
      });
      if (updateResponse.status !== 200) {
        throw Error('Failed to update likedPosts 3');
      }

      // update post's fans list
      postFansList.push(userID);
      const updatePostResponse = await axiosInstance.put(
        `${POST_URL}/${postID}`,
        {
          likedByUsers: postFansList,
        },
      );
      if (updatePostResponse.status !== 200) {
        throw Error('Failed to update likedPosts 4');
      }
    }
  } catch (error) {
    throw Error(error.message);
  }
}

async function updateUserIDHidesPostID(postID, userID, wantHide) {
  try {
    const response = await getUserByID(userID);
    const post = await getPostByID(postID);
    if (!response.data) {
      throw Error('Error Getting User');
    }
    if (!post) {
      throw Error('Error Getting Post');
    }

    // update User collection
    // update the User.likedPosts list
    // const userLikeList = [...response.data.likedPosts];
    // const postFansList = [...post.likedByUsers];
    const userHideList = [...response.data.hiddenPosts];
    const hiddingUserList = [...post.hiddenByUsers];

    // unhide post
    if (userHideList.includes(postID) && !wantHide) {
      // remove post from user's hiddenPosts list
      const index = userHideList.indexOf(postID);
      if (index > -1) userHideList.splice(index, 1);

      const updateResponse = await updateUserByID(userID, {
        hiddenPosts: userHideList,
      });
      if (updateResponse.status !== 200) {
        throw Error('Failed to update hiddenPosts 1');
      }

      // remove user from post's hiddenByUser list
      const postIndex = hiddingUserList.indexOf(userID);
      if (postIndex > -1) hiddingUserList.splice(postIndex, 1);

      const updatePostResponse = await axiosInstance.put(
        `${POST_URL}/${postID}`,
        {
          hiddenByUser: hiddingUserList,
        },
      );
      if (updatePostResponse.status !== 200) {
        throw Error('Failed to update hiddenPosts 2');
      }
      return;
    }

    // hide post
    // update user's hiddenPosts list
    if (!userHideList.includes(postID) && wantHide) {
      userHideList.push(postID);
      const updateResponse = await updateUserByID(userID, {
        hiddenPosts: userHideList,
      });
      if (updateResponse.status !== 200) {
        throw Error('Failed to update hiddenPosts 3');
      }

      // update post's fans list
      hiddingUserList.push(userID);
      const updatePostResponse = await axiosInstance.put(
        `${POST_URL}/${postID}`,
        {
          hiddenByUser: hiddingUserList,
        },
      );
      if (updatePostResponse.status !== 200) {
        throw Error('Failed to update hiddenPosts 4');
      }
    }
  } catch (error) {
    throw Error(error.message);
  }
}
async function createPost(formData) {
  try {
    const response = await axiosInstance.post(`${POST_URL}`, {
      create_timestamp: formData.create_timestamp,
      location: formData.location,
      media_url: formData.media_url,
      media_type: formData.media_type,
      likedByUsers: [],
      hiddenByUsers: [],
      text: formData.text,
      author_id: formData.author_id,
    });

    // udpate author's relevant field in db.Users
    const author = await getUserByID(formData.author_id);

    const postList = [...author.data.posts, response.data._id];

    const updateResponse = await updateUserByID(formData.author_id, {
      posts: postList,
    });

    if (updateResponse.status !== 200) {
      throw new Error('Failed to post');
    }
    // window.location.reload();
    return response.status;
  } catch (error) {
    throw Error('Register failed');
  }
}
async function deletePost(postId, authorId) {
  try {
    const toBeDeletedPost = await getPostByID(postId);

    const likedByUsers = [...toBeDeletedPost.likedByUsers];

    const userPromises = likedByUsers.map((userId) => getUserByID(userId));
    const users = await Promise.all(userPromises);

    const updatePromises = users.map((user) => {
      const updatedLikedPosts = user.data.likedPosts.filter(
        (id) => id !== postId,
      );
      return updateUserByID(user.data._id, {
        likedPosts: updatedLikedPosts,
      });
    });

    await Promise.all(updatePromises);

    // First, delete the post from the database
    const deleteResponse = await axiosInstance.delete(`${POST_URL}/${postId}`);

    if (deleteResponse.status !== 200) {
      throw new Error('Failed to delete post');
    }

    // Then, update the author's data
    const author = await getUserByID(authorId);

    const updatedPostList = author.data.posts.filter((id) => id !== postId);

    const updateAuthorResponse = await updateUserByID(authorId, {
      posts: updatedPostList,
    });

    if (updateAuthorResponse.status !== 200) {
      throw new Error('Failed to update author data');
    }
    window.location.reload();
    return deleteResponse.status;
  } catch (error) {
    throw new Error('Delete post failed');
  }
}
async function editPost(formData) {
  try {
    const response = await axiosInstance.put(`${POST_URL}/${formData._id}`, {
      create_timestamp: formData.create_timestamp,
      location: formData.location,
      media_url: formData.media_url,
      media_type: formData.media_type,
      likedByUsers: formData.likedByUsers,
      text: formData.text,
      author_id: formData.author_id,
    });

    // Update author's relevant field in db.Users
    // const author = await getUserByID(formData.author_id);

    // const postList = [...author.data.posts];
    // const postIndex = postList.indexOf(formData._id);

    // if (postIndex !== -1) {
    //   postList[postIndex] = response.data._id;
    // }

    // const updateResponse = await updateUserByID(formData.author_id, {
    //   posts: postList, // updating the post list
    // });

    // if (updateResponse.status !== 200) {
    //   throw new Error('Failed to update post');
    // }
    return response.status;
  } catch (error) {
    throw new Error('Edit failed');
  }
}

async function uploadFile(files) {
  try {
    const res = await axiosInstance.post(`${POST_URL}/UploadMedia`, files, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res.status !== 201) {
      throw Error('Upload Failed');
    }
    return res.data;
  } catch (err) {
    throw Error('Upload Failed');
  }
}

async function getPostsByPostIDsString(postIDsString) {
  try {
    // postIDsString should be ids spearated by &
    const res = await axiosInstance.get(`${POST_URL}/IDs/${postIDsString}`);

    if (res.status !== 200) {
      throw Error('Posts Fetch Failed');
    }
    return res.data;
  } catch (err) {
    throw Error('Posts Fetch Failed');
  }
}

async function getSelectedFieldsForMultiplePosts(postIDsString, fieldList) {
  try {
    const posts = await getPostsByPostIDsString(postIDsString);
    if (!posts) {
      throw new Error('Posts fetch failed');
    }
    const res = posts.map((post) => {
      const val = {};
      for (let i = 0; i < fieldList.length; i += 1) {
        val[fieldList[i]] = post[fieldList[i]];
      }
      return val;
    });
    return res;
  } catch (err) {
    // Consider logging the error for better debugging
    throw new Error(`Posts fetch failed: ${err.message}`);
  }
}

async function getHiddenPostArrByUserID(userID) {
  try {
    const response = await getUserByID(userID);
    if (!response.data) {
      throw Error('Posts not found');
    }
    return response.data.hiddenPosts;
  } catch (error) {
    throw Error('Posts not found');
  }
}

export {
  getPostByID,
  postIDLikedByUserID,
  updateUserIDLikesPostID,
  getAllPostIDsByUserID,
  getAllLikesByUserID,
  createPost,
  deletePost,
  editPost,
  uploadFile,
  getPostsByPostIDsString,
  getSelectedFieldsForMultiplePosts,
  getHiddenPostArrByUserID,
  getAllHidesByUserID,
  updateUserIDHidesPostID,
  postIDHiddenByUserID,
};
