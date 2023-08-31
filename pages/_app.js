import Navbar from "../components/Navbar";

import Footer from "../components/Footer";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar /> {/* Adicione o Navbar aqui */}
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
