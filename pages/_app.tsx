/* istanbul ignore file */
import '../styles/globals.css';
import type { AppProps } from 'next/app';
if (process.env.NODE_ENV === 'development') {
  require('../miragejs/server').makeServer();
}
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
