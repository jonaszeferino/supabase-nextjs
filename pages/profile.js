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
import { Alert, Space, Spin } from "antd";

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
    favoriteDirecting: "",
  });
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailInfo, setEmailInfo] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const dateFormat = "DD/MM/YYYY";
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (emailInfo || isSave === true) {
      getUser();
      setIsLoading(true);
    }
  }, [emailInfo]);

  isSave;
  console.log(emailInfo);

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
    setIsSaving(true);

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
          favorite_directing: formData.favoriteDirecting,
        }),
      });
      setIsSaving(false);
      setIsSave(true);
      console.log("Corpo da solicitação:", JSON.stringify(requestBody));

      return;
    } catch (error) {
      console.error(error);
      console.log("erro", error);
    }
  };

  const getUser = async () => {
    try {
      const response = await fetch(
        `/api/v1/getProfileData?email=${emailInfo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const userData = await response.json();
        console.log("Dados do usuário:", userData);
        setIsLoading(false);
        setUserData(userData);
        setDateString(userData.birth_date);
      } else {
        console.error("Erro ao buscar o usuário:", response.status);
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
    }
  };

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

      {isLoading && (
        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
        >
          <Spin tip="Salvando.."></Spin>
          <Alert
            message="Aguarde"
            description="Seus Dados Estão Sendo Carregados"
            type="info"
          />
        </Space>
      )}

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
                value={userData?.name || formData.firstName}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    firstName: e.target.value,
                  });
                }}
                style={{ width: "100%" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>Sobrenome:</FormLabel>
              <Input
                type="text"
                name="lastName"
                value={userData?.surname || formData.lastName}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    lastName: e.target.value,
                  });
                }}
                style={{ width: "100%" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>Origem:</FormLabel>
              <Input
                type="text"
                name="nationality"
                value={userData?.nationality || formData.nationality}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    nationality: e.target.value,
                  });
                }}
                style={{ width: "100%" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Data De Nascimento:
              </FormLabel>
              <Input
                value={userData?.birth_date || formData.dateOfBirth}
                format={dateFormat}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    dateOfBirth: e.target.value,
                  });
                }}
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
                value={userData?.gender || formData.gender}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    gender: e.target.value,
                  });
                }}
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
                value={
                  userData?.first_favorite_movie || formData.favoriteFirstMovie
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    favoriteFirstMovie: e.target.value,
                  });
                }}
                style={{ width: "100%", margin: "2px" }}
                placeholder="Primeiro Filme"
              />
              <Input
                type="text"
                name="favoriteSecondMovie"
                value={
                  userData?.second_favorite_movie ||
                  formData.favoriteSecondMovie
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    favoriteSecondMovie: e.target.value,
                  });
                }}
                style={{ width: "100%", margin: "2px" }}
                placeholder="Segundo Filme"
              />
              <Input
                type="text"
                name="favoriteThirdMovie"
                value={
                  userData?.third_favorite_movie || formData.favoriteThirdMovie
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    favoriteThirdMovie: e.target.value,
                  });
                }}
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
                value={userData?.favorite_movie_genre || formData.movieGenre}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    movieGenre: e.target.value,
                  });
                }}
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
                value={
                  userData?.first_favorite_tvshow ||
                  formData.favoriteFirstTVShow
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    favoriteFirstTVShow: e.target.value,
                  });
                }}
                style={{ width: "100%", margin: "2px" }}
                placeholder="Primeira Serie"
              />
              <Input
                type="text"
                name="favoriteSecondTVShow"
                value={
                  userData?.second_favorite_tvshow ||
                  formData.favoriteSecondTVShow
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    favoriteSecondTVShow: e.target.value,
                  });
                }}
                style={{ width: "100%", margin: "2px" }}
                placeholder="Segunda Serie"
              />
              <Input
                type="text"
                name="favoriteThirdTVShow"
                value={
                  userData?.third_favorite_tvshow ||
                  formData.favoriteThirdTVShow
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    favoriteThirdTVShow: e.target.value,
                  });
                }}
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
                value={userData?.favorite_tvshow_genre || formData.tvShowGenre}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    tvShowGenre: e.target.value,
                  });
                }}
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
                value={userData?.favorite_actor || formData.favoriteActor}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    favoriteActor: e.target.value,
                  });
                }}
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
                value={formData.favoriteActress || userData?.favorite_actress}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    favoriteActress: e.target.value,
                  });
                }}
                style={{ width: "100%" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>Direção:</FormLabel>
              <Input
                type="text"
                name="favoriteDirecting"
                value={
                  userData?.favorite_directing || formData.favoriteDirecting
                }
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    favoriteDirecting: e.target.value,
                  });
                }}
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

            {isSaving && (
              <Space
                direction="vertical"
                style={{
                  width: "100%",
                }}
              >
                <Spin tip="Salvando.."></Spin>
                <Alert
                  message="Aguarde"
                  description="Seus Dados Estão Sendo Salvos"
                  type="info"
                />
              </Space>
            )}

            {isSave && (
              <Space
                direction="vertical"
                style={{
                  width: "100%",
                }}
              >
                <Alert
                  message="Cadastro Salvo Com Sucesso"
                  type="success"
                  showIcon
                  closable
                />
              </Space>
            )}

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
