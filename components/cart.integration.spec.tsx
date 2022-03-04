import {
  renderHook,
  act as hooksAct,
  RenderResult,
} from '@testing-library/react-hooks/dom';
import { screen, render } from '@testing-library/react';
import { Server } from 'miragejs/server';
import { useCartStore } from '../store/cart';
import { makeServer } from '../miragejs/server';
import { setAutoFreeze } from 'immer';
import userEvent from '@testing-library/user-event';
import TestRenderer from 'react-test-renderer';
import Cart from './cart';

const { act: componentsAct } = TestRenderer;

setAutoFreeze(false);

describe('Cart', () => {
  let server: Server;
  let result: RenderResult<Store>;
  let spy: any;
  let add: (product: Product) => void;
  let toggle: () => void;
  let reset: () => void;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    /* eslint-disable testing-library/no-render-in-setup */
    result = renderHook(() => useCartStore()).result;
    add = result.current.actions.add;
    toggle = result.current.actions.toggle;
    spy = jest.spyOn(result.current.actions, 'toggle');
  });

  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });

  it('should add css class "hidden" in the component', () => {
    render(<Cart />);
    expect(screen.getByTestId('cart')).toHaveClass('hidden');
  });

  it('should not have css class "hidden" in the component', () => {
    componentsAct(() => {
      render(<Cart />);

      userEvent.click(screen.getByTestId('close-button'));

      expect(screen.getByTestId('cart')).not.toHaveClass('hidden');
    });
  });

  it('should call store toggle() twice', () => {
    componentsAct(() => {
      render(<Cart />);

      const button = screen.getByTestId('close-button');

      userEvent.click(button);
      userEvent.click(button);

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  it('should remove all products', () => {
    const products = server.createList<any, any, Product>('product', 2);

    hooksAct(() => products.forEach(add));

    componentsAct(() => {
      render(<Cart />);

      expect(screen.getAllByTestId('cart-item')).toHaveLength(2);

      const button = screen.getByRole('button', { name: /clear cart/i });

      userEvent.click(button);

      expect(screen.queryAllByTestId('cart-item')).toHaveLength(0);
    });
  });

  it('should remove "clear cart" if product list is empty ', () => {
    render(<Cart />);

    const button = screen.queryByRole('button', { name: /clear cart/i });

    expect(button).not.toBeInTheDocument();
  });

  it('should display 2 products cards', () => {
    render(<Cart />);
    const products = server.createList<any, any, Product>('product', 2);
    hooksAct(() => products.forEach(add));
    expect(screen.getAllByTestId('cart-item')).toHaveLength(2);
  });
});
