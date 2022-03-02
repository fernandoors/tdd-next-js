import { useState, useEffect } from 'react';
import type { NextPage } from 'next';

import axios from 'axios';

import Search from 'components/search';
import ProductCard from 'components/product-card';
import useFetchProducts from 'hooks/use-fetch-products';
const Home: NextPage = () => {
  const { products, error } = useFetchProducts();
  const [term, setTerm] = useState('');
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  useEffect(() => {
    if (!term) {
      setLocalProducts(products);
    } else {
      setLocalProducts(
        products.filter(({ title }) =>
          title.toLowerCase().includes(term.toLowerCase()),
        ),
      );
    }
  }, [products, term]);

  const productLength = localProducts.length;
  const showProducts = productLength > 0;
  const showEmptyProducts = !showProducts && !error;
  return (
    <main data-testid="product-list" className="my-8">
      <Search doSearch={setTerm} />
      <div className="container mx-auto px-6">
        <h3 className="text-gray-700 text-2x1 font-medium"></h3>
        <span className="mt-3 text-sm text-gray-500">
          {productLength === 1 ? '1 Product' : `${productLength} Products`}
        </span>
        {showProducts &&
          localProducts.map((product, key) => (
            <ProductCard key={key} product={product} addToCart={() => {}} />
          ))}
        {showEmptyProducts && <h4 data-testid="no-products">No Products</h4>}
        {error ? (
          <h5 data-testid="error-get-products">Erro to load products</h5>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
