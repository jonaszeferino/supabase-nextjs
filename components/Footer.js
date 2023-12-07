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
      <span>What to Watch Today?</span>
      <span>&copy; Jonas Zeferino - 2023</span>
      <div className={styles.socialIcons}>
        {" "}
        Powered by:
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
          <SiThemoviedatabase size={24} />
        </a>
      </div>
    </footer>
  );
}
