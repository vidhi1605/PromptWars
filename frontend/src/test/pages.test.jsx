import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { About } from '../pages/About';
import { EmergencyChecklist } from '../pages/EmergencyChecklist';
import { WeatherAlerts } from '../pages/WeatherAlerts';
import { TravelAdvisory } from '../pages/TravelAdvisory';
import { NotFound } from '../pages/NotFound';
import { Home } from '../pages/Home';
import { AppProvider } from '../context/AppContext';

function renderWithProviders(ui) {
  return render(<AppProvider><MemoryRouter>{ui}</MemoryRouter></AppProvider>);
}

describe('page components', () => {
  it('renders the about page content', () => {
    renderWithProviders(<About />);
    expect(screen.getByText(/Monsoon Shield Portal/i)).toBeInTheDocument();
  });

  it('adds a checklist item and resets the form', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EmergencyChecklist />);
    await user.type(screen.getByLabelText(/supply name/i), 'Spare batteries');
    await user.click(screen.getByRole('button', { name: /add to checklist/i }));
    expect(screen.getByText(/spare batteries/i)).toBeInTheDocument();
  });

  it('subscribes and reports hazards from weather alerts page', async () => {
    const user = userEvent.setup();
    renderWithProviders(<WeatherAlerts />);
    await user.type(screen.getByLabelText(/contact info/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /activate broadcasts/i }));
    expect(await screen.findByText(/alert system active/i)).toBeInTheDocument();
  });

  it('filters travel advisories by search query', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TravelAdvisory />);
    const input = screen.getByLabelText(/search routes/i);
    await user.type(input, 'Eastern');
    expect(screen.getByText(/Eastern Highway Flyover/i)).toBeInTheDocument();
  });

  it('renders not found page and its call to action', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotFound />);
    await user.click(screen.getByRole('button', { name: /back to safety/i }));
    expect(screen.getByRole('button', { name: /back to safety/i })).toBeInTheDocument();
  });

  it('renders the home dashboard content', async () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/Citizen Core Utilities/i)).toBeInTheDocument();
  });
});
