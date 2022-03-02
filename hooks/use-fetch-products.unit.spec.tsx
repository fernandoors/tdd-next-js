import { Server, Response } from 'miragejs';
import { makeServer } from '../miragejs/server';

import { renderHook } from '@testing-library/react-hooks';

import useFetchProducts from './use-fetch-products';

describe('useFetchProducts', () => {
  let server: Server;
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });
  afterEach(() => {
    server.shutdown();
  });

  it('should return a list of 10 products', async () => {
    server.createList('product', 10);
    const { result, waitForNextUpdate } = renderHook(() => useFetchProducts());
    await waitForNextUpdate();
    expect(result.current.products).toHaveLength(10);
  });
  it('should set error to true when catch() block is executed', async () => {
    server.get('products', () => {
      return new Response(500, {}, 'Internal Server Error');
    });
    const { result, waitForNextUpdate } = renderHook(() => useFetchProducts());
    await waitForNextUpdate();
    expect(result.current.error).toBe(true);
    expect(result.current.products).toHaveLength(0);
  });
});
