import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import { useRouter } from "next/router";
import {
  ChakraProvider,
  Button,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Divider,
  Heading,
  Box,
} from "@chakra-ui/react";

import Link from "next/link";
import Image from "next/image";
import TranslateProfile from "../components/TranslateProfile";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";

export default function Personapi() {
  const router = useRouter();
  const personIdRecive = router.query.personId;
  const [personRecive, setPersonRecive] = useState({});
  const [isError, setError] = useState(false);
  const [dataPerson, setDataPerson] = useState({});
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();

  console.log();

  useEffect(() => {
    apiCall();
  }, [personIdRecive]);

  const apiCall = () => {
    if (!personIdRecive) {
      return;
    }
    const url = `https://api.themoviedb.org/3/person/${personIdRecive}?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR`;

    fetch(url, {})
      .then((response) => {
        if (response.status === 200) {
          setError(false);
          return response.json();
        } else {
          setError(true);
          throw console.log("Erro 1");
        }
      })
      .then((result) => setPersonRecive(result))
      .catch((error) => setError(true));
  };

  const CallDataPerson = () => {
    if (!personIdRecive) {
      return;
    }
    const url = `https://api.themoviedb.org/3/person/${personIdRecive}/combined_credits?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR`;

    fetch(url, {})
      .then((response) => {
        if (response.status === 200) {
          setError(false);
          return response.json();
        } else {
          setError(true);
          throw console.log("Erro 1");
        }
      })
      .then((result) => {
        const { cast, crew } = result;
        setDataPerson({ cast, crew });
      })
      .catch((error) => setError(true));
  };

  return (
    <div>
      {isError === true ? (
        <ErrorPage message={"Erro ao carregar a página"} />
      ) : (
        <div>
          <h3 className={styles.title}></h3>

          <span>
            {personRecive.profile_path != null ? (
              <img
                className={styles.card_image_big}
                src={
                  "https://image.tmdb.org/t/p/original" +
                  personRecive.profile_path
                }
                alt="poster"
                width="480"
                height="720"
                style={{
                  objectFit: "contain",
                  maxHeight: "100%",
                  maxWidth: "100%",
                }}
              />
            ) : (
              <Image
                className={styles.card_image_big}
                src="/callback.png"
                alt="poster"
                width="480"
                height="720"
                style={{
                  objectFit: "contain",
                  maxHeight: "100%",
                  maxWidth: "100%",
                }}
              />
            )}
          </span>

          <ChakraProvider>
            <div
              style={{
                maxWidth: "480px",
                margin: "0 auto",
                wordBreak: "break-word",
              }}
            >
              <TableContainer>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Nome:</Th>
                      <Td>{personRecive.name}</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Th>Conhecido por: </Th>
                      <Td>
                        <TranslateProfile
                          text={personRecive.known_for_department}
                          language="pt"
                        />
                      </Td>
                      <Tr />
                    </Tr>

                    <Tr>
                      <Th>Biografia</Th>
                      <Td>
                        {" "}
                        <Box whiteSpace="pre-wrap">
                          {personRecive.biography}
                        </Box>
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nascimento</Th>
                      <Td>{personRecive.place_of_birth}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </div>
          </ChakraProvider>
          <br />

          <button onClick={CallDataPerson} className={styles.button}>
            Verificar Trabalhos
          </button>
          <br />
          <ChakraProvider>
            {dataPerson.cast ? (
              <>
                <Divider />
                <Heading as="h1" size="lg">
                  Em Frente às Câmeras
                </Heading>
                <Divider />
                <br />
              </>
            ) : null}
          </ChakraProvider>
          <ChakraProvider>
            <div className={styles.grid}>
              {dataPerson.cast &&
                dataPerson.cast.map((work) => (
                  <div key={work.original_title} className={styles.gridItem}>
                    {work.media_type === "movie" ? (
                      <span className={styles.spantext}>{work.title}</span>
                    ) : (
                      <span className={styles.spantext}>{work.name}</span>
                    )}
                    <br />
                    <span>
                      {work.media_type === "movie" ? "Cinema" : "Série"}
                    </span>
                    <br />

                    <img
                      className={styles.card_image}
                      src={
                        work.poster_path
                          ? "https://image.tmdb.org/t/p/original" +
                            work.poster_path
                          : "/callback.png"
                      }
                      alt="poster"
                      width="240"
                      height="360"
                    />
                    <br />
                    <TranslateProfile
                      text={work.character ? work.character : "N/A"}
                      language={"pt"}
                    />
                    <div>
                      <Link
                        href={{
                          pathname:
                            work.media_type === "movie"
                              ? "/movie-page"
                              : "/tvshow-page",
                          query:
                            work.media_type === "movie"
                              ? { movieId: work.id }
                              : { tvShowId: work.id },
                        }}
                      >
                        <a className={styles.button}>Detalhes</a>
                      </Link>
                      <br />
                      <br />
                    </div>
                  </div>
                ))}
            </div>
            {dataPerson.crew ? (
              <>
                <Divider />
                <Heading as="h1" size="lg">
                  Por Trás da Câmeras
                </Heading>
                <Divider />
              </>
            ) : null}
            <br />
            <div className={styles.grid}>
              {dataPerson.crew &&
                dataPerson.crew.map((workCrew) => (
                  <div
                    key={workCrew.original_title}
                    className={styles.gridItem}
                  >
                    {workCrew.media_type === "movie" ? (
                      <span className={styles.spantext}>{workCrew.title}</span>
                    ) : (
                      <span className={styles.spantext}>{workCrew.name}</span>
                    )}
                    <br />
                    <span>
                      {workCrew.media_type === "movie" ? "Cinema" : "Série"}
                    </span>
                    <br />

                    <img
                      className={styles.card_image}
                      src={
                        workCrew.poster_path
                          ? "https://image.tmdb.org/t/p/original" +
                            workCrew.poster_path
                          : "/callback.png"
                      }
                      alt="poster"
                      width="240"
                      height="360"
                    />
                    <br />
                    <TranslateProfile
                      text={workCrew.job ? workCrew.job : "N/A"}
                      language={"pt"}
                    />

                    <br />

                    <div>
                      <Link
                        href={{
                          pathname:
                            workCrew.media_type === "movie"
                              ? "/movie-page"
                              : "/tvshow-page",
                          query:
                            workCrew.media_type === "movie"
                              ? { movieId: workCrew.id }
                              : { tvShowId: workCrew.id },
                        }}
                      >
                        <a className={styles.button}>Detalhes</a>
                      </Link>
                      <br />
                      <br />
                    </div>
                  </div>
                ))}
            </div>
          </ChakraProvider>
          <br />
        </div>
      )}
      {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
    </div>
  );
}
