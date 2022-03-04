import {
  renderHook,
  act,
  RenderResult,
} from '@testing-library/react-hooks/dom';
import { Server } from 'miragejs/server';
import { makeServer } from '../../miragejs/server';
import { useCartStore } from '.';

describe('Cart Store', () => {
  let server: Server;
  let result: RenderResult<Store>;

  let add: (product: Product) => void;
  let remove: (product: Product) => void;
  let removeAll: () => void;
  let toggle: () => void;
  let reset: () => void;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    /* eslint-disable testing-library/no-render-in-setup */
    result = renderHook(() => useCartStore()).result;
    add = result.current.actions.add;
    remove = result.current.actions.remove;
    removeAll = result.current.actions.removeAll;
    toggle = result.current.actions.toggle;
    reset = result.current.actions.reset;
  });
  afterEach(() => {
    server.shutdown();
    act(() => result.current.actions.reset());
  });

  it('should return open equals false on initial state', () => {
    expect(result.current.state.open).toBe(false);
  });

  it('should toggle open state', () => {
    expect(result.current.state.open).toBe(false);
    expect(result.current.state.products).toHaveLength(0);

    act(toggle);
    expect(result.current.state.open).toBe(true);

    act(toggle);
    expect(result.current.state.open).toBe(false);
    expect(result.current.state.products).toHaveLength(0);
  });

  it('should return an empty array for products on initial state', () => {
    expect(Array.isArray(result.current.state.products)).toBe(true);
    expect(result.current.state.products).toHaveLength(0);
  });

  it('should add 2 products to the list and open the cart', async () => {
    const products = server.createList<any, any, Product>('product', 2);
    for (const product of products) {
      act(() => add(product));
    }

    expect(result.current.state.products).toHaveLength(2);
  });
  it('should reset store to initial state', async () => {
    const products = server.createList<any, any, Product>('product', 2);
    for (const product of products) {
      act(() => add(product));
    }

    expect(result.current.state.products).toHaveLength(2);
    expect(result.current.state.open).toEqual(true);

    act(() => reset());
    expect(result.current.state.products).toHaveLength(0);
    expect(result.current.state.open).toEqual(false);
  });

  it('should remove a product from the store', async () => {
    const [product1, product2] = server.createList<any, any, Product>(
      'product',
      2,
    );

    act(() => add(product1));
    act(() => add(product2));

    expect(result.current.state.products).toHaveLength(2);
    expect(result.current.state.open).toEqual(true);

    act(() => remove(product1));

    expect(result.current.state.products).toHaveLength(1);
    expect(result.current.state.products[0]).toEqual(product2);
  });

  it('should not change products in the cart if provided product is not in the array', async () => {
    const [product1, product2, product3] = server.createList<any, any, Product>(
      'product',
      3,
    );

    act(() => add(product1));
    act(() => add(product2));

    expect(result.current.state.products).toHaveLength(2);
    expect(result.current.state.open).toEqual(true);

    act(() => remove(product3));

    expect(result.current.state.products).toHaveLength(2);
    expect(result.current.state.products[0]).toEqual(product1);
  });
  it('should clear cart', async () => {
    const products = server.createList<any, any, Product>('product', 2);

    act(() => products.forEach(add));

    expect(result.current.state.products).toHaveLength(2);

    act(() => removeAll());

    expect(result.current.state.products).toHaveLength(0);
    expect(result.current.state.products).toEqual([]);
    expect(result.current.state.products[0]).toEqual(undefined);
  });
  it('should not add same product twice', async () => {
    const product = server.create<any, any, Product>('product');
    act(() => add(product));
    act(() => add(product));
    expect(result.current.state.products).toHaveLength(1);
  });
});
