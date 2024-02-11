function PageTitle({ title, isMobile, showLoggedUser }) {
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
            <strong>{title}</strong>
            <Divider />
          </h1>
        </>
      ) : (
        <>
          <Divider style={{ boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.25)" }} />
          <h1 style={{ fontSize: 40 }}>
            <strong>{title}</strong>
          </h1>
          <Divider style={{ boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.25)" }} />
        </>
      )}
    </>
  );
}
