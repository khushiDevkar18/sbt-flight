import { render, screen } from '@testing-library/react';
import App from './app/App';

test('renders app shell', () => {
  render(<App />);
  expect(screen.getByText(/sign in/i)).toBeInTheDocument();
});
