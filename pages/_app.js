// _app.js
import MainContainer from "../components/MainContainer";
import "../styles/globals.css";
import GoogleAnalytics from "../components/GoogleAnalytics";

function MyApp({ Component, pageProps }) {
  return (
    <MainContainer>
      <GoogleAnalytics trackingID="G-SCVVG0JH64" />

      <Component {...pageProps} />
    </MainContainer>
  );
}

export default MyApp;
