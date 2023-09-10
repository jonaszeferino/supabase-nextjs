import Navbar from "./Navbar";
import Footer from "./Footer";
import styles from "../styles/MainContainer.module.css";
import NavbarMobile from "./NavbarMobile";
import { useMediaQuery, ChakraProvider } from "@chakra-ui/react"; // Importe useMediaQuery

export default function MainContainer({ children }) {
  // Use useMediaQuery para verificar o tamanho da tela
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <>
      {isMobile ? (
        <ChakraProvider>
          <NavbarMobile />
        </ChakraProvider>
      ) : (
        <Navbar />
      )}
      <div className={styles.container}>{children}</div>
      <Footer />
    </>
  );
}
