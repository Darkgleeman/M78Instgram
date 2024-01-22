/**
 * @jest-environment jsdom
 */

import React from 'react';
// import testing library functions
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect'; // for expect(...).toBeInTheDocument()

// Import the component to be tested
import App from './App';

describe('App component', () => {
  test('renders without crashing', () => {
    render(<App />);
  });
  test('Weather app matches snapshot', () => {
    const component = renderer.create(<App />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('renders Sign Up link', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/Sign Up/);
    expect(linkElement).toBeInTheDocument();
  });

  // test('checks if navbar is displayed when user is logged in', () => {
  //   render(<App />);
  //   // Replace the 'login' condition with 'true' to simulate logged-in state
  //   expect(screen.getByText('Navbar')).toBeInTheDocument();
  // });

  // test('checks if content is displayed without navbar on smaller screens', () => {
  //   // Simulate a smaller window width
  //   global.innerWidth = 500;
  //   render(<App />);
  //   // Replace the 'login' condition with 'true' to simulate logged-in state
  //   expect(screen.getByText('Content')).toBeInTheDocument();
  // });

  // test('checks if user is able to log in', async () => {
  //   render(<App />);
  //   // Simulate a login action
  //   userEvent.click(screen.getByText('Login'));
  //   expect(screen.getByText('User Dashboard')).toBeInTheDocument();
  // });

  // Add more tests for other user interactions and functionalities
});
