import Navbar from "./Navbar";
import FooterMobile from "./FooterMobile";
import Footer from "./Footer";
import styles from "../styles/MainContainer.module.css";
import NavbarMobile from "./NavbarMobile";
import { useMediaQuery, ChakraProvider } from "@chakra-ui/react";

export default function MainContainer({ children }) {
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
      <div
        className={styles.container}
        style={{ paddingTop: isMobile ? "0px" : "250px" }}
      >
        {children}
      </div>
      {isMobile ? (
        <ChakraProvider>
          <FooterMobile />
        </ChakraProvider>
      ) : (
        <Footer />
      )}{" "}
    </>
  );
}
