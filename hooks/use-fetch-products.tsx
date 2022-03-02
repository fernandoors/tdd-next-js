import { useEffect, useState } from 'react';
import axios from 'axios';
const useFetchProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    axios
      .get('/api/products')
      .then((res) => {
        setProducts(res.data.products as Product[]);
      })
      .catch((err) => {
        setError(true);
      });
    return () => setProducts([]);
  }, []);

  return { products, error };
};

export default useFetchProducts;
