import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import {
  ChakraProvider,
  Tr,
  Td,
  Box,
  Center,
  Text,
  Table,
  Tbody,
  TableContainer,
  Image,
} from "@chakra-ui/react";
import TranslateProfile from "../components/TranslateProfile";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";

const MoviePage = () => {
  const router = useRouter();
  const { tvShowId, tvShowSeasonId } = router.query;
  const [dataTvShows, setDataTvShows] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { showBackToTopButton, scrollToTop } = useBackToTopButton(); // tranformado num hook

  useEffect(() => {
    if (tvShowId && tvShowSeasonId) {
      CallDataTvShowsDetails();
    }
  }, [tvShowId, tvShowSeasonId]);

  const CallDataTvShowsDetails = () => {
    const url = `https://api.themoviedb.org/3/tv/${tvShowId}/season/${tvShowSeasonId}?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR`;

    fetch(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 404) {
          throw new Error("Temporada não encontrada");
        } else {
          throw new Error("Ocorreu um erro ao buscar os dados");
        }
      })
      .then((result) => {
        setDataTvShows(result);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(true);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <p>Carregando dados...</p>;
  }

  return (
    <>
      <ChakraProvider>
        <Center minHeight="100vh">
          <Box maxW="576px" width="100%" px="4">
            <div className={styles.grid}>
              {dataTvShows.episodes ? (
                dataTvShows.episodes.map((episode) => (
                  <div
                    key={episode.name}
                    className={styles.gridItem}
                    style={{
                      maxWidth: "100%",
                      margin: "0 auto",
                      wordBreak: "break-word",
                    }}
                  >
                    <Box my="6" textAlign="center">
                      <Text fontSize="xl" fontWeight="semibold">
                        {episode.name} - T{tvShowSeasonId} E
                        {episode.episode_number}
                      </Text>
                      <Box
                        width="100%"
                        mx="auto"
                        my="4"
                        boxShadow="3px 8px 12px rgba(0.4, 0.4, 0.4, 0.4)"
                      >
                        <Image
                          src={
                            episode.still_path
                              ? "https://image.tmdb.org/t/p/original" +
                                episode.still_path
                              : "/callback.png"
                          }
                          alt="poster"
                          maxW="100%"
                          height="auto"
                        />
                      </Box>
                      <div
                        style={{
                          maxWidth: "100%",
                          margin: "0 auto",
                          wordBreak: "break-word",
                        }}
                      >
                        <TableContainer>
                          <Table size="sm">
                            <Tbody>
                              <Tr>
                                <Td>Título em Português:</Td>
                                <Td>{episode.name}</Td>
                              </Tr>
                              <Tr>
                                <Td>Overview:</Td>
                                <Td
                                  style={{
                                    wordWrap: "break-word",
                                    maxWidth: "100%", // Use relative unit
                                  }}
                                >
                                  {episode.overview
                                    ? episode.overview
                                    : "Sem infos"}
                                </Td>
                              </Tr>
                              <Tr>
                                <Td>Nota Média:</Td>
                                <Td>{episode.vote_average}</Td>
                              </Tr>
                              <Tr>
                                <Td>Direção e Roteiro</Td>
                                <Td>
                                  {episode.crew && episode.crew.length > 0 && (
                                    <>
                                      {episode.crew
                                        .filter(
                                          (member) => member.job === "Writer"
                                        )
                                        .map((writer, index) => (
                                          <div key={`writer-${index}`}>
                                            {TranslateProfile({
                                              text: "Writer",
                                              language: "pt",
                                            })}
                                            : {writer.name}
                                          </div>
                                        ))}
                                      {episode.crew
                                        .filter(
                                          (member) => member.job === "Director"
                                        )
                                        .map((director, index) => (
                                          <div key={`director-${index}`}>
                                            {TranslateProfile({
                                              text: "Director",
                                              language: "pt",
                                            })}
                                            : {director.name}
                                          </div>
                                        ))}
                                    </>
                                  )}
                                </Td>
                              </Tr>
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </div>
                    </Box>
                  </div>
                ))
              ) : (
                <Text fontSize="xl" fontWeight="semibold" textAlign="center">
                  Nenhum episódio encontrado.
                </Text>
              )}
            </div>
            {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
          </Box>
        </Center>
      </ChakraProvider>
    </>
  );
};

export default MoviePage;
