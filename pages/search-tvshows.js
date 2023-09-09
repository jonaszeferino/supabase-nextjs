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
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";

export default function Discovery() {
  let [searchMovies, setSearchMovies] = useState([]);
  let [searchRatingSort, setSearchRatingSort] = useState("vote_average.desc");
  let [searchVoteCount, setSearchVoteCount] = useState(100);

  let [searchMovieTotalResults, setSearchMovieTotalResults] = useState("");
  let [searchMovieReleaseDateFrom, setSearchMovieReleaseDateFrom] =
    useState(1800);
  let [searchMovieReleaseDateTo, setSearchMovieReleaseDateTo] = useState(2023);

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

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="keywords" content="movies,watch,review"></meta>
        <meta name="description" content="encontre tudo de nba aqui"></meta>
      </Head>
      <div>
        <div className={styles.top}>
          <h3 className={styles.title}> Séries - Programas de TV</h3>
          {/* <span>Escolha os filtros baixo, e clique em Verificar para uma consulta de acordo com o seu desejo!</span> */}
        </div>
        <ChakraProvider>
          <VStack spacing={4} width="100%" padding="20px">
            <FormControl>
              <FormLabel>Ordem:</FormLabel>
              <Select
                value={searchRatingSort}
                onChange={(event) => setSearchRatingSort(event.target.value)}
              >
                <option value="vote_average.asc">
                  Da Pior Para Melhor Nota
                </option>
                <option value="vote_average.desc">
                  Da Melhor Para Pior Nota
                </option>
              </Select>
            </FormControl>

            <FormControl>
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
            </FormControl>

            <FormControl>
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
            </FormControl>
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
            <Button size="lg" colorScheme="purple" onClick={apiCall}>
              Verificar
            </Button>

            {isLoading && <Spinner />}
          </VStack>
        </ChakraProvider>
        {isError === true ? (
          <ErrorPage message={`Verifique as Credenciais`}></ErrorPage>
        ) : (
          <div className={styles.grid}>
            {searchMovies.map((search) => (
              <div key={search.id}>
                <span className={styles.spantext}>{search.original_name} </span>{" "}
                <br />
                <span className={styles.spantext}>{search.name}</span> <br />
                <span>
                  {search.poster_path != null ? (
                    <span>
                      {" "}
                      <Image
                        className={styles.card_image}
                        src={
                          "https://image.tmdb.org/t/p/original" +
                          search.poster_path
                        }
                        alt="poster"
                        width="240"
                        height="360"
                      />{" "}
                    </span>
                  ) : (
                    <span>
                      {" "}
                      <Image
                        className={styles.card_image}
                        src="/callback.png"
                        alt="poster"
                        width="240"
                        height="360"
                      />{" "}
                    </span>
                  )}
                </span>
                <br />
                <span className={styles.spantext}>
                  Média: {search.vote_average} - Nº de Votos:{" "}
                  {search.vote_count}
                </span>{" "}
                <br />
                <span className={styles.spantext}>
                  Data de Lançamento:
                  {search.first_air_date.length > 0
                    ? format(new Date(search.first_air_date), " dd/MM/yyyy")
                    : ""}
                </span>
                <br />
                <Link
                  href={{
                    pathname: "/tvshow-page",
                    query: { tvShowId: search.id },
                  }}
                >
                  <a className={styles.button}>Detalhes</a>
                </Link>
                <br />
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
      </div>
    </>
  );
}
