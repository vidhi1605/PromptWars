import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Badge from '../components/Badge';
import { cn } from '../utils/cn';

describe('UI primitives', () => {
  it('renders button content and handles click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Press</Button>);
    await user.click(screen.getByRole('button', { name: /press/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a card with custom classes and animation props', () => {
    render(<Card className="custom-card" data-testid="card">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('custom-card');
  });

  it('renders textarea and error text when provided', () => {
    render(<Input label="Message" textarea error="This is required" placeholder="Type here" />);
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByText(/this is required/i)).toBeInTheDocument();
  });

  it('renders badge variants', () => {
    render(<Badge variant="success">Ready</Badge>);
    expect(screen.getByText(/ready/i)).toBeInTheDocument();
  });

  it('combines class names and ignores falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });
});
