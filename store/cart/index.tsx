import produce from 'immer';
import create from 'zustand';

const initialState = {
  open: false,
  products: [],
};

export const useCartStore = create<Store>((set) => {
  const setState = (fn: (store: Store) => void) => set(produce(fn));
  return {
    state: { ...initialState },

    actions: {
      reset() {
        setState((store: Store) => {
          store.state = { ...initialState };
        });
      },
      toggle() {
        setState(({ state }: Store) => {
          state.open = !state.open;
        });
      },
      add(product) {
        setState(({ state }: Store) => {
          const productAlreadyExists = state.products.some(
            ({ id }) => id === product.id,
          );
          if (!productAlreadyExists) {
            state.products.push(product);
            state.open = true;
          }
        });
      },
      remove(product) {
        setState(({ state }: Store) => {
          state.products = state.products.filter(({ id }) => id !== product.id);
        });
      },
      removeAll() {
        setState(({ state }: Store) => {
          state.products = [];
        });
      },
    },
  };
});
