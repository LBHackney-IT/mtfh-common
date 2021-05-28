import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

jest.mock('single-spa');

test('it renders correctly', () => {
  const { container } = render(<Button>Test Button</Button>);
  expect(container).toMatchSnapshot();
});

test('it shows a loading state', () => {
  const { container } = render(<Button isLoading>Test Button</Button>);
  expect(container).toMatchSnapshot();
});

test('it shows a loading state with custom text', () => {
  render(
    <Button isLoading loadingText="Processing">
      Test Button
    </Button>
  );
  expect(screen.getByText('Processing')).toBeInTheDocument();
});

test('it renders the correct variant', () => {
  const { container } = render(<Button variant="secondary">Test Link</Button>);
  expect(container).toMatchSnapshot();
});

test('it accepts a ref', () => {
  const callback = jest.fn();
  const Comp = () => {
    const ref = React.createRef<HTMLButtonElement>();

    useEffect(() => {
      if (ref.current) {
        callback(ref.current);
      }
    }, [ref]);
    return <Button ref={ref}>Test Button</Button>;
  };
  render(<Comp />);
  expect(callback).toBeCalledTimes(1);
});
