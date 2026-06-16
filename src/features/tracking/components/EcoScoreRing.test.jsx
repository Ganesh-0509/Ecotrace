import { render, screen } from '@testing-library/react';
import { checkA11y } from '../../../test/axe';
import EcoScoreRing from './EcoScoreRing';

describe('EcoScoreRing', () => {
  it('shows the numeric score', () => {
    render(<EcoScoreRing score={72} />);
    expect(screen.getByText('72')).toBeInTheDocument();
    expect(screen.getByText('eco score')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<EcoScoreRing score={50} />);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});
