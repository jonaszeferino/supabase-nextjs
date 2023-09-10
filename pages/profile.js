import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Box,
  Button,
  Input,
  Text,
  ChakraProvider,
  Center,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { supabase } from "../utils/supabaseClient";
import { AntDatePicker, DatePicker } from "antd";
import LoggedUser from "../components/LoggedUser";


const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    gender: "Prefiro não informar",
    favoriteFirstMovie: "",
    favoriteSecondMovie: "",
    favoriteThirdMovie: "",
    movieGenre: "",
    favoriteFirstTVShow: "",
    favoriteSecondTVShow: "",
    favoriteThirdTVShow: "",
    tvShowGenre: "",
    favoriteActor: "",
    favoriteActress: "",
  });

  console.log(formData);

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailInfo, setEmailInfo] = useState("");
  const [message, setMessage] = useState("");

  const dateFormat = "DD/MM/YYYY";

  console.log(formData.firstName);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData.firstName);
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dateOfBirth: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Botão Salvar clicado"); // Adicione esta linha
    await insertUser();
  };

  dayjs.extend(customParseFormat);

  const insertUser = async () => {
    console.log("Primeira Chamada");
    console.log("Enviando solicitação fetch..."); // Adicione esta linha

    setMessage("Chamou!");

    try {
      const response = await fetch("/api/v1/putProfileData", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInfo,
          name: formData.firstName,
          surname: formData.lastName,
          nationality: formData.nationality,
          birth_date: formData.dateOfBirth,
          gender: formData.gender,
          first_favorite_movie: formData.favoriteFirstMovie,
          second_favorite_movie: formData.favoriteSecondMovie,
          third_favorite_movie: formData.favoriteThirdMovie,
          favorite_movie_genre: formData.movieGenre,
          first_favorite_tvshow: formData.favoriteFirstTVShow,
          second_favorite_tvshow: formData.favoriteSecondTVShow,
          third_favorite_tvshow: formData.favoriteThirdTVShow,
          favorite_tvshow_genre: formData.tvShowGenre,
          favorite_actor: formData.favoriteActor,
          favorite_actress: formData.favoriteActress,
        }),
      });
      console.log("Resposta da solicitação fetch:", response); // Adicione esta linha
      console.log("Em princípio, gravou");
      setMessage("Tentou Gravar!");
      return;
    } catch (error) {
      console.error(error);
    }
  };

  console.log(formData.nationality);

  // Verify the session
  useEffect(() => {
    let mounted = true;
    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        if (session) {
          setSession(session);
          setEmailInfo(session.user.email);
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
    <ChakraProvider>
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
      </ChakraProvider>
      {session ? (
        <Box p={4} style={{ maxWidth: "400px", margin: "0 auto" }}>
          <Heading size="lg" mb={4}>
            Dados do Perfil
          </Heading>
          <VStack>
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>E-mail:</FormLabel>
              <Text
                style={{
                  width: "100%",
                  border: "1px solid #ccc",
                  padding: "8px",
                  borderRadius: "5px",
                  borderColor: "#cbd5e0",
                }}
              >
                {emailInfo}
              </Text>
            </FormControl>
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>Nome:</FormLabel>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>Sobrenome:</FormLabel>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>Origem:</FormLabel>
              <Input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Data De Nascimento:
              </FormLabel>
              <DatePicker
                value={formData.dateOfBirth}
                format={dateFormat}
                onChange={handleDateChange}
                style={{
                  width: "100%",
                  height: "42px",
                  borderColor: "#cbd5e0",
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>Gênero:</FormLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={{ width: "100%" }}
              >
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Não binário">Não binário</option>
                <option value="Prefiro não informar">
                  Prefiro não informar
                </option>
              </Select>
            </FormControl>
            <Center>
              <Text>Gostos</Text>
            </Center>
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Filme Favorito:
              </FormLabel>
              <Input
                type="text"
                name="favoriteFirstMovie"
                value={formData.favoriteFirstMovie}
                onChange={handleChange}
                style={{ width: "100%", margin: "2px" }}
                placeholder="Primeiro Filme"
              />
              <Input
                type="text"
                name="favoriteSecoundMovie"
                value={formData.favoriteSecoundMovie}
                onChange={handleChange}
                style={{ width: "100%", margin: "2px" }}
                placeholder="Segundo Filme"
              />
              <Input
                type="text"
                name="favoriteThirdMovie"
                value={formData.favoriteThirdMovie}
                onChange={handleChange}
                style={{ width: "100%", margin: "2px" }}
                placeholder="Terceiro Filme"
              />
            </FormControl>
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Gênero de Filme Favorito:
              </FormLabel>
              <Select
                name="movieGenre"
                value={formData.movieGenre}
                onChange={handleChange}
                style={{ width: "100%" }}
              >
                <option value="Ação">Ação</option>
                <option value="Aventura">Aventura</option>
                <option value="Comédia">Comédia</option>
                <option value="Drama">Drama</option>
                <option value="Ficção Científica">Ficção Científica</option>
                <option value="Fantasia">Fantasia</option>
                <option value="Horror">Horror</option>
                <option value="Suspense">Suspense</option>
                <option value="Romance">Romance</option>
                <option value="Documentários">Documentários</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Series Favoritas:
              </FormLabel>
              <Input
                type="text"
                name="favoriteFirstTVShow"
                value={formData.favoriteFirstTVShow}
                onChange={handleChange}
                style={{ width: "100%", margin: "2px" }}
                placeholder="Primeira Serie"
              />
              <Input
                type="text"
                name="favoriteSecoundTVShow"
                value={formData.favoriteSecoundTVShow}
                onChange={handleChange}
                style={{ width: "100%", margin: "2px" }}
                placeholder="Segunda Serie"
              />
              <Input
                type="text"
                name="favoriteThirdTVShow"
                value={formData.favoriteThirdTVShow}
                onChange={handleChange}
                style={{ width: "100%", margin: "2px" }}
                placeholder="Terceira Filme"
              />
            </FormControl>

            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Gênero de Serie Favorito:
              </FormLabel>
              <Select
                name="tvShowGenre"
                value={formData.tvShowGenre}
                onChange={handleChange}
                style={{ width: "100%" }}
              >
                <option value="Ação">Ação</option>
                <option value="Aventura">Aventura</option>
                <option value="Comédia">Comédia</option>
                <option value="Drama">Drama</option>
                <option value="Ficção Científica">Ficção Científica</option>
                <option value="Fantasia">Fantasia</option>
                <option value="Horror">Horror</option>
                <option value="Suspense">Suspense</option>
                <option value="Romance">Romance</option>
                <option value="Doramas">Doramas</option>
                <option value="Documentários">Documentários</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Ator Favorito:
              </FormLabel>
              <Input
                type="text"
                name="favoriteActor"
                value={formData.favoriteActor}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Atriz Favorita:
              </FormLabel>
              <Input
                type="text"
                name="favoriteActress"
                value={formData.favoriteActress}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </FormControl>
            <Button
              onClick={insertUser}
              colorScheme="blue"
              type="submit"
              style={{ width: "100%" }}
            >
              Salvar
            </Button>

            <Text>{message}</Text>
          </VStack>
        </Box>
      ) : (
        "Usuário Não Logado"
      )}
    </ChakraProvider>
  );
};

export default Profile;
