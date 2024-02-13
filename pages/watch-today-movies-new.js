import React, { useEffect, useState, useCallback } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import Image from "next/image";
import Head from "next/head";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Spinner,
  ChakraProvider,
  Center,
  Flex,
  Progress,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Tag,
  HStack,
  useMediaQuery
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import { Tooltip } from "antd";
import Link from "next/link";
import { Divider, Rate } from "antd";
import PageTitle from "../components/PageTitle";

export default function Discovery() {

  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const [searchFilters, setSearchFilters] = useState({
    voteCount: 1000,
    ratingSort: "vote_average.desc",
    //vote_average.lte=5
    //vote_average.gte=5

    decade: 1900,
    releaseDateTo: 2025,
    average: "All",
    category: "All",
  });

  const [searchMovies, setSearchMovies] = useState([]);
  const [searchMovieTotalResults, setSearchMovieTotalResults] = useState("");
  const [genres, setGenres] = useState([]);
  //pagination
  const [searchMovieTotalPages, setSearchMovieTotalPages] = useState("");
  const [searchMovieRealPage, setSearchMovieRealPage] = useState("");
  const [page, setPage] = useState(1);
  const [isError, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // back to the top button
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();


  // nessa url eu busco filmes por década - recupera o numero de paginas ou seja -
  
  // 1 monta a busca - 3 tipos -
      // 1.1 Por decada 
      // 1.1.1 - Decadas com nome + contemporaneos
      // 1.2 Por Qualidade - Melhores e Piores
      // 1.3 Toda a Base
  // 2 Verifica o numero de paginas de resultado
  // 3 escolhe a página aleatoriamente
  // 4 Transforma o id dos filmes num grupo
  // 5 Nesse grupo escolhe aleatoriamente 1 filme
  // 6 Faz a chamada direta no filme


  // nesse aqui verifica toda a base de filmes
  let urlNew =
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US"
    + "&page=" + { page } + "&primary_release_date.gte=1900-01-01&primary_release_date.lte=2025-12-31&sort_by=popularity.desc"

  console.log("URL: Toda Base: ", urlNew)


  // nesse aqui verifica a base pela década dos filmes
  let urlNew2 =
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US"
    + "&page=" + { page }
    + "&primary_release_date.gte="
    + searchFilters.decade + "-01-01&primary_release_date.lte="
    + searchFilters.decade + "-12-31&sort_by=popularity.desc"

  console.log("URL:Verifica por década: ", urlNew2)

  // nesse aqui verifica melhores ou piores filmes com mais de 500 votos
  let urlNew3 =
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page="
    + 1
    + "&primary_release_date.gte=1900-01-01&primary_release_date.lte=2024-12-31&sort_by=popularity.asc"
    + "&vote_average.lte=5"
    + "&vote_count.gte=500"

  console.log("ULR Verifica pela qualidade: ", urlNew3)
  const randomicNumber1 = Math.floor(Math.random() * 2000) + 1;
  const randomicNumber2 = Math.floor(Math.random() * 2000) + 1;
  const randomicNumber3 = Math.floor(Math.random() * 2000) + 1;



  if (searchFilters.average === "All") {
    urlNew;
  } else {
    urlNew += "&with_type=" + searchFilters.average;
  }
  if (searchFilters.category === "All") {
    urlNew;
  } else {
    urlNew += "&with_genres=" + searchFilters.category;
  }

  const apiCall = useCallback(
    (currentPage) => {
      if (currentPage === "" || isNaN(currentPage)) {
        currentPage = 1;
      } else {
        currentPage = parseInt(currentPage);
      }
      const url = urlNew + "&page=" + currentPage;

      setIsLoading(true);

      fetch(url, {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            setError(false);
            return response.json();
          } else {
            throw new Error("Wrong Data");
          }
        })
        .then(
          (result) => (
            setSearchMovies(result.results),
            setSearchMovieTotalPages(result.total_pages),
            setSearchMovieRealPage(result.page),
            setSearchMovieTotalResults(result.total_results),
            setPage(result.page),
            setIsLoading(false)
          )
        )
        .catch((error) => setError(true));
    },
    [urlNew, setIsLoading, setPage]
  );

  useEffect(() => {
    setPage(1);
  }, [searchFilters]);

  useEffect(() => {
    apiCall(page);
  }, [page, apiCall]);

  const nextPage = (event) => {
    setPage(page + 1), apiCall(page + 1);
  };
  const previousPage = (event) => {
    setPage(page - 1), apiCall();
  };

  let totalPages = searchMovieTotalPages;
  let currentPage = searchMovieRealPage;
  let totalResults = searchMovieTotalResults;

  function getProgressColor(progressValue) {
    if (progressValue >= 0.1 && progressValue <= 3.999) {
      return "red";
    } else if (progressValue >= 4.0 && progressValue <= 5.999) {
      return "yellow";
    } else if (progressValue >= 6 && progressValue <= 7.999) {
      return "green";
    } else if (progressValue >= 8 && progressValue <= 10) {
      return "blue";
    } else {
      return "gray";
    }
  }

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/genre/tv/list",
          {
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
            }),
          }
        );
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const selectedFiltersTags = [
    {
      label: `Vote: +${searchFilters.voteCount}`,
      colorScheme: "blue",
    },
    {
      label: `Order: ${searchFilters.ratingSort === "vote_average.desc" ? "Desc" : "Asc"
        }`,
      colorScheme: "green",
    },
    {
      label: `Year: ${searchFilters.decade}-${searchFilters.releaseDateTo}`,
      colorScheme: "red",
    },

    {
      label: `Average: ${searchFilters.average === "&vote_average.lte=5"
        ? "Worst"
        : searchFilters.average === "&vote_average.lte"
          ? "Best" : "All"
        }`,
      colorScheme: "yellow",
    },

    {
      label: `Category: ${genres.find(
        (genre) => genre.id === parseInt(searchFilters.tvShowCategory, 10)
      )?.name || "All"
        }`,
      colorScheme: "gray",
    },
  ];

  return (
    <>
      <Head>
        <title>What To Watch Today?</title>
        <meta name="keywords" content="tvshow,watch,review"></meta>
        <meta name="description" content="movies, tvshows"></meta>
      </Head>
      <PageTitle
        title="What To Watch Today?"
        isMobile={isMobile}
        showLoggedUser={true}
      />

      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ChakraProvider>
            <Button ref={btnRef} colorScheme="purple" onClick={onOpen}>
              Select Filters
            </Button>

            <br />
            <HStack>
              {selectedFiltersTags.map((tag, index) => (
                <Tag key={index} colorScheme={tag.colorScheme}>
                  {tag.label}
                </Tag>
              ))}
            </HStack>
            <Drawer
              isOpen={isOpen}
              placement="right"
              onClose={onClose}
              finalFocusRef={btnRef}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Select Filters</DrawerHeader>

                <DrawerBody>
                  <FormLabel htmlFor="orderby">Movies By Decade</FormLabel>
                  <Select
                    id="Decade"
                    placeholder="Choise Decade"
                    type="text"
                    isRequired={true}
                    value={searchFilters.decade}
                    onChange={(event) =>
                      setSearchFilters({
                        ...searchFilters,
                        decade: event.target.value,
                      })
                    }
                  >
                    <option value="1920">
                      Roaring Twenties
                    </option>
                    <option value="1930">
                      Great Depression Era
                    </option>
                    <option value="1940">
                      World War II Era
                    </option>
                    <option value="1950">
                      Post-War Boom
                    </option>
                    <option value="1960">
                      Swinging Sixties
                    </option>
                    <option value="1970">
                      Me Decade
                    </option>
                    <option value="1910">
                      Contemporary
                    </option>
                  </Select>

                  <br />

                  <FormLabel>Minimum Vote Count</FormLabel>

                  <Select
                    id="votes"
                    placeholder="Number of Votes"
                    type="number"
                    isRequired={true}
                    value={searchFilters.voteCount}
                    onChange={(event) =>
                      setSearchFilters({
                        ...searchFilters,
                        voteCount: event.target.value,
                      })
                    }
                  >
                    <option value="0">0 Votes</option>
                    <option value="50">More than 50</option>
                    <option value="100">More than 100</option>
                    <option value="200">More than 200</option>
                    <option value="500">More than 500</option>
                    <option value="1000">More than 1000</option>
                    <option value="5000">More than 5000</option>
                  </Select>

                  <br />

                  <FormControl>
                    <Center>
                      <FormLabel>Decada</FormLabel>
                    </Center>
                    <Flex align="center">
                      <Select
                        value={searchFilters.decade}
                        onChange={(event) =>
                          setSearchFilters({
                            ...searchFilters,
                            decade: event.target.value,
                          })
                        }
                      >
                        {Array.from({ length: 2025 - 1900 + 1 }, (_, index) => (
                          <option key={index} value={1900 + index}>
                            {1900 + index}
                          </option>
                        ))}
                      </Select>
                      <Box w="20px" />
                      <Select
                        value={searchFilters.releaseDateTo}
                        onChange={(event) =>
                          setSearchFilters({
                            ...searchFilters,
                            releaseDateTo: event.target.value,
                          })
                        }
                      >
                        {Array.from({ length: 2025 - 1900 + 1 }, (_, index) => (
                          <option key={index} value={1900 + index}>
                            {1900 + index}
                          </option>
                        ))}
                      </Select>
                    </Flex>
                  </FormControl>

                  <br />
                  <FormLabel>Best or Worst</FormLabel>
                  <Select
                    value={searchFilters.average}
                    onChange={(event) =>
                      setSearchFilters({
                        ...searchFilters,
                        average: event.target.value,
                      })
                    }
                  >
                    <option value="">Choice Avarege</option>
                    <option value="&vote_average.lte=5">Worst</option>
                    <option value="&vote_average.gte=5">Best</option>
                  </Select>

                  <br />

                  <FormLabel htmlFor="tcShowCategory">
                    Tv Show Category
                  </FormLabel>
                  <Select
                    id="movieCategory"
                    placeholder="Select Category"
                    value={searchFilters.category}
                    onChange={(event) =>
                      setSearchFilters({
                        ...searchFilters,
                        category: event.target.value,
                      })
                    }
                  >
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </Select>
                  <br />
                  <Center>
                    <Button size="lg" colorScheme="purple" onClick={apiCall}>
                      Go
                    </Button>
                  </Center>
                </DrawerBody>

                <DrawerFooter>
                  {/* <Button variant="outline" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button variant="outline" onClick={apiCall}>
                    Go
                  </Button> */}
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </ChakraProvider>
          <br />
          <br />
        </div>
      </div>

      <ChakraProvider>{isLoading && <Spinner />}</ChakraProvider>

      {isError === true ? (
        <ErrorPage message={`Verify your credentials`}></ErrorPage>
      ) : (
        <div className={styles.grid}>
          {searchMovies.map((search) => (
            <div key={search.id}>
              <ChakraProvider>
                {/* <Link as={`/tvshow-page?tvShowId=${search.id}`}> */}

                <Link
                  href={{
                    pathname: "/tvshow-page",
                    query: { tvShowId: search.id },
                  }}
                >
                  <Tooltip
                    title="More"
                    style={{
                      color: "white",
                      borderColor: "purple",
                      background: "purple",
                    }}
                  >
                    <Image
                      className={styles.card_image}
                      src={
                        search.poster_path
                          ? `https://image.tmdb.org/t/p/original${search.poster_path}`
                          : `/callback.png`
                      }
                      alt="poster"
                      width={240}
                      height={360}
                    />
                  </Tooltip>
                </Link>
              </ChakraProvider>

              <div style={{ maxWidth: "240px", margin: "5px" }}>
                <ChakraProvider>
                  <Progress
                    size="lg"
                    value={search.vote_average}
                    max={10}
                    colorScheme={getProgressColor(search.vote_average)}
                  />
                  {search.vote_average} <Rate value={1} count={1} />
                </ChakraProvider>
              </div>
              <br />
            </div>
          ))}
        </div>
      )}

      {searchMovieTotalResults > 0 ? (
        <span>
          <button
            onClick={previousPage}
            disabled={page <= 1}
            className={styles.button}
          >
            Back
          </button>
          <span className={styles.button}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={page >= totalPages}
            className={styles.button}
          >
            Next
          </button>
          <br />
          <br />
          <span className={styles.spantext}>
            Total Results: {totalResults}
          </span>{" "}
        </span>
      ) : (
        ""
      )}

      {!totalResults ? (
        <span>
          {/* Escolha os filtros acima, e clique em Verificar para uma consulta de
            acordo com o seu desejo! */}
        </span>
      ) : (
        ""
      )}

      {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
    </>
  );
}
