import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';

vi.mock('../services/apiService', () => ({
  getPreparednessPlan: vi.fn().mockResolvedValue({
    planTitle: 'Test Plan',
    weatherSummary: 'Storms expected.',
    riskLevel: 'High',
    checklist: [{ item: 'Water', category: 'Food & Water', priority: 'High' }],
    evacuationSteps: ['Leave early'],
    safetyGuidelines: ['Stay indoors'],
    emergencyKit: [{ item: 'Torch', quantity: '2' }],
  }),
}));

describe('App routing and shell', () => {
  it('renders the home page by default', () => {
    render(<App />);
    expect(screen.getByText(/Monsoon Preparedness/i)).toBeInTheDocument();
  });

  it('allows toggling the theme button from the navbar', async () => {
    const user = userEvent.setup();
    render(<App />);
    const toggle = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(toggle);
    expect(document.body.className).not.toContain('dark');
  });
});
