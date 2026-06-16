import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { checkA11y } from '../test/axe';
import Field from './Field';

describe('Field', () => {
  it('associates its label with the input via htmlFor/id', () => {
    render(<Field id="city" label="City" value="" onChange={() => {}} />);
    // getByLabelText only succeeds when the label is correctly associated.
    expect(screen.getByLabelText('City')).toBeInTheDocument();
  });

  it('renders a select when options are provided', () => {
    render(
      <Field
        id="diet"
        label="Diet"
        value="balanced"
        onChange={() => {}}
        options={[
          { value: 'balanced', label: 'Balanced' },
          { value: 'plant_based', label: 'Plant-based' },
        ]}
      />
    );
    const select = screen.getByLabelText('Diet');
    expect(select.tagName).toBe('SELECT');
    expect(screen.getByRole('option', { name: 'Plant-based' })).toBeInTheDocument();
  });

  it('calls onChange as the user types', async () => {
    const onChange = vi.fn();
    render(<Field id="city" label="City" value="" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('City'), 'Pune');
    expect(onChange).toHaveBeenCalled();
  });

  it('marks required fields for assistive tech', () => {
    render(<Field id="city" label="City" value="" onChange={() => {}} required />);
    expect(screen.getByLabelText(/City/)).toBeRequired();
  });

  it('has no accessibility violations (input and select variants)', async () => {
    const input = render(<Field id="a" label="Name" value="" onChange={() => {}} />);
    expect(await checkA11y(input.container)).toHaveNoViolations();

    const select = render(
      <Field
        id="b"
        label="Energy"
        value="grid"
        onChange={() => {}}
        options={[{ value: 'grid', label: 'Grid' }]}
      />
    );
    expect(await checkA11y(select.container)).toHaveNoViolations();
  });
});
