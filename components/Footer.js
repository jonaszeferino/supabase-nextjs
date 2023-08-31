import styles from "../styles/Footer.module.css";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaAppStore,
  FaGooglePlay,
} from "react-icons/fa";
import { SiThemoviedatabase } from "react-icons/si";


export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        O que Ver Hoje? &copy; Jonas Zeferino - 2023
        <span style={{ marginLeft: "8px" }}></span>
      </p>
      <div className={styles.socialIcons}>
        <a
          href="https://www.facebook.com/seu_perfil"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook size={24} />
        </a>
        <a
          href="https://www.instagram.com/seu_perfil"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={24} />
        </a>
        <a
          href="https://www.linkedin.com/seu_perfil"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin size={24} />
        </a>
        <a
          href="https://www.appstore.com/seu_perfil"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaAppStore size={24} />
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=br.gov.meugovbr"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGooglePlay size={24} />
        </a>
        Alimentado Por:
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiThemoviedatabase size={24} />
        </a>
      </div>
    </footer>
  );
}
