import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders the main heading', () => {
    render(<App />);
    const heading = screen.getByText(/Vite \+ React \+ shadcn\/ui/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders all button variants', () => {
    render(<App />);
    expect(screen.getByText(/Count is 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset/i)).toBeInTheDocument();
    expect(screen.getByText(/Decrease/i)).toBeInTheDocument();
    expect(screen.getByText(/Outline/i)).toBeInTheDocument();
    expect(screen.getByText(/Ghost/i)).toBeInTheDocument();
  });

  it('increments count when Count button is clicked', () => {
    render(<App />);
    const countButton = screen.getByText(/Count is 0/i);

    fireEvent.click(countButton);
    expect(screen.getByText(/Count is 1/i)).toBeInTheDocument();

    fireEvent.click(countButton);
    expect(screen.getByText(/Count is 2/i)).toBeInTheDocument();
  });

  it('decrements count when Decrease button is clicked', () => {
    render(<App />);
    const decreaseButton = screen.getByText(/Decrease/i);

    fireEvent.click(decreaseButton);
    expect(screen.getByText(/Count is -1/i)).toBeInTheDocument();
  });

  it('resets count to 0 when Reset button is clicked', () => {
    render(<App />);
    const countButton = screen.getByText(/Count is 0/i);
    const resetButton = screen.getByText(/Reset/i);

    // Increment count
    fireEvent.click(countButton);
    fireEvent.click(countButton);
    expect(screen.getByText(/Count is 2/i)).toBeInTheDocument();

    // Reset count
    fireEvent.click(resetButton);
    expect(screen.getByText(/Count is 0/i)).toBeInTheDocument();
  });

  it('shows alert when Outline button is clicked', () => {
    render(<App />);
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const outlineButton = screen.getByText(/Outline/i);
    fireEvent.click(outlineButton);

    expect(alertSpy).toHaveBeenCalledWith('Outline button clicked!');
    alertSpy.mockRestore();
  });

  it('shows alert when Ghost button is clicked', () => {
    render(<App />);
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const ghostButton = screen.getByText(/Ghost/i);
    fireEvent.click(ghostButton);

    expect(alertSpy).toHaveBeenCalledWith('Ghost button clicked!');
    alertSpy.mockRestore();
  });

  it('displays the testing description text', () => {
    render(<App />);
    expect(
      screen.getByText(/Testing shadcn\/ui button variants/i)
    ).toBeInTheDocument();
  });
});
