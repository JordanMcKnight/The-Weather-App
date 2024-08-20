import { expect, test, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

// Mock the axios module
vi.mock('axios');

test('fetches weather data and updates UI', async () => {
  const mockedResponse = {
    data: {
      name: 'New York',
      weather: [{ description: 'clear sky', icon: '01d' }],
      main: { temp: 293.15 },
    },
  };

  // Mock the get request to return the mocked response
  axios.get.mockResolvedValueOnce(mockedResponse);

  render(<App />);
  
  const cityInput = screen.getByLabelText(/U.S. city:/i);
  fireEvent.change(cityInput, { target: { value: 'New York' } });

  const submitButton = screen.getByText(/Submit/i);
  fireEvent.click(submitButton);

  // Check that the weather data is displayed
  const weatherHeading = await waitFor(() => screen.findByText(/Weather in New York/i));
  expect(weatherHeading).toBeDefined();

  const weatherDescription = await screen.findByText(/clear sky/i);
  expect(weatherDescription).toBeDefined();

  // Check that the circular animation starts
  const circleElement = screen.getByRole('img');
  expect(circleElement).toBeInTheDocument();
  
  // Check that the maroon background is applied
  const weatherIconContainer = screen.getByRole('img').parentElement;
  expect(weatherIconContainer).toHaveStyle('background-color: #4f49a1');

  // Check the cycling animation class is applied
  expect(weatherIconContainer).toHaveClass('cycling');
  
  // Wait for the animation to complete
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Ensure animation class is removed after cycle
  expect(weatherIconContainer).not.toHaveClass('cycling');
});
