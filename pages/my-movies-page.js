import { useState, useEffect } from "react";
import {
  ChakraProvider,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button,
  Spinner,
  Image,
} from "@chakra-ui/react";
import { Rate } from "antd";
import { supabase } from "../utils/supabaseClient"; // Importe o supabase aqui

const MoviePage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedAlterMovie, setSelectedAlterMovie] = useState(null);
  const [valueStartDelete, setValueStartDelete] = useState(false);
  const [valueEndDelete, setValueEndDelete] = useState(false);
  const [isConfirmationMode, setIsConfirmationMode] = useState(false);
  const [session, setSession] = useState(null);

  const user_email = "jonaszeferino@gmail.com";
  const apiGetRates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/v1/getRateRandomMovie?user_email=${parseInt(user_email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      setData(responseData);
      setIsLoading(false);
      setValueEndDelete(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    apiGetRates();
    setValueEndDelete(false);
  }, []);

  const apiDeleteRates = async () => {
    setValueStartDelete(true);
    try {
      const response = await fetch("/api/v1/deleteRateRandomMovie", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: selectedMovie,
          user_email: user_email,
        }),
      });
      setValueStartDelete(false), apiGetRates();
      setValueEndDelete(true);
      setIsConfirmationMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  const apiPutRates = async (movieId, rating) => {
    try {
      console.log("Request payload:", {
        movie_id: movieId,
        user_email: user_email,
        rating_by_user: rating,
      });

      const response = await fetch("/api/v1/putRateRandomMovie", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movieId,
          user_email: user_email,
          rating_by_user: rating,
        }),
      });

      const responseData = await response.json();
      const statusCode = response.status;

      if (statusCode === 200) {
        apiGetRates();
      } else if (statusCode === 404) {
        console.log("No matching document found");
      } else if (statusCode === 500) {
        console.log("Internal server error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  //verificar a sessão
  useEffect(() => {
    let mounted = true;
    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        if (session) {
          setSession(session);
        }
        setIsLoading(false);
      }
    }
    getInitialSession();
    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <>
      {session ? (
        <ChakraProvider>
          {session ? (
            <p>
              Usuário: {session.user.email} <br />
              <Button
                onClick={() => supabase.auth.signOut()}
                colorScheme="red"
                size="sm"
              >
                Sair
              </Button>
            </p>
          ) : null}
          <div
            style={{
              maxWidth: "1500px",
              margin: "0 auto",
              wordBreak: "break-word",
            }}
          >
            <h1>Meus Likes</h1>
            {valueStartDelete ? (
              <h1>
                Excluindo Registro selecionado <Spinner size="xl" />
              </h1>
            ) : null}

            {valueEndDelete ? <h1>Registro Deletado</h1> : null}

            {isLoading ? (
              <Spinner size="xl" />
            ) : (
              <TableContainer>
                <Table variant="simple">
                  <TableCaption>Like Nos Filmes</TableCaption>
                  <Thead>
                    <Tr>
                      <Th>Filme</Th>
                      <Th>Data</Th>
                      <Th>Nota</Th>
                      <Th>Poster</Th>
                      <Th>
                        {isConfirmationMode ? (
                          <>
                            <Button
                              onClick={apiDeleteRates}
                              colorScheme="red"
                              marginRight={2}
                            >
                              Confirmar
                            </Button>
                            <Button
                              onClick={() => setIsConfirmationMode(false)}
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() => setIsConfirmationMode(true)}
                            disabled={selectedMovie === null}
                            colorScheme={
                              selectedMovie !== null ? "red" : "gray"
                            }
                          >
                            Excluir
                          </Button>
                        )}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.map((movie) => (
                      <Tr key={movie.movieId}>
                        <Td>
                          {movie.original_title}
                          <br />
                          <span>{movie.portuguese_title}</span>
                        </Td>
                        <Td>
                          {new Date(movie.like_date).toLocaleDateString()}
                        </Td>
                        <Td>
                          <Rate
                            onChange={(rating) => {
                              setSelectedAlterMovie(movie.movie_id);
                              apiPutRates(movie.movie_id, rating);
                            }}
                            value={movie.rating_by_user || 0}
                            count={10}
                          />
                        </Td>
                        <Td>
                          <Image
                            src={
                              movie.poster_path !== "/callback_gray.png"
                                ? "https://image.tmdb.org/t/p/original" +
                                  movie.poster_path
                                : "/callback_gray.png"
                            }
                            alt="poster"
                            width={60}
                            height={90}
                            style={{
                              objectFit: "contain",
                              maxHeight: "100%",
                              maxWidth: "100%",
                            }}
                          />
                        </Td>
                        <Td>
                          <Checkbox
                            onChange={() =>
                              setSelectedMovie((prevSelectedMovie) =>
                                prevSelectedMovie === movie.movie_id
                                  ? null
                                  : movie.movie_id
                              )
                            }
                            isChecked={selectedMovie === movie.movie_id}
                            isDisabled={isConfirmationMode}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </div>
        </ChakraProvider>
      ) : "Clique em logar para carregar o conteúdo da página" 

      
      }
    </>
  );
};

export default MoviePage;
