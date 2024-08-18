import { expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Weather App header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Weather App/i);
  expect(headerElement).toBeDefined();
});

test('fetches weather data and updates UI', async () => {
  render(<App />);
  
  const cityInput = screen.getByLabelText(/U.S. City:/i);
  fireEvent.change(cityInput, { target: { value: 'New York' } });

  const submitButton = screen.getByText(/Get Weather/i);
  fireEvent.click(submitButton);

  const weatherHeading = await screen.findByText(/Weather in New York/i);
  expect(weatherHeading).toBeDefined();
});
