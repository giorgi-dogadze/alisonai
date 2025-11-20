import { render, screen, fireEvent } from '@testing-library/react';
import { SharedCounter } from './SharedCounter';
import type { CounterState } from '@/types/collaboration';

jest.mock('@/shared/hooks', () => ({
  useCurrentTime: jest.fn(() => Date.now()),
}));

describe('SharedCounter', () => {
  const mockCounter: CounterState = {
    value: 5,
    timestamp: Date.now(),
    lastActionBy: 'John Doe',
    lastActionTimestamp: Date.now() - 5000,
  };

  const mockOnIncrement = jest.fn();
  const mockOnDecrement = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders counter with current value', () => {
    render(
      <SharedCounter
        counter={mockCounter}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Shared Counter')).toBeInTheDocument();
  });

  it('displays last action information', () => {
    render(
      <SharedCounter
        counter={mockCounter}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />
    );

    expect(screen.getByText(/Last updated by/i)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onIncrement when Increment button is clicked', () => {
    render(
      <SharedCounter
        counter={mockCounter}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />
    );

    const incrementButton = screen.getByText('Increment');
    fireEvent.click(incrementButton);

    expect(mockOnIncrement).toHaveBeenCalledTimes(1);
  });

  it('calls onDecrement when Decrement button is clicked', () => {
    render(
      <SharedCounter
        counter={mockCounter}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />
    );

    const decrementButton = screen.getByText('Decrement');
    fireEvent.click(decrementButton);

    expect(mockOnDecrement).toHaveBeenCalledTimes(1);
  });

  it('displays sync information text', () => {
    render(
      <SharedCounter
        counter={mockCounter}
        onIncrement={mockOnIncrement}
        onDecrement={mockOnDecrement}
      />
    );

    expect(
      screen.getByText(/synchronized across all open tabs/i)
    ).toBeInTheDocument();
  });
});
