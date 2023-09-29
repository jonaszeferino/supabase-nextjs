import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import { format } from "date-fns";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { BiSolidUpArrow } from "react-icons/bi";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
  Text,
  ChakraProvider,
  VStack,
  Center,
  Flex,
  Icon,
  IconButton,
  Progress,
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import LoggedUser from "../components/LoggedUser";
import { Tooltip, Pagination } from "antd";

export default function Discovery() {
  let [searchMovies, setSearchMovies] = useState([]);
  let [searchRatingSort, setSearchRatingSort] = useState("vote_average.desc");
  let [searchVoteCount, setSearchVoteCount] = useState(100);

  let [searchMovieTotalResults, setSearchMovieTotalResults] = useState("");
  let [searchMovieReleaseDateFrom, setSearchMovieReleaseDateFrom] =
    useState(1800);
  let [searchMovieReleaseDateTo, setSearchMovieReleaseDateTo] = useState(2023);

  //pagination
  let [searchMovieTotalPages, setSearchMovieTotalPages] = useState("");
  let [searchMovieRealPage, setSearchMovieRealPage] = useState("");
  let [page, setPage] = useState(1);

  let [isError, setError] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  let [searchTvType, setSearchTvType] = useState("");

  const { showBackToTopButton, scrollToTop } = useBackToTopButton(); // tranformado num hook

  let urlString =
    "https://api.themoviedb.org/3/discover/tv?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR&include_adult=false&include_video=false&vote_count.gte=" +
    searchVoteCount +
    "&vote_count.lte=10000000&sort_by=" +
    searchRatingSort +
    "&first_air_date.gte=" +
    (searchMovieReleaseDateFrom + 1) +
    "&first_air_date.lte=" +
    (searchMovieReleaseDateTo + 1);

  if (searchTvType !== "") {
    urlString += "&with_type=" + searchTvType;
  }

  const apiCall = (currentPage) => {
    if (currentPage === "" || isNaN(currentPage)) {
      currentPage = 1;
    } else {
      currentPage = parseInt(currentPage);
    }
    const url = urlString + "&page=" + currentPage;
    setIsLoading(true);

    console.log(url);

    fetch(url, {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          setError(false);
          return response.json();
        } else {
          throw new Error("Dados Incorretos");
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
  };

  //pagination
  const nextPage = (event) => {
    setPage(page + 1), apiCall(page + 1);
  };

  const previousPage = (event) => {
    setPage(page - 1), apiCall();
  };

  let totalPages = searchMovieTotalPages;
  let currentPage = searchMovieRealPage;
  let totalResults = searchMovieTotalResults;

  const handleFromChange = (event) => {
    setSearchMovieReleaseDateFrom(parseInt(event.target.value));
  };

  const handleToChange = (event) => {
    setSearchMovieReleaseDateTo(parseInt(event.target.value));
  };
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

  return (
    <>
      <Head>
        <title>Descubra Series</title>
        <meta name="keywords" content="tvshow,watch,review"></meta>
        <meta name="description" content="filmes, series,"></meta>
      </Head>

      <LoggedUser />
      <div className={styles.top}>
        <h3 className={styles.title}> Séries - Programas de TV</h3>
      </div>

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
            textAlign: "center",
          }}
        >
          <ChakraProvider>
            <FormLabel>Ordem:</FormLabel>
            <Select
              value={searchRatingSort}
              onChange={(event) => setSearchRatingSort(event.target.value)}
            >
              <option value="vote_average.asc">Da Pior Para Melhor Nota</option>
              <option value="vote_average.desc">
                Da Melhor Para Pior Nota
              </option>
            </Select>
          </ChakraProvider>
          <br />
          <ChakraProvider>
            <FormLabel>Nº de Votos:</FormLabel>
            <Select
              value={searchVoteCount}
              onChange={(event) => setSearchVoteCount(event.target.value)}
            >
              <option value="0">Mais de 0 votos</option>
              <option value="50">Mais de 50 votos</option>
              <option value="100">Mais de 100 votos</option>
              <option value="200">Mais de 200 votos</option>
              <option value="500">Mais de 500 votos</option>
              <option value="1000">Mais de 1000 votos</option>
              <option value="5000">Mais de 5000 votos</option>
            </Select>
          </ChakraProvider>
          <br />
          <ChakraProvider>
            <FormLabel>Tipo de Série:</FormLabel>
            <Select
              value={searchTvType}
              onChange={(event) => setSearchTvType(event.target.value)}
            >
              <option value="">Todos Tipos</option>
              <option value="0">Documentário</option>
              <option value="1">Notícias</option>
              <option value="2">Mini Séries</option>
              <option value="3">Realities</option>
              <option value="4">Roteirizadas</option>
              <option value="5">Talk Show</option>
              <option value="6">Videos</option>
            </Select>
          </ChakraProvider>
          <br />
          <ChakraProvider>
            <FormControl>
              <FormLabel>Ano Inicial e Final:</FormLabel>
              <Flex align="center">
                <Select
                  value={searchMovieReleaseDateFrom}
                  onChange={handleFromChange}
                >
                  {Array.from({ length: 2024 - 1900 + 1 }, (_, index) => (
                    <option key={index} value={1900 + index}>
                      {1900 + index}
                    </option>
                  ))}
                </Select>
                <Box w="20px" />
                <Select
                  value={searchMovieReleaseDateTo}
                  onChange={handleToChange}
                >
                  {Array.from({ length: 2024 - 1900 + 1 }, (_, index) => (
                    <option key={index} value={1900 + index}>
                      {1900 + index}
                    </option>
                  ))}
                </Select>
              </Flex>
            </FormControl>
          </ChakraProvider>

          <br />
          <ChakraProvider>
            <Button size="lg" colorScheme="purple" onClick={apiCall}>
              Verificar
            </Button>
          </ChakraProvider>
          <br/>
          <br/>
        </div>
      </div>

      <ChakraProvider>{isLoading && <Spinner />}</ChakraProvider>

      {isError === true ? (
        <ErrorPage message={`Verifique as Credenciais`}></ErrorPage>
      ) : (
        <div className={styles.grid}>
          {searchMovies.map((search) => (
            <div key={search.id}>
              <span className={styles.spantext}></span>{" "}
              <span
                className={styles.spantext}
                style={{
                  position: "relative",
                  display: "block",
                  width: "240px",
                  height: "360px",
                }}
              >
                <Link
                  href={{
                    pathname: "/tvshow-page",
                    query: { tvShowId: search.id },
                  }}
                >
                  <a
                    style={{
                      position: "relative",
                      width: "240px",
                      height: "360px",
                      display: "block",
                    }}
                  >
                    <Tooltip
                      title="Saiba Mais"
                      style={{
                        color: "white",
                        borderColor: "purple",
                        background: "purple",
                      }}
                    >
                      {search.poster_path ? (
                        <Image
                          className={styles.card_image}
                          src={`https://image.tmdb.org/t/p/original${search.poster_path}`}
                          alt="poster"
                          width={240}
                          height={360}
                        />
                      ) : (
                        <Image
                          className={styles.card_image}
                          src="/callback.png"
                          alt="poster"
                          width={240}
                          height={360}
                        />
                      )}
                    </Tooltip>

                    <span
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        background: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        textAlign: "center",
                        padding: "8px 0",
                        boxSizing: "border-box",
                      }}
                    >
                      {search.original_name}
                    </span>
                  </a>
                </Link>
              </span>
              <div style={{ maxWidth: "240px", margin: "5px" }}>
                <ChakraProvider>
                  <Progress
                    hasStripe
                    value={search.vote_average}
                    max={10}
                    colorScheme={getProgressColor(search.vote_average)}
                  />
                </ChakraProvider>
                {search.vote_average}
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
            Anterior
          </button>
          <span className={styles.button}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={page >= totalPages}
            className={styles.button}
          >
            Próxima
          </button>
          <br />
          <br />
          <span className={styles.spantext}>
            Total Resultados: {totalResults}
          </span>{" "}
          {/* <Pagination
              current={page}
              total={totalPages}
              onChange={(page) => {
                setPage(page);
                apiCall(page);
              }}
            /> */}
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
