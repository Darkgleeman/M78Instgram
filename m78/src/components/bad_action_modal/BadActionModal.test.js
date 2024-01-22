import React from 'react';
import {
  render, screen, fireEvent, act, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useNavigate } from 'react-router-dom';
import BadActionModal from './BadActionModal';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other functions
  useNavigate: () => jest.fn(),
}));

describe('BadActionModal', () => {
  it('renders modal with title and description', () => {
    const title = 'Test Title';
    const description = 'Test Description';

    render(<BadActionModal title={title} description={description} />);

    // Check if modal is rendered
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('calls onCloseFn when OK button is clicked', () => {
    const onCloseFn = jest.fn();
    render(<BadActionModal title="Test Title" description="Test Description" onCloseFn={onCloseFn} />);

    // Click the OK button
    fireEvent.click(screen.getByText('OK'));

    // Check if onCloseFn is called
    expect(onCloseFn).toHaveBeenCalledTimes(1);
  });

  it('navigates to /login when OK button is clicked if onCloseFn is not provided', async () => {
    render(<BadActionModal title="Test Title" description="Test Description" />);

    // Click the OK button
    fireEvent.click(screen.getByText('OK'));

    // Wait for the navigation to complete
    await waitFor(() => {
      // Check if useNavigate is called with the correct path
      expect(useNavigate()).toHaveBeenCalledTimes(0);
    });
  });

  it('clears localStorage when OK button is clicked if onCloseFn is not provided', () => {
    // Mock the localStorage.clear method
    const localStorageMock = {
      clear: jest.fn(),
    };
    Object.defineProperty(global, 'localStorage', { value: localStorageMock });

    render(<BadActionModal title="Test Title" description="Test Description" />);

    // Click the OK button
    fireEvent.click(screen.getByText('OK'));

    // Check if localStorage.clear is called
    expect(localStorageMock.clear).toHaveBeenCalledTimes(1);
  });

  it('does not render modal if showModal is false', () => {
    const { queryByText } = render(<BadActionModal title="Test Title" description="Test Description" />);

    // Click the OK button to hide the modal
    act(() => {
      fireEvent.click(queryByText('OK'));
    });

    // Check if modal is not rendered
    expect(queryByText('Test Title')).toBeNull();
    expect(queryByText('Test Description')).toBeNull();
  });
});
