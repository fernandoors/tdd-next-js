import { screen, render, fireEvent } from '@testing-library/react';
import { renderHook, RenderResult } from '@testing-library/react-hooks/dom';
import { setAutoFreeze } from 'immer';
import { useCartStore } from 'store/cart';
import CartItem from './cart-item';

setAutoFreeze(false);
const product: Product = {
  id: '1',
  title: 'Notebook',
  price: '22.00',
  image:
    'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
};
const renderCartItem = () => {
  render(<CartItem product={product} />);
};
describe('CartItem', () => {
  let result: RenderResult<Store>;

  beforeEach(() => {
    /* eslint-disable testing-library/no-render-in-setup */
    result = renderHook(() => useCartStore()).result;
  });
  it('should render CartItem', () => {
    renderCartItem();
    expect(screen.getByTestId('cart-item')).toBeInTheDocument();
  });
  it('should display proper content', () => {
    renderCartItem();
    const image = screen.getByTestId('image');
    expect(
      screen.getByText(new RegExp(product.title, 'i')),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(product.price, 'i')),
    ).toBeInTheDocument();
    expect(image).toHaveProperty('src', product.image);
    expect(image).toHaveProperty('alt', product.title);
  });

  it('should call remove() when remove button is clicked', async () => {
    const spy = jest.spyOn(result.current.actions, 'remove');

    renderCartItem();

    const button = screen.getByRole('button', { name: /remove/i });

    await fireEvent.click(button);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });

  it('should call increase() when increase button is clicked', async () => {
    const spy = jest.spyOn(result.current.actions, 'increase');

    renderCartItem();

    const button = screen.getByTestId('increase');

    await fireEvent.click(button);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });
  it('should call decrease() when decrease button is clicked', async () => {
    const spy = jest.spyOn(result.current.actions, 'decrease');

    renderCartItem();

    const button = screen.getByTestId('decrease');

    await fireEvent.click(button);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product);
  });
});
