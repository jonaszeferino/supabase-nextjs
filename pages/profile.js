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
import { AntDatePicker, DatePicker, Divider as DividerAntd } from "antd";
import LoggedUser from "../components/LoggedUser";
import { Alert, Space, Spin } from "antd";
import Auth from "../components/Auth";
import Head from "next/head";

const Profile = () => {
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [birthDate, setBirthDate] = useState();
  const [nationality, setNationality] = useState();
  const [gender, setGender] = useState();
  const [firstFavoriteMovie, setFirstFavoriteMovie] = useState();
  const [secondFavoriteMovie, setSecondFavoriteMovie] = useState();
  const [thirdFavoriteMovie, setThirdFavoriteMovie] = useState();
  const [firstFavoriteTvShow, setFirstFavoriteTvShow] = useState();
  const [secondFavoriteTvShow, setSecondFavoriteTvShow] = useState();
  const [thirdFavoriteTvShow, setThirdFavoriteTvShow] = useState();
  const [favoriteMovieGender, setFavoriteMovieGender] = useState();
  const [favoriteTvShowGender, setFavoriteTvShowGender] = useState();
  const [favoriteDirecting, setFavoriteDirecting] = useState();
  const [favoriteActor, setFavoriteActor] = useState();
  const [favoriteActress, setFavoriteActress] = useState();

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailInfo, setEmailInfo] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const dateFormat = "DD/MM/YYYY";
  const [userData, setUserData] = useState(null);

  const [nameEdit, setNameEdit] = useState(true);
  const [surnameEdit, setSurnameEdit] = useState(true);
  const [birthDateEdit, setBirthDateEdit] = useState(true);
  const [nationalityEdit, setNationalityEdit] = useState(true);
  const [genderEdit, setGenderEdit] = useState(true);
  const [firstFavoriteMovieEdit, setFirstFavoriteMovieEdit] = useState(true);
  const [secondFavoriteMovieEdit, setSecondFavoriteMovieEdit] = useState(true);
  const [thirdFavoriteMovieEdit, setThirdFavoriteMovieEdit] = useState(true);
  const [firstFavoriteTvShowEdit, setFirstFavoriteTvShowEdit] = useState(true);
  const [secondFavoriteTvShowEdit, setSecondFavoriteTvShowEdit] =
    useState(true);

  const [thirdFavoriteTvShowEdit, setThirdFavoriteTvShowEdit] = useState(true);
  const [favoriteMovieGenderEdit, setFavoriteMovieGenderEdit] = useState(true);
  const [favoriteTvShowGenderEdit, setFavoriteTvShowGenderEdit] =
    useState(true);
  const [favoriteDirectingEdit, setFavoriteDirectingEdit] = useState(true);
  const [favoriteActorEdit, setFavoriteActorEdit] = useState(true);
  const [favoriteActressEdit, setFavoriteActressEdit] = useState(true);

  const showSearchBar = false;

  const [newUser, setNewUser] = useState();

  useEffect(() => {
    if (emailInfo || isSave === true) {
      getUser();
      setIsLoading(true);
    }
  }, [emailInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Botão Salvar clicado");
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
          name: name || userData.name || null,
          surname: surname || userData.surname || null,
          nationality: nationality || userData.nationality || null,
          birth_date: birthDate || userData.birth_date || null,
          gender: gender || userData.gender || null,
          first_favorite_movie:
            firstFavoriteMovie || userData.first_favorite_movie || null,
          second_favorite_movie:
            secondFavoriteMovie || userData.second_favorite_movie || null,
          third_favorite_movie:
            thirdFavoriteMovie || userData.third_favorite_movie || null,
          favorite_movie_genre:
            favoriteMovieGender || userData.favorite_movie_genre || null,
          first_favorite_tvshow:
            firstFavoriteTvShow || userData.first_favorite_tvshow || null,
          second_favorite_tvshow:
            secondFavoriteTvShow || userData.second_favorite_tvshow || null,
          third_favorite_tvshow:
            thirdFavoriteTvShow || userData.third_favorite_tvshow || null,
          favorite_tvshow_genre:
            favoriteTvShowGender || userData.favorite_tvshow_genre || null,
          favorite_actor: favoriteActor || userData.favorite_actor || null,
          favorite_actress:
            favoriteActress || userData.favorite_actress || null,
          favorite_directing:
            favoriteDirecting || userData.favorite_directing || null,
        }),
      });
      setIsSaving(false);
      setIsSave(true);
      getUser();
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
        setFavoriteActressEdit(true);
        setName(userData.name);
      } else {
        if (response.status === 404) {
          setIsLoading(false);
          setNewUser(true);
        }
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

  console.log(name);

  return (
    <ChakraProvider>
      <Head>
        <title>Profile</title>
        <meta name="keywords" content="tvshow,watch,review"></meta>
        <meta name="description" content="filmes, series,"></meta>
      </Head>
      <ChakraProvider>
        {session ? (
          <p>
            User: {session.user.email} <br />
            <Button
              onClick={() => supabase.auth.signOut()}
              colorScheme="red"
              size="sm"
            >
              Close
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
          <Spin tip="Loading..."></Spin>
          <Alert message="Waiting" description="Waiting the data" type="info" />
        </Space>
      )}

      <br />

      {session ? (
        <Box p={4} style={{ maxWidth: "400px", margin: "0 auto" }}>
          {!isLoading && (
            <>
              <Heading size="lg" mb={4}>
                Profile{" "}
              </Heading>
              {newUser && (
                <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                  <Space
                    direction="vertical"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Alert
                      message="Clique em Editar e Insira Seus Dados Abaixo"
                      type="success"
                      showIcon
                      closable
                    />
                    <Button
                      onClick={() => (
                        setNameEdit(!nameEdit),
                        setSurnameEdit(!surnameEdit),
                        setBirthDateEdit(!birthDateEdit),
                        setNationalityEdit(!nationalityEdit),
                        setGenderEdit(!genderEdit),
                        setFirstFavoriteMovieEdit(!firstFavoriteMovieEdit),
                        setSecondFavoriteMovieEdit(!secondFavoriteMovieEdit),
                        setThirdFavoriteMovieEdit(!thirdFavoriteMovieEdit),
                        setFirstFavoriteTvShowEdit(!firstFavoriteTvShowEdit),
                        setSecondFavoriteTvShowEdit(!secondFavoriteTvShowEdit),
                        setThirdFavoriteTvShowEdit(!thirdFavoriteTvShowEdit),
                        setFavoriteMovieGenderEdit(!favoriteMovieGenderEdit),
                        setFavoriteTvShowGenderEdit(!favoriteTvShowGenderEdit),
                        setFavoriteDirectingEdit(!favoriteDirectingEdit),
                        setFavoriteActorEdit(!favoriteActorEdit),
                        setFavoriteActressEdit(!favoriteActressEdit)
                      )}
                      colorScheme={favoriteActressEdit ? "red" : "green"}
                      type="submit"
                      style={{ width: "100%" }}
                    >
                      {favoriteActressEdit
                        ? "Edit"
                        : "Enter the Data, Then Click Save"}
                    </Button>
                  </Space>
                </div>
              )}

              <VStack>
                {/* e-mail */}
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

                {/* Dados do usario abaixo: */}
                {/* Name */}

                <>
                  {/* Name */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>Name:</FormLabel>
                    {nameEdit && (
                      <Input
                        isDisabled={nameEdit}
                        type="text"
                        name="firstName"
                        value={userData?.name}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!nameEdit && (
                      <Input
                        placeholder={userData?.name || "Name"}
                        isDisabled={nameEdit}
                        type="text"
                        name="firstName"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormControl>

                  {/* Surname */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Surname:
                    </FormLabel>
                    {surnameEdit && (
                      <Input
                        isDisabled={surnameEdit}
                        type="text"
                        name="surname"
                        value={userData?.surname}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!surnameEdit && (
                      <Input
                        placeholder={userData?.surname || "Enter your Surname"}
                        isDisabled={surnameEdit}
                        type="text"
                        name="surname"
                        value={surname}
                        onChange={(e) => {
                          setSurname(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormControl>

                  {/* nacionalidade */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Nationality
                    </FormLabel>
                    {nationalityEdit && (
                      <Input
                        isDisabled={nationalityEdit}
                        type="text"
                        name="nationality"
                        value={userData?.nationality}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!nationalityEdit && (
                      <Input
                        placeholder={
                          userData?.nationality || "Enter your nationality"
                        }
                        isDisabled={nationalityEdit}
                        type="text"
                        name="nationality"
                        value={nationality}
                        onChange={(e) => {
                          setNationality(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormControl>

                  {/* Data de Nascimento */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Birthdate:
                    </FormLabel>
                    {birthDateEdit && (
                      <Input
                        isDisabled={birthDateEdit}
                        type="text"
                        name="nationality"
                        value={userData?.birth_date}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!birthDateEdit && (
                      <Input
                        placeholder={
                          userData?.birth_date || "Enter your birth dd/mm/aaaa"
                        }
                        isDisabled={birthDateEdit}
                        type="text"
                        name="nationality"
                        value={birthDate}
                        onChange={(e) => {
                          setBirthDate(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormControl>

                  {/* Genero */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>Gender</FormLabel>
                    {genderEdit && (
                      <Input
                        isDisabled={genderEdit}
                        type="text"
                        name="gender"
                        value={userData?.gender}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!genderEdit && (
                      <Select
                        isDisabled={genderEdit}
                        name="gender"
                        value={gender}
                        onChange={(e) => {
                          setGender(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      >
                        <option value={userData?.gender || "Escolha o Genero"}>
                          {userData?.gender || "Escolha o Genero"}
                        </option>
                        <option value="Masculino">Male</option>
                        <option value="Feminino">Female</option>
                        <option value="Não binário">Non-binary</option>
                        <option value="Prefiro não informar">
                          Prefer not to provide
                        </option>
                      </Select>
                    )}
                  </FormControl>

                  <Center>
                    <DividerAntd>My Preferences</DividerAntd>
                  </Center>

                  {/* Filmes Favoritos */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Favorite Movies
                    </FormLabel>

                    {/* first movie     */}
                    {firstFavoriteMovieEdit && (
                      <Input
                        isDisabled={firstFavoriteMovieEdit}
                        type="text"
                        name="favoriteFirstMovie"
                        value={userData?.first_favorite_movie}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                    {!firstFavoriteMovieEdit && (
                      <Input
                        isDisabled={firstFavoriteMovieEdit}
                        placeholder={
                          userData?.first_favorite_movie ||
                          "Primeiro Filme Favorito"
                        }
                        type="text"
                        name="favoriteFirstMovie"
                        onChange={(e) => {
                          setFirstFavoriteMovie(e.target.value);
                        }}
                        value={firstFavoriteMovie}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}

                    {/* second movie     */}
                    {secondFavoriteMovieEdit && (
                      <Input
                        isDisabled={secondFavoriteMovieEdit}
                        type="text"
                        name="favoriteSecondMovie"
                        value={userData?.second_favorite_movie}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                    {!secondFavoriteMovieEdit && (
                      <Input
                        isDisabled={secondFavoriteMovieEdit}
                        placeholder={
                          userData?.second_favorite_movie ||
                          "Segundo Filme Favorito"
                        }
                        type="text"
                        name="favoriteSecondMovie"
                        onChange={(e) => {
                          setSecondFavoriteMovie(e.target.value);
                        }}
                        value={secondFavoriteMovie}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}

                    {/* third movie  */}
                    {thirdFavoriteMovieEdit && (
                      <Input
                        isDisabled={thirdFavoriteMovieEdit}
                        type="text"
                        name="favoriteThirdMovie"
                        value={userData?.third_favorite_movie}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                    {!thirdFavoriteMovieEdit && (
                      <Input
                        isDisabled={thirdFavoriteMovieEdit}
                        placeholder={
                          userData?.third_favorite_movie ||
                          "Terceiro Filme Favorito"
                        }
                        type="text"
                        name="favoriteThirdMovie"
                        onChange={(e) => {
                          setThirdFavoriteMovie(e.target.value);
                        }}
                        value={thirdFavoriteMovie}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                  </FormControl>

                  {/* Genero de filme       */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Favorite Movie Gender
                    </FormLabel>

                    {favoriteMovieGenderEdit && (
                      <Input
                        isDisabled={favoriteMovieGenderEdit}
                        type="text"
                        name="favoriteMovieGender"
                        value={userData?.favorite_movie_genre}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!favoriteMovieGenderEdit && (
                      <Select
                        isDisabled={favoriteMovieGenderEdit}
                        name="favoriteMovieGender"
                        value={favoriteMovieGender}
                        onChange={(e) => {
                          setFavoriteMovieGender(e.target.value);
                        }}
                        style={{ width: "100%", color: "gray" }}
                      >
                        <option
                          value={
                            userData?.favorite_movie_genre ||
                            "Enter favorite movie gender"
                          }
                        >
                          {userData?.favorite_movie_genre ||
                            "Enter favorite movie gender"}{" "}
                        </option>

                        <option value="Ação">Action</option>
                        <option value="Aventura">Adventure</option>
                        <option value="Comédia">Comedy</option>
                        <option value="Drama">Drama</option>
                        <option value="Ficção Científica">
                          Science Fiction
                        </option>
                        <option value="Fantasia">Fantasia</option>
                        <option value="Horror">Horror</option>
                        <option value="Suspense">Suspense</option>
                        <option value="Romance">Romance</option>
                        <option value="Documentários">Documentaries</option>
                      </Select>
                    )}
                  </FormControl>

                  {/* Series Favoritas */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Favorite Tv Shows
                    </FormLabel>

                    {firstFavoriteTvShowEdit && (
                      <Input
                        isDisabled={firstFavoriteTvShowEdit}
                        type="text"
                        name="favoriteFirstTvShow"
                        value={userData?.first_favorite_tvshow}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                    {!firstFavoriteTvShowEdit && (
                      <Input
                        isDisabled={firstFavoriteTvShowEdit}
                        placeholder={
                          userData?.first_favorite_tvshow ||
                          "First Favorite Tv Show"
                        }
                        type="text"
                        name="favoriteFirstTvShow"
                        onChange={(e) => {
                          setFirstFavoriteTvShow(e.target.value);
                        }}
                        value={firstFavoriteTvShow}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}

                    {secondFavoriteTvShowEdit && (
                      <Input
                        isDisabled={secondFavoriteTvShowEdit}
                        type="text"
                        name="favoriteSecondTvShow"
                        value={userData?.second_favorite_tvshow}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                    {!secondFavoriteTvShowEdit && (
                      <Input
                        isDisabled={secondFavoriteTvShowEdit}
                        placeholder={
                          userData?.second_favorite_tvshow ||
                          "Second Favorite TV Show"
                        }
                        type="text"
                        name="favoriteFirstTvShow"
                        onChange={(e) => {
                          setSecondFavoriteTvShow(e.target.value);
                        }}
                        value={secondFavoriteTvShow}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}

                    {thirdFavoriteTvShowEdit && (
                      <Input
                        isDisabled={thirdFavoriteTvShowEdit}
                        type="text"
                        name="favoriteThirdTvShow"
                        value={userData?.third_favorite_tvshow}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                    {!thirdFavoriteTvShowEdit && (
                      <Input
                        isDisabled={thirdFavoriteTvShowEdit}
                        placeholder={
                          userData?.third_favorite_tvshow ||
                          "Terceira Serie Favorito"
                        }
                        type="text"
                        name="favoriteThirdTvShow"
                        onChange={(e) => {
                          setThirdFavoriteTvShow(e.target.value);
                        }}
                        value={thirdFavoriteTvShow}
                        style={{ width: "100%", margin: "2px" }}
                      />
                    )}
                  </FormControl>

                  {/* genero de serie favorita */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Favorite Tv Show Gender
                    </FormLabel>

                    {favoriteTvShowGenderEdit && (
                      <Input
                        isDisabled={favoriteTvShowGenderEdit}
                        type="text"
                        name="favoriteTvShowGender"
                        value={userData?.favorite_tvshow_genre}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!favoriteTvShowGenderEdit && (
                      <Select
                        isDisabled={favoriteTvShowGenderEdit}
                        name="favoriteTvShowGender"
                        value={favoriteTvShowGender}
                        onChange={(e) => {
                          setFavoriteTvShowGender(e.target.value);
                        }}
                        style={{ width: "100%", color: "gray" }}
                      >
                        <option
                          value={
                            userData?.favorite_tvshow_genre ||
                            "Enter Favorite Tv Show Gender"
                          }
                        >
                          {userData?.favorite_tvshow_genre ||
                            "Enter Favorite Movie Gender"}
                        </option>

                        <option value="Ação">Action</option>
                        <option value="Aventura">Adventure</option>
                        <option value="Comédia">Comedy</option>
                        <option value="Drama">Drama</option>
                        <option value="Ficção Científica">
                          Science Fiction
                        </option>
                        <option value="Fantasia">Fantasia</option>
                        <option value="Horror">Horror</option>
                        <option value="Suspense">Suspense</option>
                        <option value="Romance">Romance</option>
                        <option value="Documentários">Documentaries</option>
                      </Select>
                    )}
                  </FormControl>

                  {/* Ator favorito */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Favorite Actor
                    </FormLabel>
                    {favoriteActorEdit && (
                      <Input
                        isDisabled={favoriteActorEdit}
                        type="text"
                        name="favoriteActor"
                        value={userData?.favorite_actor}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!favoriteActorEdit && (
                      <Input
                        placeholder={
                          userData?.favorite_actor || "Enter favorite actor"
                        }
                        isDisabled={favoriteActorEdit}
                        type="text"
                        name="favoriteActor"
                        value={favoriteActor}
                        onChange={(e) => {
                          setFavoriteActor(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormControl>
                  {/* Atriz favorita */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Favorite Actress
                    </FormLabel>

                    {favoriteActressEdit && (
                      <Input
                        isDisabled={favoriteActressEdit}
                        type="text"
                        name="favoriteActress"
                        value={userData?.favorite_actress}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!favoriteActressEdit && (
                      <Input
                        placeholder={
                          userData?.favorite_actress || "Enter favorite Actress"
                        }
                        isDisabled={favoriteActressEdit}
                        type="text"
                        name="favoriteActress"
                        value={favoriteActress}
                        onChange={(e) => {
                          setFavoriteActress(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormControl>

                  {/* Direcao */}
                  <FormControl>
                    <FormLabel style={{ fontWeight: "bold" }}>
                      Favorite Direction
                    </FormLabel>

                    {favoriteDirectingEdit && (
                      <Input
                        isDisabled={favoriteDirectingEdit}
                        type="text"
                        name="favoriteDirecting"
                        value={userData?.favorite_directing}
                        style={{ width: "100%" }}
                      />
                    )}
                    {!favoriteDirectingEdit && (
                      <Input
                        placeholder={
                          userData?.favorite_directing ||
                          "Digite o Direção Favorita"
                        }
                        isDisabled={favoriteDirectingEdit}
                        type="text"
                        name="favoriteActress"
                        value={favoriteDirecting}
                        onChange={(e) => {
                          setFavoriteDirecting(e.target.value);
                        }}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormControl>

                  {/* teste */}

                  {/* <Input
                    type="text"
                    name="firstNameTeste"
                    defaultValue={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    style={{ width: "100%" }}
                  /> */}
                </>

                <Button
                  onClick={() => insertUser()}
                  colorScheme="blue"
                  type="submit"
                  style={{ width: "100%" }}
                  isDisabled={favoriteActressEdit}
                >
                  Salve
                </Button>

                {isSaving && (
                  <Space
                    direction="vertical"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Spin tip="Loading.."></Spin>
                    <Alert
                      message="Waiting"
                      description="Your Data is Being Saved"
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
                      message="Sucessfuly"
                      type="success"
                      showIcon
                      closable
                    />
                  </Space>
                )}

                <Button
                  onClick={() => (
                    setNameEdit(!nameEdit),
                    setSurnameEdit(!surnameEdit),
                    setBirthDateEdit(!birthDateEdit),
                    setNationalityEdit(!nationalityEdit),
                    setGenderEdit(!genderEdit),
                    setFirstFavoriteMovieEdit(!firstFavoriteMovieEdit),
                    setSecondFavoriteMovieEdit(!secondFavoriteMovieEdit),
                    setThirdFavoriteMovieEdit(!thirdFavoriteMovieEdit),
                    setFirstFavoriteTvShowEdit(!firstFavoriteTvShowEdit),
                    setSecondFavoriteTvShowEdit(!secondFavoriteTvShowEdit),
                    setThirdFavoriteTvShowEdit(!thirdFavoriteTvShowEdit),
                    setFavoriteMovieGenderEdit(!favoriteMovieGenderEdit),
                    setFavoriteTvShowGenderEdit(!favoriteTvShowGenderEdit),
                    setFavoriteDirectingEdit(!favoriteDirectingEdit),
                    setFavoriteActorEdit(!favoriteActorEdit),
                    setFavoriteActressEdit(!favoriteActressEdit)
                  )}
                  colorScheme={favoriteActressEdit ? "red" : "green"}
                  type="submit"
                  style={{ width: "100%" }}
                >
                  {favoriteActressEdit
                    ? "Edit"
                    : "After Editing, Click Save Above"}
                </Button>

                <Text>{message}</Text>
              </VStack>
            </>
          )}
        </Box>
      ) : (
        <Auth />
      )}
    </ChakraProvider>
  );
};

export default Profile;
