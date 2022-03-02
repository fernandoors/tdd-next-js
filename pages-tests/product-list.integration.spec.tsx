import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import ProductList from '../pages';
import { makeServer } from '../miragejs/server';
import { Response, Server } from 'miragejs';
import userEvent from '@testing-library/user-event';

const renderProductList = () => {
  render(<ProductList />);
};

describe('ProductList', () => {
  let server: Server;
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });
  afterEach(() => {
    server.shutdown();
  });
  it('should render product list', () => {
    renderProductList();
    expect(screen.getByTestId('product-list')).toBeInTheDocument();
  });

  it('should render the ProductCard component 10 times', async () => {
    server.createList('product', 10);

    renderProductList();

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(10);
    });
  });

  it('should render the no products message', async () => {
    renderProductList();
    await waitFor(() => {
      expect(screen.getByTestId('no-products')).toBeInTheDocument();
    });
  });

  it('should display error message when promise rejects', async () => {
    server.get('products', () => {
      return new Response(500, {}, 'Internal Server Error');
    });
    renderProductList();
    await waitFor(() => {
      expect(screen.getByTestId('error-get-products')).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.queryByTestId('no-products')).toBeNull();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.queryAllByTestId('product-card')).toHaveLength(0);
    });
  });

  it('should filter the product list when a search is performed', async () => {
    const searchTerm = 'Notebook';
    server.createList('product', 2);
    server.create('product', {
      title: searchTerm,
    });
    renderProductList();
    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(3);
    });
    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    await userEvent.type(input, searchTerm);
    await fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(1);
    });
  });

  it('should display the total quantity of products', async () => {
    server.createList('product', 10);

    renderProductList();
    await waitFor(() => {
      expect(screen.getByText(/10 Products/i)).toBeInTheDocument();
    });
  });

  it('should display product (singular) when there is only 1 product', async () => {
    server.create('product');

    renderProductList();
    await waitFor(() => {
      expect(screen.getByText(/1 Product$/i)).toBeInTheDocument();
    });
  });

  it('should display proper quantity when list is filtered', async () => {
    const searchTerm = 'Notebook';
    server.createList('product', 2);

    server.create('product', {
      title: searchTerm,
    });

    renderProductList();
    await waitFor(() => {
      expect(screen.getByText(/3 Products/i)).toBeInTheDocument();
    });
    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    await userEvent.type(input, searchTerm);
    await fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/1 Product$/i)).toBeInTheDocument();
    });
  });
});
