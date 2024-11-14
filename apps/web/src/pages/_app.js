import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // No usar Layout en la página de login
  if (router.pathname === '/login') {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;