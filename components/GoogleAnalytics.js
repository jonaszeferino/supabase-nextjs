// components/GoogleAnalytics.js
import { useEffect } from 'react';
import ReactGA from 'react-ga';

const GoogleAnalytics = ({ trackingID }) => {
  useEffect(() => {
    ReactGA.initialize(trackingID);
    ReactGA.pageview(window.location.pathname);
  }, [trackingID]);

  return null; // Este componente não renderiza nada no DOM
};

export default GoogleAnalytics;
