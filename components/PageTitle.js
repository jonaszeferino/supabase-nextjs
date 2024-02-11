import { Divider } from "antd";
import LoggedUser from "../components/LoggedUser";
import { useMediaQuery } from "@chakra-ui/react";
import { purple } from "@mui/material/colors";

function PageTitle({ title, isMobile: isMobileProp, showLoggedUser }) {
  const [isMobileInternal] = useMediaQuery('(max-width: 768px)');
  const isMobile = isMobileProp !== undefined ? isMobileProp : isMobileInternal;

  return (
    <>
      {showLoggedUser && (
        <div>
          <LoggedUser />
        </div>
      )}
      {isMobile ? (
        <>
          <div style={{ paddingTop: 80 }}>
            {showLoggedUser && <LoggedUser />}
          </div>
          <h1 style={{ paddingTop: 20 }}>
            <Divider />
            <div style={{ color: "#7657be" }}><strong>{title}</strong></div>
            <Divider />
          </h1>
        </>
      ) : (
        <>
          <Divider style={{ boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.25)" }} />
          <h1 style={{ fontSize: 40 }}>
          <div style={{ color: "#7657be" }}><strong>{title}</strong></div>
          </h1>
          <Divider style={{ boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.25)" }} />
        </>
      )}
    </>
  );
}

export default PageTitle;
