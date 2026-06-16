import { render, screen } from '@testing-library/react';
import { checkA11y } from '../../../test/axe';
import InsightCard from './InsightCard';

const INSIGHT = {
  title: 'Swap one car trip for transit',
  detail: 'Replacing two short car trips a week is a fast win.',
  impact: '~10 kg CO₂/month',
  category: 'transport',
};

describe('InsightCard', () => {
  it('renders the recommendation title, detail, and impact', () => {
    render(<InsightCard insight={INSIGHT} />);
    expect(screen.getByText(INSIGHT.title)).toBeInTheDocument();
    expect(screen.getByText(INSIGHT.detail)).toBeInTheDocument();
    expect(screen.getByText(INSIGHT.impact)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<InsightCard insight={INSIGHT} />);
    expect(await checkA11y(container)).toHaveNoViolations();
  });
});
