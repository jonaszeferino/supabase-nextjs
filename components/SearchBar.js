import React, { useState } from "react";
import {
  Box,
  Button,
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

import { SearchIcon } from "@chakra-ui/icons";
import Link from "next/link";
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

  function selecionarTermo(termo) {
    setSearchText(termo);
    setTermosSugeridos([]);
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <ChakraProvider>
        <Flex
          alignItems="center"
          width="100%"
          flex="1"
          style={{ margin: "2px" }}
          flexDirection="column"
        >
          <>
            <InputGroup
              flex="1"
              width={isMobile ? "80%" : "100%"}
              flexDirection="column"
            >
              <Input
                margin="2px"
                required={true}
                size="md"
                bg="white"
                color="black"
                borderColor="gray"
                borderWidth="1px"
                mt="24px"
                type="search"
                placeholder="Filmes, Series, Pessoas"
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
              {!isMobile && (
                <InputRightElement
                  size="lg"
                  mt="24px"
                  pointerEvents="none"
                  marginLeft="auto"
                  marginRight="auto"
                >
                  <SearchIcon color="gray.300" margin={1} size="lg" />
                </InputRightElement>
              )}
            </InputGroup>
            <Center>
              <Button
                type="submit"
                marginTop={1}
                as="a"
                size="md"
                bg="white"
                color="black"
                borderColor="gray"
                borderWidth="1px"
                mt="2px"
                marginLeft="auto"
                onClick={handleSearch}
              >
                Pesquisar
              </Button>
            </Center>
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
                      Sugestões:
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
                          onClick={() => selecionarTermo(termo)}
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
