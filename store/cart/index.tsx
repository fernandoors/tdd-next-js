import create from 'zustand';

const initialState = {
  open: false,
  products: [],
};

const addProduct = (store: Store, product: Product) => {
  if (store.state.products.includes(product)) return store.state.products;
  return [...store.state.products, product];
};

export const useCartStore = create<Store>((set) => ({
  state: { ...initialState },

  actions: {
    reset: () => {
      set(() => ({ state: { ...initialState } }));
    },
    toggle: () => {
      set((store: Store) => ({
        state: { ...store.state, open: !store.state.open },
      }));
    },
    add: (product) => {
      set((store: Store) => ({
        state: { open: true, products: addProduct(store, product) },
      }));
    },
  },
}));
