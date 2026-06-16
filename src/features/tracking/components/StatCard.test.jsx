import { render, screen } from '@testing-library/react';
import { checkA11y } from '../../../test/axe';
import StatCard from './StatCard';

describe('StatCard', () => {
  it('renders value, label, and optional sub-text', () => {
    render(<StatCard icon="🌍" label="Saved" value="12.4 kg" sub="this month" />);
    expect(screen.getByText('12.4 kg')).toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('this month')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<StatCard icon="🌍" label="Saved" value="12.4 kg" />);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});
