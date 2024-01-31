import React, { useState } from "react";
import {
  Box,
  Input,
  Spinner,
  Text,
  ChakraProvider,
  InputGroup,
  InputRightElement,
  Flex,
  useMediaQuery,
  Center,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import stringSimilarity from "string-similarity";

const SearchBar = ({ isLoading, showSearchBar = true }) => {
  const [searchText, setSearchText] = useState("");
  const [termosSugeridos, setTermosSugeridos] = useState([]);
  const router = useRouter();
  const [isMouseOverSuggestions, setIsMouseOverSuggestions] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const listaDeTermos = ["Meryl Streep"];

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  }

  function handleSearch() {
    setTermosSugeridos([]);
    router.push(`/search-free?query=${searchText}`);
  }

  function handleInputBlur() {
    if (!isMouseOverSuggestions) {
      setTermosSugeridos([]);
    }
  }

  function buscarTermosSemelhantes(entrada) {
    const resultados = stringSimilarity.findBestMatch(entrada, listaDeTermos);
    const termosSugeridos = resultados.ratings
      .filter((resultado) => resultado.rating > 0.4)
      .map((resultado) => resultado.target);

    return termosSugeridos;
  }

  function handleInputChange(event) {
    const inputValue = event.target.value;
    setSearchText(inputValue);
    if (inputValue.trim() !== "") {
      setTermosSugeridos(buscarTermosSemelhantes(inputValue));
    } else {
      setTermosSugeridos([]);
    }
  }

  function selectTerm(termo) {
    setSearchText(termo);
    setTermosSugeridos([]);
  }

  return (
    <div
      style={{
        maxWidth: "100%",
        margin: "0 auto",
        backgroundColor: "#7657be",
        border: "none",
      }}
    >
      <ChakraProvider>
        <Flex alignItems="center" width="100%" flex="1" flexDirection="column">
          <>
            <InputGroup
              flex="1"
              width={isMobile ? "80%" : "100%"}
              flexDirection="column"
            >
              <Center>
                <Input
                  maxWidth="600px"
                  mb="-60px"
                  required={true}
                  size="md"
                  bg="white"
                  color="black"
                  border="none"
                  mt="18px"
                  type="search"
                  placeholder="Movies, Tvshows, Person"
                  value={searchText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onBlur={() => {
                    if (!isMouseOverSuggestions) {
                      setTermosSugeridos([]);
                    }
                  }}
                  pr={isMobile ? "2.5rem" : "4.5rem"}
                  marginLeft={isMobile ? "auto" : "0"}
                  marginRight={isMobile ? "auto" : "0"}
                />
              </Center>
              {!isMobile && (
                <InputRightElement
                  size="lg"
                  mt="24px"
                  pointerEvents="none"
                  marginLeft="auto"
                  marginRight="auto"
                ></InputRightElement>
              )}
            </InputGroup>
          </>

          {termosSugeridos.length > 0 && (
            <Box
              mt="2"
              position="absolute"
              zIndex="9999"
              bg="white"
              boxShadow="md"
              borderRadius="md"
              width="33%"
            >
              <ul>
                {termosSugeridos.length > 0 && (
                  <Box
                    mt="2"
                    position="absolute"
                    zIndex="9999"
                    bg="white"
                    boxShadow="md"
                    borderRadius="md"
                    width="33%"
                    onMouseEnter={() => setIsMouseOverSuggestions(true)}
                    onMouseLeave={() => setIsMouseOverSuggestions(false)}
                  >
                    <Text p="2" fontWeight="bold">
                      Suggestions:
                    </Text>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        width: "200px",
                      }}
                    >
                      {termosSugeridos.map((termo, index) => (
                        <li
                          key={index}
                          onClick={() => selectTerm(termo)}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {termo}
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
              </ul>
            </Box>
          )}

          <Box>
            <Text>{isLoading ? <Spinner /> : " "}</Text>
          </Box>
        </Flex>
      </ChakraProvider>
    </div>
  );
};

export default SearchBar;
