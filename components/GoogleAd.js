
import { useEffect } from "react";

const GoogleAd = ({ adSlot, adFormat = "auto", fullWidthResponsive = true }) => {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("Erro ao carregar AdSense", err);
    }
  }, []);

  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXX" // Substitua pelo seu ID do AdSense
        data-ad-slot={adSlot} // Substitua pelo seu Slot do AdSense
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      ></ins>
    </div>
  );
};

export default GoogleAd;