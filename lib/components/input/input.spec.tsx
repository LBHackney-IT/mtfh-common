import React from 'react';
import { render } from '@testing-library/react';

import { testA11y } from '../../test-utils';
import { FormGroup } from '../form-group';
import { Input } from './input';

test('it passes a11y', async () => {
  const { container } = render(
    <FormGroup id="test" name="test" label="Input Test">
      <Input />
    </FormGroup>
  );
  expect(container).toMatchSnapshot();
  await testA11y(container);
});

test('it renders correctly', () => {
  const { container } = render(<Input />);
  expect(container).toMatchSnapshot();
});

test('it renders correctly with an error', () => {
  const { container } = render(<Input error />);
  expect(container).toMatchSnapshot();
});