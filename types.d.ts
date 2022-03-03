interface Product {
  id: string;
  title: string;
  image: string;
  price: string;
}

interface User {
  name: string;
  mobile: string;
  messages?: Messages[];
}

interface Messages {
  content: string;
  date: string;
}

interface State {
  open: boolean;
  products: Product[];
}

interface Actions {
  reset(): void;
  toggle(): void;
  add(product: Product): void;
}

interface Store {
  state: State;
  actions: Actions;
}
