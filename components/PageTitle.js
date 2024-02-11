import React from 'react';
import { Divider, Rate } from "antd";
import LoggedUser from "../components/LoggedUser";

function PageTitle({ title, isMobile }) {
  return (
    <>
      {isMobile ? (
        <>
          <div style={{ paddingTop: 80, }}>
            <LoggedUser />
          </div>
          <h1 style={{ paddingTop: 20 }}>
            <Divider />
            <strong>{title}</strong>
            <Divider />
          </h1>
        </>
      ) : (
        <>
          <div>
            <LoggedUser />
          </div>
          <Divider style={{ boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.25)" }} />
          <h1 style={{ fontSize: 40 }}><strong>{title}</strong></h1>
          <Divider style={{ boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.25)" }} />
        </>
      )}
    </>
  );
}

export default PageTitle;
