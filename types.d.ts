interface Product {
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
