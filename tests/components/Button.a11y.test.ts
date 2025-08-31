/** @jest-environment jsdom */
import { axe, toHaveNoViolations } from 'jest-axe';
import Button from '../../src/components/Button';

expect.extend(toHaveNoViolations);

describe('Button accessibility', () => {
  it('has no accessibility violations', async () => {
    const btn = Button({ label: 'Submit' });
    document.body.appendChild(btn);
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
});
