import { renderHook, act, RenderResult } from '@testing-library/react-hooks';
import { Server } from 'miragejs';
import { makeServer } from '../../miragejs/server';
import { useCartStore } from '.';

describe('Cart Store', () => {
  let server: Server;
  let result: RenderResult<Store>;

  let add: (product: Product) => void;
  let toggle: () => void;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    result = renderHook(() => useCartStore()).result;
    add = result.current.actions.add;
    toggle = result.current.actions.toggle;
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

  it('should add 2 products to the list', async () => {
    const products = server.createList<any, any, Product>('product', 2);
    for (const product of products) {
      act(() => add(product));
    }

    expect(result.current.state.products).toHaveLength(2);
  });

  it('should not add same product twice', async () => {
    const product = server.create<any, any, Product>('product');
    act(() => add(product));
    act(() => add(product));
    expect(result.current.state.products).toHaveLength(1);
  });
});
