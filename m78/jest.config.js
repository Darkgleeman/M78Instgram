/* eslint-disable */
module.exports = {
  testPathIgnorePatterns: [
    './components/nav/Navbar.js',
    './components/profile_content/ProfileContent.js',
    './components/profile_page/Profile.js',
    './components/create_post/CreatePost.js',
    './components/post',
    './components/edit_post/EditPost.js',
    './components/signup/Signup.js',
    './api/posts.js',
  ],
  coveragePathIgnorePatterns: [
    './components/nav/Navbar.js',
    './components/profile_content/ProfileContent.js',
    './components/profile_page/Profile.js',
    './components/create_post/CreatePost.js',
    './components/post',
    './components/edit_post/EditPost.js',
    './components/signup/Signup.js',
    './api/posts.js',
  ],
  testEnvironment: 'jsdom',
  transformIgnorePattern: ['node_modules/(?!\@?axios)'],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/cssStub.js',
    '\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)': '<rootDir>/mediaStub.js',
  },
};
