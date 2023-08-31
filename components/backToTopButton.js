import React from "react";
import { IconButton } from "@chakra-ui/react";
import { BiSolidUpArrow } from "react-icons/bi";

const BackToTopButton = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      position="fixed"
      bottom="120px"
      right="40px"
      zIndex="9999"
      borderRadius="full"
      aria-label="Voltar para o topo"
      bg="transparent"
    >
      <span
        style={{
          border: "2px solid black",
          borderRadius: "50%",
          padding: "2px",
          display: "inline-block",
        }}
      >
        <BiSolidUpArrow size={30} color="black" />
      </span>
    </IconButton>
  );
};

export default BackToTopButton;
