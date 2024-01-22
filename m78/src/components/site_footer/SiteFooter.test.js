import React from 'react';
import { render, screen } from '@testing-library/react';
import SiteFooter from './SiteFooter';
import '@testing-library/jest-dom/extend-expect'; // Import necessary extend-expect

describe('SiteFooter component', () => {
  test('renders footer text', () => {
    render(<SiteFooter />);
    const footerElement = screen.getByText(/Every Pixel Tells a Story @M78/i);
    expect(footerElement).toBeInTheDocument(); // Use toBeInTheDocument matcher
  });
});
