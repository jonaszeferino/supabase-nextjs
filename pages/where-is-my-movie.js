import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { format } from "date-fns";
import { useRouter } from "next/router";
import TranslationComponent from "../components/translateComponent";
import TranslationComponentCountryName from "../components/translateComponentCountryName";
import { SearchIcon } from "@chakra-ui/icons";
import { BiSolidUpArrow } from "react-icons/bi";
import {
  ChakraProvider,
  Center,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Stack,
  Input,
  Box,
  Checkbox,
  InputGroup,
  InputRightElement,
  Text,
  IconButton,
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import Providers from "../components/countries";

const MoviePage = () => {
  const router = useRouter();
  const [movieIdRequest, setMovieIdRequest] = useState(null);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [exibirTabela, setExibirTabela] = useState(false);
  const [exibirTabelaRent, setExibirTabelaRent] = useState(false);
  const [exibirTabelaBuy, setExibirTabelaBuy] = useState(false);
  const [exibirTabelaFree, setExibirTabelaFree] = useState(false);
  const [exibirTabelaAds, setExibirTabelaAds] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("PT");
  const [showAllTables, setShowAllTables] = useState(false);
  const [movieIdSearch, setMovieIdSearch] = useState(null);
  const [totals, setTotals] = useState("");
  const [showPoster, setShowPoster] = useState(false);

  const [movieSearchQuery, setMovieSearchQuery] = useState("");
  const [movieResultSearchMovie, setResultSearchMovie] = useState([]);
  const [error, setError] = useState("");

  const { showBackToTopButton, scrollToTop } = useBackToTopButton(); // tranformado num hook

  const Clean = () => {
    setIsLoading(true);
    setExibirTabela(false);
    setExibirTabelaRent(false);
    setExibirTabelaBuy(false);
    setExibirTabelaFree(false);
    setExibirTabelaAds(false);
    setShowAllTables(false);
  };

  const providers =
    `AD,AE,AL,AO,AR,AT,AU,BA,BE,BF,BG,BH,BO,BR,BZ,CA,CD,CH,CI,CL,CM,CO,CR,CV,CZ,DE,DK,DO,DZ,EC,EE,EG,ES,FI,FR,GB,GG,GH,GI,GT,HN,HR,HU,ID,IE,IL,IN,IQ,IT,JO,JP,KE,KR,KW,LB,LT,LU,LV,LY,MA,MG,MK,ML,MU,MW,MX,MY,MZ,NE,NG,NI,NL,NO,NZ,OM,PA,PE,PH,PL,PT,PY,QA,RO,RS,RU,SA,SE,SG,SI,SK,SV,TD,TH,TN,TR,TZ,UA,UG,US,UY,VE,YE,ZA,ZM,ZW`.split(
      ","
    );

  const apiCall = () => {
    // setMovieSearchQuery(null)
    Clean();
    const url = `https://api.themoviedb.org/3/search/movie?query=${movieSearchQuery}&include_adult=false&language=pt-BR&page=1`;
    setIsLoading(true);

    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDEwYmIyZmJjMTJkZmI2MjlhMGNiYWEzZjQ3ODEwYyIsInN1YiI6IjYzYTY2YmRiZWVhMzRkMDA5MDVlNzQ0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.R2dOkW2sjiG0957GpRYFpWQJcfGC_WBHFs5lIKEYGlE",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setError(false);
          return response.json();
        } else {
          throw new Error("Dados Incorretos");
        }
      })
      .then((result) => {
        setResultSearchMovie(result.results);
        setTotals(result.total_results);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const fetchData = () => {
    setTotals("");
    Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/${movieIdSearch}?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/${movieIdSearch}/watch/providers?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c`
      ),
    ])
      .then(([resMovie, resProviders]) =>
        Promise.all([resMovie.json(), resProviders.json()])
      )
      .then(([dataMovies, dataProviders]) => {
        setTotals({
          total_results: dataProviders.total_results,
        }),
          setData({
            budget: dataMovies.budget,
            originalTitle: dataMovies.original_title,
            portugueseTitle: dataMovies.title,
            poster_path: dataMovies.poster_path,
            gender: dataMovies.genres
              ? dataMovies.genres.map((genre) => genre.name).join(", ")
              : "",
            providers: providers.reduce((acc, provider) => {
              if (dataProviders.results && dataProviders.results[provider]) {
                if (dataProviders.results[provider].flatrate) {
                  acc[provider] = dataProviders.results[provider].flatrate
                    .map((providerItem) => providerItem.provider_name)
                    .join(", ");
                } else {
                  acc[provider] = "";
                }

                if (dataProviders.results[provider].rent) {
                  acc[provider + "_rent"] = dataProviders.results[provider].rent
                    .map((providerItem) => providerItem.provider_name)
                    .join(", ");
                } else {
                  acc[provider + "_rent"] = "";
                }

                if (dataProviders.results[provider].ads) {
                  acc[provider + "_ads"] = dataProviders.results[provider].ads
                    .map((providerItem) => providerItem.provider_name)
                    .join(", ");
                } else {
                  acc[provider + "_ads"] = "";
                }

                if (dataProviders.results[provider].free) {
                  acc[provider + "_free"] = dataProviders.results[provider].free
                    .map((providerItem) => providerItem.provider_name)
                    .join(", ");
                } else {
                  acc[provider + "_free"] = "";
                }

                if (dataProviders.results[provider].buy) {
                  acc[provider + "_buy"] = dataProviders.results[provider].buy
                    .map((providerItem) => providerItem.provider_name)
                    .join(", ");
                } else {
                  acc[provider + "_buy"] = "";
                }
              }

              return acc;
            }, {}),
          });

        setIsLoading(false);
      });
  };

  let poster = "/callback.png";

  if (data.poster_path) {
    poster = "https://image.tmdb.org/t/p/original" + data.poster_path;
  }

  const handleExibirTabela = () => {
    setExibirTabela(!exibirTabela);
    setExibirTabelaRent(false);
    setExibirTabelaBuy(false);
    setExibirTabelaAds(false);
    setExibirTabelaFree(false);
  };
  const handleExibirTabelaRent = () => {
    setExibirTabelaRent(!exibirTabelaRent);
    setExibirTabela(false);
    setExibirTabelaBuy(false);
    setExibirTabelaAds(false);
    setExibirTabelaFree(false);
  };
  const handleExibirTabelaBuy = () => {
    setExibirTabelaBuy(!exibirTabelaBuy);
    setExibirTabela(false);
    setExibirTabelaRent(false);
    setExibirTabelaAds(false);
    setExibirTabelaFree(false);
  };

  const handleExibirTabelaFree = () => {
    setExibirTabelaFree(!exibirTabelaFree);
    setExibirTabela(false);
    setExibirTabelaRent(false);
    setExibirTabelaAds(false);
    setExibirTabelaBuy(false);
  };
  const handleExibirTabelaAds = () => {
    setExibirTabelaAds(!exibirTabelaAds);
    setExibirTabela(false);
    setExibirTabelaRent(false);
    setExibirTabelaFree(false);
    setExibirTabelaBuy(false);
  };

  return (
    <>
      <ChakraProvider>
        <div className={styles.top}>
          <h3 className={styles.title}>Onde Está Meu Filme?</h3>
          {/* <span>
            Verifique em qual lugar do mundo seu filme está disponível
          </span> */}
        </div>
        <br />
        <br />
        <br />
        <div
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            wordBreak: "break-word",
          }}
        >
          <InputGroup>
            <Input
              placeholder="Digite o nome do filme"
              value={movieSearchQuery}
              onChange={(e) => setMovieSearchQuery(e.target.value)}
            />

            <InputRightElement width="auto">
              <SearchIcon color="black" margin={3} />

              <Button colorScheme="purple" onClick={apiCall}>
                Pesquisar
              </Button>
            </InputRightElement>
          </InputGroup>
          <Text>
            {totals === 0 ? (
              <>
                Sem resultados para a busca: <strong>{movieSearchQuery}</strong>{" "}
                - Tente outro termo!
              </>
            ) : (
              ""
            )}
          </Text>
          {totals > 0 ? (
            <Table>
              <Thead>
                <Tr>
                  <Th>Título</Th>
                  <Th>Título Original</Th>
                  <Th>Poster</Th>
                  <Th>Selecionar</Th>
                </Tr>
              </Thead>

              <Tbody>
                {movieResultSearchMovie.map((movie) => (
                  <Tr key={movie.id}>
                    <Td>{movie.title}</Td>
                    <Td>{movie.original_title}</Td>
                    <Td>
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt="Poster"
                          width="240"
                          height="360"
                        />
                      ) : (
                        <Image
                          src="/callback.png"
                          alt="Placeholder"
                          width="240"
                          height="360"
                        />
                      )}
                    </Td>

                    <Td>
                      <Checkbox
                        isChecked={movieIdSearch === movie.id}
                        onChange={() => {
                          setMovieIdSearch(movie.id);
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : null}
          {totals > 0 ? (
            <Button colorScheme="purple" onClick={fetchData}>
              Verificar Os Streamings
            </Button>
          ) : null}
        </div>
      </ChakraProvider>{" "}
      <span className={styles.title}>{data.originalTitle}</span>
      <br />
      <br />
      <div style={{ maxWidth: "480px", margin: "0 auto" }}></div>
      <br />
      <Box>
        {showAllTables ? (
          <Box></Box>
        ) : (
          <Box>
            {Object.keys(data).length > 0 && (
              <Box>
                {poster != null ? (
                  <Image
                    className={styles.card_image_big}
                    src={poster}
                    alt="poster"
                    width={480}
                    height={720}
                  />
                ) : (
                  <Image
                    className={styles.card_image_big}
                    src="/callback.png"
                    alt="poster"
                    width={480}
                    height={720}
                  />
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
      {/* Tabela aqui para baixo */}
      <br />
      <div
        style={{ maxWidth: "480px", margin: "0 auto", wordBreak: "break-word" }}
      >
        {Object.keys(data).length > 0 && (
          <ChakraProvider>
            <br />
            <span>
              Clique nos tipos abaixo pra verificar as listas completas por
              países
            </span>
            <br />
            <br />

            <div
              style={{
                maxWidth: "480px",
                margin: "0 auto",
                wordBreak: "break-word",
              }}
            >
              <Center>
                <Stack direction="row" spacing={2}>
                  <Button
                    onClick={handleExibirTabela}
                    colorScheme={exibirTabela ? "gray" : "purple"}
                    color={exibirTabela ? "black" : "white"}
                  >
                    {exibirTabela ? "Streaming" : "Streaming"}
                  </Button>
                  <Button
                    onClick={handleExibirTabelaRent}
                    colorScheme={exibirTabelaRent ? "gray" : "blue"}
                    color={exibirTabelaRent ? "black" : "white"}
                  >
                    {exibirTabelaRent ? "Para Aluguel" : "Para Aluguel"}
                  </Button>
                  <Button
                    onClick={handleExibirTabelaBuy}
                    colorScheme={exibirTabelaBuy ? "gray" : "purple"}
                    color={exibirTabelaBuy ? "black" : "white"}
                  >
                    {exibirTabelaBuy ? "Compra" : "Compra"}
                  </Button>
                </Stack>
              </Center>
              <br />
              <Center>
                <Stack direction="row" spacing={2}>
                  <Button
                    onClick={handleExibirTabelaAds}
                    colorScheme={exibirTabelaAds ? "gray" : "blue"}
                    color={exibirTabelaAds ? "black" : "white"}
                  >
                    {exibirTabelaAds
                      ? "Gratuita com Anúncios"
                      : "Gratuita com Anúncios"}
                  </Button>
                  <Button
                    onClick={handleExibirTabelaFree}
                    colorScheme={exibirTabelaFree ? "gray" : "purple"}
                    color={exibirTabelaFree ? "black" : "white"}
                  >
                    {exibirTabelaFree ? "Forma Gratuita" : "Forma Gratuita"}
                  </Button>
                </Stack>
              </Center>
            </div>

            {exibirTabela && (
              <TableContainer>
                <Table size="sm">
                  <Tbody>
                    <Tr>
                      <Th>Andorra</Th>
                      <Td>
                        {data.providers && data.providers.AD
                          ? data.providers.AD
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Emirados Árabes Unidos</Th>
                      <Td>
                        {data.providers && data.providers.AE
                          ? data.providers.AE
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Albânia</Th>
                      <Td>
                        {data.providers && data.providers.AL
                          ? data.providers.AL
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Angola</Th>
                      <Td>
                        {data.providers && data.providers.AO
                          ? data.providers.AO
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Argentina</Th>
                      <Td>
                        {data.providers && data.providers.AR
                          ? data.providers.AR
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Áustria</Th>
                      <Td>
                        {data.providers && data.providers.AT
                          ? data.providers.AT
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Austrália</Th>
                      <Td>
                        {data.providers && data.providers.AU
                          ? data.providers.AU
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bósnia e Herzegovina</Th>
                      <Td>
                        {data.providers && data.providers.BA
                          ? data.providers.BA
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bélgica</Th>
                      <Td>
                        {data.providers && data.providers.BE
                          ? data.providers.BE
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Burkina Faso</Th>
                      <Td>
                        {data.providers && data.providers.BF
                          ? data.providers.BF
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bulgária</Th>
                      <Td>
                        {data.providers && data.providers.BG
                          ? data.providers.BG
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bahrein</Th>
                      <Td>
                        {data.providers && data.providers.BH
                          ? data.providers.BH
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bolívia</Th>
                      <Td>
                        {data.providers && data.providers.BO
                          ? data.providers.BO
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Brasil</Th>
                      <Td>
                        {data.providers && data.providers.BR
                          ? data.providers.BR
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Belize</Th>
                      <Td>
                        {data.providers && data.providers.BZ
                          ? data.providers.BZ
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Canadá</Th>
                      <Td>
                        {data.providers && data.providers.CA
                          ? data.providers.CA
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Democrática do Congo</Th>
                      <Td>
                        {data.providers && data.providers.CD
                          ? data.providers.CD
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Suíça</Th>
                      <Td>
                        {data.providers && data.providers.CH
                          ? data.providers.CH
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Costa do Marfim</Th>
                      <Td>
                        {data.providers && data.providers.CI
                          ? data.providers.CI
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Chile</Th>
                      <Td>
                        {data.providers && data.providers.CL
                          ? data.providers.CL
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Camarões</Th>
                      <Td>
                        {data.providers && data.providers.CM
                          ? data.providers.CM
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Colômbia</Th>
                      <Td>
                        {data.providers && data.providers.CO
                          ? data.providers.CO
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Costa Rica</Th>
                      <Td>
                        {data.providers && data.providers.CR
                          ? data.providers.CR
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Cabo Verde</Th>
                      <Td>
                        {data.providers && data.providers.CV
                          ? data.providers.CV
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Cuba</Th>
                      <Td>
                        {data.providers && data.providers.CU
                          ? data.providers.CU
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Tcheca</Th>
                      <Td>
                        {data.providers && data.providers.CZ
                          ? data.providers.CZ
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Alemanha</Th>
                      <Td>
                        {data.providers && data.providers.DE
                          ? data.providers.DE
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Dinamarca</Th>
                      <Td>
                        {data.providers && data.providers.DK
                          ? data.providers.DK
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Dominicana</Th>
                      <Td>
                        {data.providers && data.providers.DO
                          ? data.providers.DO
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Argélia</Th>
                      <Td>
                        {data.providers && data.providers.DZ
                          ? data.providers.DZ
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Equador</Th>
                      <Td>
                        {data.providers && data.providers.EC
                          ? data.providers.EC
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Estônia</Th>
                      <Td>
                        {data.providers && data.providers.EE
                          ? data.providers.EE
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Egito</Th>
                      <Td>
                        {data.providers && data.providers.EG
                          ? data.providers.EG
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Espanha</Th>
                      <Td>
                        {data.providers && data.providers.ES
                          ? data.providers.ES
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Finlândia</Th>
                      <Td>
                        {data.providers && data.providers.FI
                          ? data.providers.FI
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>França</Th>
                      <Td>
                        {data.providers && data.providers.FR
                          ? data.providers.FR
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Reino Unido</Th>
                      <Td>
                        {data.providers && data.providers.GB
                          ? data.providers.GB
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Guernsey</Th>
                      <Td>
                        {data.providers && data.providers.GG
                          ? data.providers.GG
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Gana</Th>
                      <Td>
                        {data.providers && data.providers.GH
                          ? data.providers.GH
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Gibraltar</Th>
                      <Td>
                        {data.providers && data.providers.GI
                          ? data.providers.GI
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Guatemala</Th>
                      <Td>
                        {data.providers && data.providers.GT
                          ? data.providers.GT
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Honduras</Th>
                      <Td>
                        {data.providers && data.providers.HN
                          ? data.providers.HN
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Croácia</Th>
                      <Td>
                        {data.providers && data.providers.HR
                          ? data.providers.HR
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Hungria</Th>
                      <Td>
                        {data.providers && data.providers.HU
                          ? data.providers.HU
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Indonésia</Th>
                      <Td>
                        {data.providers && data.providers.ID
                          ? data.providers.ID
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Irlanda</Th>
                      <Td>
                        {data.providers && data.providers.IE
                          ? data.providers.IE
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Israel</Th>
                      <Td>
                        {data.providers && data.providers.IL
                          ? data.providers.IL
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Índia</Th>
                      <Td>
                        {data.providers && data.providers.IN
                          ? data.providers.IN
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Iraque</Th>
                      <Td>
                        {data.providers && data.providers.IQ
                          ? data.providers.IQ
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Itália</Th>
                      <Td>
                        {data.providers && data.providers.IT
                          ? data.providers.IT
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Jordânia</Th>
                      <Td>
                        {data.providers && data.providers.JO
                          ? data.providers.JO
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Japão</Th>
                      <Td>
                        {data.providers && data.providers.JP
                          ? data.providers.JP
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Quênia</Th>
                      <Td>
                        {data.providers && data.providers.KE
                          ? data.providers.KE
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Coreia do Sul</Th>
                      <Td>
                        {data.providers && data.providers.KR
                          ? data.providers.KR
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Kuwait</Th>
                      <Td>
                        {data.providers && data.providers.KW
                          ? data.providers.KW
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Líbano</Th>
                      <Td>
                        {data.providers && data.providers.LB
                          ? data.providers.LB
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Lituânia</Th>
                      <Td>
                        {data.providers && data.providers.LT
                          ? data.providers.LT
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Luxemburgo</Th>
                      <Td>
                        {data.providers && data.providers.LU
                          ? data.providers.LU
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Letônia</Th>
                      <Td>
                        {data.providers && data.providers.LV
                          ? data.providers.LV
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Líbia</Th>
                      <Td>
                        {data.providers && data.providers.LY
                          ? data.providers.LY
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Marrocos</Th>
                      <Td>
                        {data.providers && data.providers.MA
                          ? data.providers.MA
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Madagascar</Th>
                      <Td>
                        {data.providers && data.providers.MG
                          ? data.providers.MG
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Macedônia do Norte</Th>
                      <Td>
                        {data.providers && data.providers.MK
                          ? data.providers.MK
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Mali</Th>
                      <Td>
                        {data.providers && data.providers.ML
                          ? data.providers.ML
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Maurício</Th>
                      <Td>
                        {data.providers && data.providers.MU
                          ? data.providers.MU
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Malawi</Th>
                      <Td>
                        {data.providers && data.providers.MW
                          ? data.providers.MW
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>México</Th>
                      <Td>
                        {data.providers && data.providers.MX
                          ? data.providers.MX
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Malásia</Th>
                      <Td>
                        {data.providers && data.providers.MY
                          ? data.providers.MY
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Moçambique</Th>
                      <Td>
                        {data.providers && data.providers.MZ
                          ? data.providers.MZ
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Níger</Th>
                      <Td>
                        {data.providers && data.providers.NE
                          ? data.providers.NE
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nigéria</Th>
                      <Td>
                        {data.providers && data.providers.NG
                          ? data.providers.NG
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nicarágua</Th>
                      <Td>
                        {data.providers && data.providers.NI
                          ? data.providers.NI
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Holanda</Th>
                      <Td>
                        {data.providers && data.providers.NL
                          ? data.providers.NL
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Noruega</Th>
                      <Td>
                        {data.providers && data.providers.NO
                          ? data.providers.NO
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nova Zelândia</Th>
                      <Td>
                        {data.providers && data.providers.NZ
                          ? data.providers.NZ
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Omã</Th>
                      <Td>
                        {data.providers && data.providers.OM
                          ? data.providers.OM
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Panamá</Th>
                      <Td>
                        {data.providers && data.providers.PA
                          ? data.providers.PA
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Peru</Th>
                      <Td>
                        {data.providers && data.providers.PE
                          ? data.providers.PE
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Filipinas</Th>
                      <Td>
                        {data.providers && data.providers.PH
                          ? data.providers.PH
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Polônia</Th>
                      <Td>
                        {data.providers && data.providers.PL
                          ? data.providers.PL
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Portugal</Th>
                      <Td>
                        {data.providers && data.providers.PT
                          ? data.providers.PT
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Paraguai</Th>
                      <Td>
                        {data.providers && data.providers.PY
                          ? data.providers.PY
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Catar</Th>
                      <Td>
                        {data.providers && data.providers.QA
                          ? data.providers.QA
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Romênia</Th>
                      <Td>
                        {data.providers && data.providers.RO
                          ? data.providers.RO
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Sérvia</Th>
                      <Td>
                        {data.providers && data.providers.RS
                          ? data.providers.RS
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Rússia</Th>
                      <Td>
                        {data.providers && data.providers.RU
                          ? data.providers.RU
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Arábia Saudita</Th>
                      <Td>
                        {data.providers && data.providers.SA
                          ? data.providers.SA
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Suécia</Th>
                      <Td>
                        {data.providers && data.providers.SE
                          ? data.providers.SE
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Singapura</Th>
                      <Td>
                        {data.providers && data.providers.SG
                          ? data.providers.SG
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Eslovênia</Th>
                      <Td>
                        {data.providers && data.providers.SI
                          ? data.providers.SI
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Eslováquia</Th>
                      <Td>
                        {data.providers && data.providers.SK
                          ? data.providers.SK
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>El Salvador</Th>
                      <Td>
                        {data.providers && data.providers.SV
                          ? data.providers.SV
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Chade</Th>
                      <Td>
                        {data.providers && data.providers.TD
                          ? data.providers.TD
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Tailândia</Th>
                      <Td>
                        {data.providers && data.providers.TH
                          ? data.providers.TH
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Tunísia</Th>
                      <Td>
                        {data.providers && data.providers.TN
                          ? data.providers.TN
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Turquia</Th>
                      <Td>
                        {data.providers && data.providers.TR
                          ? data.providers.TR
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Tanzânia</Th>
                      <Td>
                        {data.providers && data.providers.TZ
                          ? data.providers.TZ
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Ucrânia</Th>
                      <Td>
                        {data.providers && data.providers.UA
                          ? data.providers.UA
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Uganda</Th>
                      <Td>
                        {data.providers && data.providers.UG
                          ? data.providers.UG
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Estados Unidos</Th>
                      <Td>
                        {data.providers && data.providers.US
                          ? data.providers.US
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Uruguai</Th>
                      <Td>
                        {data.providers && data.providers.UY
                          ? data.providers.UY
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Venezuela</Th>
                      <Td>
                        {data.providers && data.providers.VE
                          ? data.providers.VE
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Iêmen</Th>
                      <Td>
                        {data.providers && data.providers.YE
                          ? data.providers.YE
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>África do Sul</Th>
                      <Td>
                        {data.providers && data.providers.ZA
                          ? data.providers.ZA
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Zâmbia</Th>
                      <Td>
                        {data.providers && data.providers.ZM
                          ? data.providers.ZM
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Zimbábue</Th>
                      <Td>
                        {data.providers && data.providers.ZW
                          ? data.providers.ZW
                          : ""}
                      </Td>
                    </Tr>
                  </Tbody>
                  <Thead />
                </Table>
              </TableContainer>
            )}
            {exibirTabelaRent && (
              <TableContainer>
                <Table size="sm">
                  <Tbody>
                    <Tr>
                      <Th>Andorra</Th>
                      <Td>
                        {data.providers && data.providers.AD_rent
                          ? data.providers.AD_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Emirados Árabes Unidos</Th>
                      <Td>
                        {data.providers && data.providers.AE_rent
                          ? data.providers.AE_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Albânia</Th>
                      <Td>
                        {data.providers && data.providers.AL_rent
                          ? data.providers.AL_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Angola</Th>
                      <Td>
                        {data.providers && data.providers.AO_rent
                          ? data.providers.AO_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Argentina</Th>
                      <Td>
                        {data.providers && data.providers.AR_rent
                          ? data.providers.AR_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Áustria</Th>
                      <Td>
                        {data.providers && data.providers.AT_rent
                          ? data.providers.AT_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Austrália</Th>
                      <Td>
                        {data.providers && data.providers.AU_rent
                          ? data.providers.AU_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bósnia e Herzegovina</Th>
                      <Td>
                        {data.providers && data.providers.BA
                          ? data.providers.BA
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bélgica</Th>
                      <Td>
                        {data.providers && data.providers.BE_rent
                          ? data.providers.BE_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Burkina Faso</Th>
                      <Td>
                        {data.providers && data.providers.BF_rent
                          ? data.providers.BF_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bulgária</Th>
                      <Td>
                        {data.providers && data.providers.BG_rent
                          ? data.providers.BG_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bahrein</Th>
                      <Td>
                        {data.providers && data.providers.BH_rent
                          ? data.providers.BH_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bolívia</Th>
                      <Td>
                        {data.providers && data.providers.BO_rent
                          ? data.providers.BO_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Brasil</Th>
                      <Td>
                        {data.providers && data.providers.BR_rent
                          ? data.providers.BR_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Belize</Th>
                      <Td>
                        {data.providers && data.providers.BZ_rent
                          ? data.providers.BZ_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Canadá</Th>
                      <Td>
                        {data.providers && data.providers.CA_rent
                          ? data.providers.CA_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Democrática do Congo</Th>
                      <Td>
                        {data.providers && data.providers.CD_rent
                          ? data.providers.CD_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Suíça</Th>
                      <Td>
                        {data.providers && data.providers.CH_rent
                          ? data.providers.CH_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Costa do Marfim</Th>
                      <Td>
                        {data.providers && data.providers.CI_rent
                          ? data.providers.CI_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Chile</Th>
                      <Td>
                        {data.providers && data.providers.CL_rent
                          ? data.providers.CL_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Camarões</Th>
                      <Td>
                        {data.providers && data.providers.CM_rent
                          ? data.providers.CM_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Colômbia</Th>
                      <Td>
                        {data.providers && data.providers.CO_rent
                          ? data.providers.CO_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Costa Rica</Th>
                      <Td>
                        {data.providers && data.providers.CR_rent
                          ? data.providers.CR_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Cabo Verde</Th>
                      <Td>
                        {data.providers && data.providers.CV_rent
                          ? data.providers.CV_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Cuba</Th>
                      <Td>
                        {data.providers && data.providers.CU_rent
                          ? data.providers.CU_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Tcheca</Th>
                      <Td>
                        {data.providers && data.providers.CZ_rent
                          ? data.providers.CZ_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Cuba</Th>
                      <Td>
                        {data.providers && data.providers.CU_rent
                          ? data.providers.CU_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Alemanha</Th>
                      <Td>
                        {data.providers && data.providers.DE_rent
                          ? data.providers.DE_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Dinamarca</Th>
                      <Td>
                        {data.providers && data.providers.DK_rent
                          ? data.providers.DK_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Dominicana</Th>
                      <Td>
                        {data.providers && data.providers.DO_rent
                          ? data.providers.DO_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Argélia</Th>
                      <Td>
                        {data.providers && data.providers.DZ_rent
                          ? data.providers.DZ_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Equador</Th>
                      <Td>
                        {data.providers && data.providers.EC_rent
                          ? data.providers.EC_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Estônia</Th>
                      <Td>
                        {data.providers && data.providers.EE_rent
                          ? data.providers.EE_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Egito</Th>
                      <Td>
                        {data.providers && data.providers.EG_rent
                          ? data.providers.EG_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Espanha</Th>
                      <Td>
                        {data.providers && data.providers.ES_rent
                          ? data.providers.ES_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Finlândia</Th>
                      <Td>
                        {data.providers && data.providers.FI_rent
                          ? data.providers.FI_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>França</Th>
                      <Td>
                        {data.providers && data.providers.FR_rent
                          ? data.providers.FR_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Reino Unido</Th>
                      <Td>
                        {data.providers && data.providers.GB_rent
                          ? data.providers.GB_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Guernsey</Th>
                      <Td>
                        {data.providers && data.providers.GG_rent
                          ? data.providers.GG_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Gana</Th>
                      <Td>
                        {data.providers && data.providers.GH_rent
                          ? data.providers.GH_rent
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Gibraltar</Th>
                      <Td>
                        {data.providers && data.providers.GI_rent
                          ? data.providers.GI
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Guatemala</Th>
                      <Td>
                        {data.providers && data.providers.GT_rent
                          ? data.providers.GT_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Honduras</Th>
                      <Td>
                        {data.providers && data.providers.HN_rent
                          ? data.providers.HN_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Croácia</Th>
                      <Td>
                        {data.providers && data.providers.HR_rent
                          ? data.providers.HR_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Hungria</Th>
                      <Td>
                        {data.providers && data.providers.HU_rent
                          ? data.providers.HU_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Indonésia</Th>
                      <Td>
                        {data.providers && data.providers.ID_rent
                          ? data.providers.ID_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Irlanda</Th>
                      <Td>
                        {data.providers && data.providers.IE_rent
                          ? data.providers.IE_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Israel</Th>
                      <Td>
                        {data.providers && data.providers.IL_rent
                          ? data.providers.IL_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Índia</Th>
                      <Td>
                        {data.providers && data.providers.IN_rent
                          ? data.providers.IN_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Iraque</Th>
                      <Td>
                        {data.providers && data.providers.IQ_rent
                          ? data.providers.IQ_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Itália</Th>
                      <Td>
                        {data.providers && data.providers.IT_rent
                          ? data.providers.IT_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Jordânia</Th>
                      <Td>
                        {data.providers && data.providers.JO_rent
                          ? data.providers.JO_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Japão</Th>
                      <Td>
                        {data.providers && data.providers.JP_rent
                          ? data.providers.JP_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Quênia</Th>
                      <Td>
                        {data.providers && data.providers.KE_rent
                          ? data.providers.KE_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Coreia do Sul</Th>
                      <Td>
                        {data.providers && data.providers.KR_rent
                          ? data.providers.KR_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Kuwait</Th>
                      <Td>
                        {data.providers && data.providers.KW_rent
                          ? data.providers.KW_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Líbano</Th>
                      <Td>
                        {data.providers && data.providers.LB_rent
                          ? data.providers.LB_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Lituânia</Th>
                      <Td>
                        {data.providers && data.providers.LT_rent
                          ? data.providers.LT_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Luxemburgo</Th>
                      <Td>
                        {data.providers && data.providers.LU_rent
                          ? data.providers.LU_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Letônia</Th>
                      <Td>
                        {data.providers && data.providers.LV
                          ? data.providers.LV
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Líbia</Th>
                      <Td>
                        {data.providers && data.providers.LY_rent
                          ? data.providers.LY_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Marrocos</Th>
                      <Td>
                        {data.providers && data.providers.MA_rent
                          ? data.providers.MA_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Madagascar</Th>
                      <Td>
                        {data.providers && data.providers.MG_rent
                          ? data.providers.MG_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Macedônia do Norte</Th>
                      <Td>
                        {data.providers && data.providers.MK_rent
                          ? data.providers.MK_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Mali</Th>
                      <Td>
                        {data.providers && data.providers.ML_rent
                          ? data.providers.ML_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Maurício</Th>
                      <Td>
                        {data.providers && data.providers.MU_rent
                          ? data.providers.MU_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Malawi</Th>
                      <Td>
                        {data.providers && data.providers.MW_rent
                          ? data.providers.MW_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>México</Th>
                      <Td>
                        {data.providers && data.providers.MX_rent
                          ? data.providers.MX_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Malásia</Th>
                      <Td>
                        {data.providers && data.providers.MY_rent
                          ? data.providers.MY_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Moçambique</Th>
                      <Td>
                        {data.providers && data.providers.MZ_rent
                          ? data.providers.MZ_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Níger</Th>
                      <Td>
                        {data.providers && data.providers.NE_rent
                          ? data.providers.NE_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nigéria</Th>
                      <Td>
                        {data.providers && data.providers.NG_rent
                          ? data.providers.NG_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nicarágua</Th>
                      <Td>
                        {data.providers && data.providers.NI_rent
                          ? data.providers.NI_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Holanda</Th>
                      <Td>
                        {data.providers && data.providers.NL_rent
                          ? data.providers.NL_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Noruega</Th>
                      <Td>
                        {data.providers && data.providers.NO_rent
                          ? data.providers.NO_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nova Zelândia</Th>
                      <Td>
                        {data.providers && data.providers.NZ_rent
                          ? data.providers.NZ_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Omã</Th>
                      <Td>
                        {data.providers && data.providers.OM_rent
                          ? data.providers.OM_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Panamá</Th>
                      <Td>
                        {data.providers && data.providers.PA_rent
                          ? data.providers.PA_rent
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Peru</Th>
                      <Td>
                        {data.providers && data.providers.PE_rent
                          ? data.providers.PE_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Filipinas</Th>
                      <Td>
                        {data.providers && data.providers.PH_rent
                          ? data.providers.PH_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Polônia</Th>
                      <Td>
                        {data.providers && data.providers.PL_rent
                          ? data.providers.PL_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Portugal</Th>
                      <Td>
                        {data.providers && data.providers.PT_rent
                          ? data.providers.PT_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Paraguai</Th>
                      <Td>
                        {data.providers && data.providers.PY_rent
                          ? data.providers.PY_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Catar</Th>
                      <Td>
                        {data.providers && data.providers.QA_rent
                          ? data.providers.QA_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Romênia</Th>
                      <Td>
                        {data.providers && data.providers.RO_rent
                          ? data.providers.RO_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Sérvia</Th>
                      <Td>
                        {data.providers && data.providers.RS_rent
                          ? data.providers.RS_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Rússia</Th>
                      <Td>
                        {data.providers && data.providers.RU_rent
                          ? data.providers.RU_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Arábia Saudita</Th>
                      <Td>
                        {data.providers && data.providers.SA_rent
                          ? data.providers.SA_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Suécia</Th>
                      <Td>
                        {data.providers && data.providers.SE_rent
                          ? data.providers.SE_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Singapura</Th>
                      <Td>
                        {data.providers && data.providers.SG_rent
                          ? data.providers.SG_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Eslovênia</Th>
                      <Td>
                        {data.providers && data.providers.SI_rent
                          ? data.providers.SI_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Eslováquia</Th>
                      <Td>
                        {data.providers && data.providers.SK_rent
                          ? data.providers.SK_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>El Salvador</Th>
                      <Td>
                        {data.providers && data.providers.SV_rent
                          ? data.providers.SV_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Chade</Th>
                      <Td>
                        {data.providers && data.providers.TD_rent
                          ? data.providers.TD_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Tailândia</Th>
                      <Td>
                        {data.providers && data.providers.TH_rent
                          ? data.providers.TH_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Tunísia</Th>
                      <Td>
                        {data.providers && data.providers.TN_rent
                          ? data.providers.TN_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Turquia</Th>
                      <Td>
                        {data.providers && data.providers.TR_rent
                          ? data.providers.TR_rent
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Tanzânia</Th>
                      <Td>
                        {data.providers && data.providers.TZ_rent
                          ? data.providers.TZ_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Ucrânia</Th>
                      <Td>
                        {data.providers && data.providers.UA_rent
                          ? data.providers.UA_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Uganda</Th>
                      <Td>
                        {data.providers && data.providers.UG_rent
                          ? data.providers.UG_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Estados Unidos</Th>
                      <Td>
                        {data.providers && data.providers.US_rent
                          ? data.providers.US_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Uruguai</Th>
                      <Td>
                        {data.providers && data.providers.UY_rent_rent
                          ? data.providers.UY_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Venezuela</Th>
                      <Td>
                        {data.providers && data.providers.VE_rent
                          ? data.providers.VE_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Iêmen</Th>
                      <Td>
                        {data.providers && data.providers.YE_rent
                          ? data.providers.YE_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>África do Sul</Th>
                      <Td>
                        {data.providers && data.providers.ZA_rent
                          ? data.providers.ZA_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Zâmbia</Th>
                      <Td>
                        {data.providers && data.providers.ZM_rent
                          ? data.providers.ZM_rent
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Zimbábue</Th>
                      <Td>
                        {data.providers && data.providers.ZW_rent
                          ? data.providers.ZW_rent
                          : ""}
                      </Td>
                    </Tr>
                  </Tbody>
                  <Thead />
                </Table>
              </TableContainer>
            )}
            {exibirTabelaBuy && (
              <TableContainer>
                <Table size="sm">
                  <Tbody>
                    <Tr>
                      <Th>Andorra</Th>
                      <Td>
                        {data.providers && data.providers.AD_buy
                          ? data.providers.AD_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Emirados Árabes Unidos</Th>
                      <Td>
                        {data.providers && data.providers.AE_buy
                          ? data.providers.AE_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Albânia</Th>
                      <Td>
                        {data.providers && data.providers.AL_buy
                          ? data.providers.AL_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Angola</Th>
                      <Td>
                        {data.providers && data.providers.AO_buy
                          ? data.providers.AO_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Argentina</Th>
                      <Td>
                        {data.providers && data.providers.AR_buy
                          ? data.providers.AR_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Áustria</Th>
                      <Td>
                        {data.providers && data.providers.AT_buy
                          ? data.providers.AT_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Austrália</Th>
                      <Td>
                        {data.providers && data.providers.AU_buy
                          ? data.providers.AU_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bósnia e Herzegovina</Th>
                      <Td>
                        {data.providers && data.providers.BA
                          ? data.providers.BA
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bélgica</Th>
                      <Td>
                        {data.providers && data.providers.BE_buy
                          ? data.providers.BE_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Burkina Faso</Th>
                      <Td>
                        {data.providers && data.providers.BF_buy
                          ? data.providers.BF_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bulgária</Th>
                      <Td>
                        {data.providers && data.providers.BG_buy
                          ? data.providers.BG_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bahrein</Th>
                      <Td>
                        {data.providers && data.providers.BH_buy
                          ? data.providers.BH_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bolívia</Th>
                      <Td>
                        {data.providers && data.providers.BO_buy
                          ? data.providers.BO_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Brasil</Th>
                      <Td>
                        {data.providers && data.providers.BR_buy
                          ? data.providers.BR_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Belize</Th>
                      <Td>
                        {data.providers && data.providers.BZ_buy
                          ? data.providers.BZ_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Canadá</Th>
                      <Td>
                        {data.providers && data.providers.CA_buy
                          ? data.providers.CA_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Democrática do Congo</Th>
                      <Td>
                        {data.providers && data.providers.CD_buy
                          ? data.providers.CD_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Suíça</Th>
                      <Td>
                        {data.providers && data.providers.CH_buy
                          ? data.providers.CH_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Costa do Marfim</Th>
                      <Td>
                        {data.providers && data.providers.CI_buy
                          ? data.providers.CI_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Chile</Th>
                      <Td>
                        {data.providers && data.providers.CL_buy
                          ? data.providers.CL_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Camarões</Th>
                      <Td>
                        {data.providers && data.providers.CM_buy
                          ? data.providers.CM_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Colômbia</Th>
                      <Td>
                        {data.providers && data.providers.CO_buy
                          ? data.providers.CO_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Costa Rica</Th>
                      <Td>
                        {data.providers && data.providers.CR_buy
                          ? data.providers.CR_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Cabo Verde</Th>
                      <Td>
                        {data.providers && data.providers.CV_buy
                          ? data.providers.CV_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Cuba</Th>
                      <Td>
                        {data.providers && data.providers.CU_buy
                          ? data.providers.CU_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Tcheca</Th>
                      <Td>
                        {data.providers && data.providers.CZ_buy
                          ? data.providers.CZ_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Alemanha</Th>
                      <Td>
                        {data.providers && data.providers.DE_buy
                          ? data.providers.DE_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Dinamarca</Th>
                      <Td>
                        {data.providers && data.providers.DK_buy
                          ? data.providers.DK_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Dominicana</Th>
                      <Td>
                        {data.providers && data.providers.DO_buy
                          ? data.providers.DO_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Argélia</Th>
                      <Td>
                        {data.providers && data.providers.DZ_buy
                          ? data.providers.DZ_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Equador</Th>
                      <Td>
                        {data.providers && data.providers.EC_buy
                          ? data.providers.EC_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Estônia</Th>
                      <Td>
                        {data.providers && data.providers.EE_buy
                          ? data.providers.EE_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Egito</Th>
                      <Td>
                        {data.providers && data.providers.EG_buy
                          ? data.providers.EG_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Espanha</Th>
                      <Td>
                        {data.providers && data.providers.ES_buy
                          ? data.providers.ES_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Finlândia</Th>
                      <Td>
                        {data.providers && data.providers.FI_buy
                          ? data.providers.FI_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>França</Th>
                      <Td>
                        {data.providers && data.providers.FR_buy
                          ? data.providers.FR_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Reino Unido</Th>
                      <Td>
                        {data.providers && data.providers.GB_buy
                          ? data.providers.GB_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Guernsey</Th>
                      <Td>
                        {data.providers && data.providers.GG_buy
                          ? data.providers.GG_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Gana</Th>
                      <Td>
                        {data.providers && data.providers.GH_buy
                          ? data.providers.GH_buy
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Gibraltar</Th>
                      <Td>
                        {data.providers && data.providers.GI_buy
                          ? data.providers.GI
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Guatemala</Th>
                      <Td>
                        {data.providers && data.providers.GT_buy
                          ? data.providers.GT_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Honduras</Th>
                      <Td>
                        {data.providers && data.providers.HN_buy
                          ? data.providers.HN_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Croácia</Th>
                      <Td>
                        {data.providers && data.providers.HR_buy
                          ? data.providers.HR_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Hungria</Th>
                      <Td>
                        {data.providers && data.providers.HU_buy
                          ? data.providers.HU_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Indonésia</Th>
                      <Td>
                        {data.providers && data.providers.ID_buy
                          ? data.providers.ID_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Irlanda</Th>
                      <Td>
                        {data.providers && data.providers.IE_buy
                          ? data.providers.IE_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Israel</Th>
                      <Td>
                        {data.providers && data.providers.IL_buy
                          ? data.providers.IL_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Índia</Th>
                      <Td>
                        {data.providers && data.providers.IN_buy
                          ? data.providers.IN_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Iraque</Th>
                      <Td>
                        {data.providers && data.providers.IQ_buy
                          ? data.providers.IQ_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Itália</Th>
                      <Td>
                        {data.providers && data.providers.IT_buy
                          ? data.providers.IT_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Jordânia</Th>
                      <Td>
                        {data.providers && data.providers.JO_buy
                          ? data.providers.JO_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Japão</Th>
                      <Td>
                        {data.providers && data.providers.JP_buy
                          ? data.providers.JP_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Quênia</Th>
                      <Td>
                        {data.providers && data.providers.KE_buy
                          ? data.providers.KE_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Coreia do Sul</Th>
                      <Td>
                        {data.providers && data.providers.KR_buy
                          ? data.providers.KR_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Kuwait</Th>
                      <Td>
                        {data.providers && data.providers.KW_buy
                          ? data.providers.KW_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Líbano</Th>
                      <Td>
                        {data.providers && data.providers.LB_buy
                          ? data.providers.LB_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Lituânia</Th>
                      <Td>
                        {data.providers && data.providers.LT_buy
                          ? data.providers.LT_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Luxemburgo</Th>
                      <Td>
                        {data.providers && data.providers.LU_buy
                          ? data.providers.LU_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Letônia</Th>
                      <Td>
                        {data.providers && data.providers.LV
                          ? data.providers.LV
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Líbia</Th>
                      <Td>
                        {data.providers && data.providers.LY_buy
                          ? data.providers.LY_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Marrocos</Th>
                      <Td>
                        {data.providers && data.providers.MA_buy
                          ? data.providers.MA_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Madagascar</Th>
                      <Td>
                        {data.providers && data.providers.MG_buy
                          ? data.providers.MG_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Macedônia do Norte</Th>
                      <Td>
                        {data.providers && data.providers.MK_buy
                          ? data.providers.MK_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Mali</Th>
                      <Td>
                        {data.providers && data.providers.ML_buy
                          ? data.providers.ML_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Maurício</Th>
                      <Td>
                        {data.providers && data.providers.MU_buy
                          ? data.providers.MU_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Malawi</Th>
                      <Td>
                        {data.providers && data.providers.MW_buy
                          ? data.providers.MW_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>México</Th>
                      <Td>
                        {data.providers && data.providers.MX_buy
                          ? data.providers.MX_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Malásia</Th>
                      <Td>
                        {data.providers && data.providers.MY_buy
                          ? data.providers.MY_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Moçambique</Th>
                      <Td>
                        {data.providers && data.providers.MZ_buy
                          ? data.providers.MZ_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Níger</Th>
                      <Td>
                        {data.providers && data.providers.NE_buy
                          ? data.providers.NE_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nigéria</Th>
                      <Td>
                        {data.providers && data.providers.NG_buy
                          ? data.providers.NG_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nicarágua</Th>
                      <Td>
                        {data.providers && data.providers.NI_buy
                          ? data.providers.NI_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Holanda</Th>
                      <Td>
                        {data.providers && data.providers.NL_buy
                          ? data.providers.NL_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Noruega</Th>
                      <Td>
                        {data.providers && data.providers.NO_buy
                          ? data.providers.NO_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nova Zelândia</Th>
                      <Td>
                        {data.providers && data.providers.NZ_buy
                          ? data.providers.NZ_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Omã</Th>
                      <Td>
                        {data.providers && data.providers.OM_buy
                          ? data.providers.OM_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Panamá</Th>
                      <Td>
                        {data.providers && data.providers.PA_buy
                          ? data.providers.PA_buy
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Peru</Th>
                      <Td>
                        {data.providers && data.providers.PE_buy
                          ? data.providers.PE_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Filipinas</Th>
                      <Td>
                        {data.providers && data.providers.PH_buy
                          ? data.providers.PH_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Polônia</Th>
                      <Td>
                        {data.providers && data.providers.PL_buy
                          ? data.providers.PL_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Portugal</Th>
                      <Td>
                        {data.providers && data.providers.PT_buy
                          ? data.providers.PT_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Paraguai</Th>
                      <Td>
                        {data.providers && data.providers.PY_buy
                          ? data.providers.PY_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Catar</Th>
                      <Td>
                        {data.providers && data.providers.QA_buy
                          ? data.providers.QA_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Romênia</Th>
                      <Td>
                        {data.providers && data.providers.RO_buy
                          ? data.providers.RO_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Sérvia</Th>
                      <Td>
                        {data.providers && data.providers.RS_buy
                          ? data.providers.RS_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Rússia</Th>
                      <Td>
                        {data.providers && data.providers.RU_buy
                          ? data.providers.RU_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Arábia Saudita</Th>
                      <Td>
                        {data.providers && data.providers.SA_buy
                          ? data.providers.SA_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Suécia</Th>
                      <Td>
                        {data.providers && data.providers.SE_buy
                          ? data.providers.SE_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Singapura</Th>
                      <Td>
                        {data.providers && data.providers.SG_buy
                          ? data.providers.SG_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Eslovênia</Th>
                      <Td>
                        {data.providers && data.providers.SI_buy
                          ? data.providers.SI_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Eslováquia</Th>
                      <Td>
                        {data.providers && data.providers.SK_buy
                          ? data.providers.SK_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>El Salvador</Th>
                      <Td>
                        {data.providers && data.providers.SV_buy
                          ? data.providers.SV_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Chade</Th>
                      <Td>
                        {data.providers && data.providers.TD_buy
                          ? data.providers.TD_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Tailândia</Th>
                      <Td>
                        {data.providers && data.providers.TH_buy
                          ? data.providers.TH_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Tunísia</Th>
                      <Td>
                        {data.providers && data.providers.TN_buy
                          ? data.providers.TN_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Turquia</Th>
                      <Td>
                        {data.providers && data.providers.TR_buy
                          ? data.providers.TR_buy
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Tanzânia</Th>
                      <Td>
                        {data.providers && data.providers.TZ_buy
                          ? data.providers.TZ_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Ucrânia</Th>
                      <Td>
                        {data.providers && data.providers.UA_buy
                          ? data.providers.UA_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Uganda</Th>
                      <Td>
                        {data.providers && data.providers.UG_buy
                          ? data.providers.UG_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Estados Unidos</Th>
                      <Td>
                        {data.providers && data.providers.US_buy
                          ? data.providers.US_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Uruguai</Th>
                      <Td>
                        {data.providers && data.providers.UY_buy_buy
                          ? data.providers.UY_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Venezuela</Th>
                      <Td>
                        {data.providers && data.providers.VE_buy
                          ? data.providers.VE_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Iêmen</Th>
                      <Td>
                        {data.providers && data.providers.YE_buy
                          ? data.providers.YE_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>África do Sul</Th>
                      <Td>
                        {data.providers && data.providers.ZA_buy
                          ? data.providers.ZA_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Zâmbia</Th>
                      <Td>
                        {data.providers && data.providers.ZM_buy
                          ? data.providers.ZM_buy
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Zimbábue</Th>
                      <Td>
                        {data.providers && data.providers.ZW_buy
                          ? data.providers.ZW_buy
                          : ""}
                      </Td>
                    </Tr>
                  </Tbody>
                  <Thead />
                </Table>
              </TableContainer>
            )}
            {exibirTabelaAds && (
              <TableContainer>
                <Table size="sm">
                  <Tbody>
                    <Tr>
                      <Th>Andorra</Th>
                      <Td>
                        {data.providers && data.providers.AD_ads
                          ? data.providers.AD_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Emirados Árabes Unidos</Th>
                      <Td>
                        {data.providers && data.providers.AE_ads
                          ? data.providers.AE_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Albânia</Th>
                      <Td>
                        {data.providers && data.providers.AL_ads
                          ? data.providers.AL_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Angola</Th>
                      <Td>
                        {data.providers && data.providers.AO_ads
                          ? data.providers.AO_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Argentina</Th>
                      <Td>
                        {data.providers && data.providers.AR_ads
                          ? data.providers.AR_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Áustria</Th>
                      <Td>
                        {data.providers && data.providers.AT_ads
                          ? data.providers.AT_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Austrália</Th>
                      <Td>
                        {data.providers && data.providers.AU_ads
                          ? data.providers.AU_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bósnia e Herzegovina</Th>
                      <Td>
                        {data.providers && data.providers.BA
                          ? data.providers.BA
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bélgica</Th>
                      <Td>
                        {data.providers && data.providers.BE_ads
                          ? data.providers.BE_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Burkina Faso</Th>
                      <Td>
                        {data.providers && data.providers.BF_ads
                          ? data.providers.BF_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bulgária</Th>
                      <Td>
                        {data.providers && data.providers.BG_ads
                          ? data.providers.BG_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bahrein</Th>
                      <Td>
                        {data.providers && data.providers.BH_ads
                          ? data.providers.BH_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bolívia</Th>
                      <Td>
                        {data.providers && data.providers.BO_ads
                          ? data.providers.BO_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Brasil</Th>
                      <Td>
                        {data.providers && data.providers.BR_ads
                          ? data.providers.BR_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Belize</Th>
                      <Td>
                        {data.providers && data.providers.BZ_ads
                          ? data.providers.BZ_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Canadá</Th>
                      <Td>
                        {data.providers && data.providers.CA_ads
                          ? data.providers.CA_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Democrática do Congo</Th>
                      <Td>
                        {data.providers && data.providers.CD_ads
                          ? data.providers.CD_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Suíça</Th>
                      <Td>
                        {data.providers && data.providers.CH_ads
                          ? data.providers.CH_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Costa do Marfim</Th>
                      <Td>
                        {data.providers && data.providers.CI_ads
                          ? data.providers.CI_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Chile</Th>
                      <Td>
                        {data.providers && data.providers.CL_ads
                          ? data.providers.CL_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Camarões</Th>
                      <Td>
                        {data.providers && data.providers.CM_ads
                          ? data.providers.CM_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Colômbia</Th>
                      <Td>
                        {data.providers && data.providers.CO_ads
                          ? data.providers.CO_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Costa Rica</Th>
                      <Td>
                        {data.providers && data.providers.CR_ads
                          ? data.providers.CR_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Cabo Verde</Th>
                      <Td>
                        {data.providers && data.providers.CV_ads
                          ? data.providers.CV_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Cuba</Th>
                      <Td>
                        {data.providers && data.providers.CU_ads
                          ? data.providers.CU_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Tcheca</Th>
                      <Td>
                        {data.providers && data.providers.CZ_ads
                          ? data.providers.CZ_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Alemanha</Th>
                      <Td>
                        {data.providers && data.providers.DE_ads
                          ? data.providers.DE_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Dinamarca</Th>
                      <Td>
                        {data.providers && data.providers.DK_ads
                          ? data.providers.DK_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Dominicana</Th>
                      <Td>
                        {data.providers && data.providers.DO_ads
                          ? data.providers.DO_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Argélia</Th>
                      <Td>
                        {data.providers && data.providers.DZ_ads
                          ? data.providers.DZ_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Equador</Th>
                      <Td>
                        {data.providers && data.providers.EC_ads
                          ? data.providers.EC_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Estônia</Th>
                      <Td>
                        {data.providers && data.providers.EE_ads
                          ? data.providers.EE_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Egito</Th>
                      <Td>
                        {data.providers && data.providers.EG_ads
                          ? data.providers.EG_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Espanha</Th>
                      <Td>
                        {data.providers && data.providers.ES_ads
                          ? data.providers.ES_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Finlândia</Th>
                      <Td>
                        {data.providers && data.providers.FI_ads
                          ? data.providers.FI_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>França</Th>
                      <Td>
                        {data.providers && data.providers.FR_ads
                          ? data.providers.FR_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Reino Unido</Th>
                      <Td>
                        {data.providers && data.providers.GB_ads
                          ? data.providers.GB_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Guernsey</Th>
                      <Td>
                        {data.providers && data.providers.GG_ads
                          ? data.providers.GG_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Gana</Th>
                      <Td>
                        {data.providers && data.providers.GH_ads
                          ? data.providers.GH_ads
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Gibraltar</Th>
                      <Td>
                        {data.providers && data.providers.GI_ads
                          ? data.providers.GI
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Guatemala</Th>
                      <Td>
                        {data.providers && data.providers.GT_ads
                          ? data.providers.GT_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Honduras</Th>
                      <Td>
                        {data.providers && data.providers.HN_ads
                          ? data.providers.HN_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Croácia</Th>
                      <Td>
                        {data.providers && data.providers.HR_ads
                          ? data.providers.HR_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Hungria</Th>
                      <Td>
                        {data.providers && data.providers.HU_ads
                          ? data.providers.HU_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Indonésia</Th>
                      <Td>
                        {data.providers && data.providers.ID_ads
                          ? data.providers.ID_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Irlanda</Th>
                      <Td>
                        {data.providers && data.providers.IE_ads
                          ? data.providers.IE_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Israel</Th>
                      <Td>
                        {data.providers && data.providers.IL_ads
                          ? data.providers.IL_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Índia</Th>
                      <Td>
                        {data.providers && data.providers.IN_ads
                          ? data.providers.IN_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Iraque</Th>
                      <Td>
                        {data.providers && data.providers.IQ_ads
                          ? data.providers.IQ_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Itália</Th>
                      <Td>
                        {data.providers && data.providers.IT_ads
                          ? data.providers.IT_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Jordânia</Th>
                      <Td>
                        {data.providers && data.providers.JO_ads
                          ? data.providers.JO_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Japão</Th>
                      <Td>
                        {data.providers && data.providers.JP_ads
                          ? data.providers.JP_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Quênia</Th>
                      <Td>
                        {data.providers && data.providers.KE_ads
                          ? data.providers.KE_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Coreia do Sul</Th>
                      <Td>
                        {data.providers && data.providers.KR_ads
                          ? data.providers.KR_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Kuwait</Th>
                      <Td>
                        {data.providers && data.providers.KW_ads
                          ? data.providers.KW_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Líbano</Th>
                      <Td>
                        {data.providers && data.providers.LB_ads
                          ? data.providers.LB_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Lituânia</Th>
                      <Td>
                        {data.providers && data.providers.LT_ads
                          ? data.providers.LT_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Luxemburgo</Th>
                      <Td>
                        {data.providers && data.providers.LU_ads
                          ? data.providers.LU_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Letônia</Th>
                      <Td>
                        {data.providers && data.providers.LV
                          ? data.providers.LV
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Líbia</Th>
                      <Td>
                        {data.providers && data.providers.LY_ads
                          ? data.providers.LY_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Marrocos</Th>
                      <Td>
                        {data.providers && data.providers.MA_ads
                          ? data.providers.MA_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Madagascar</Th>
                      <Td>
                        {data.providers && data.providers.MG_ads
                          ? data.providers.MG_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Macedônia do Norte</Th>
                      <Td>
                        {data.providers && data.providers.MK_ads
                          ? data.providers.MK_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Mali</Th>
                      <Td>
                        {data.providers && data.providers.ML_ads
                          ? data.providers.ML_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Maurício</Th>
                      <Td>
                        {data.providers && data.providers.MU_ads
                          ? data.providers.MU_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Malawi</Th>
                      <Td>
                        {data.providers && data.providers.MW_ads
                          ? data.providers.MW_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>México</Th>
                      <Td>
                        {data.providers && data.providers.MX_ads
                          ? data.providers.MX_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Malásia</Th>
                      <Td>
                        {data.providers && data.providers.MY_ads
                          ? data.providers.MY_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Moçambique</Th>
                      <Td>
                        {data.providers && data.providers.MZ_ads
                          ? data.providers.MZ_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Níger</Th>
                      <Td>
                        {data.providers && data.providers.NE_ads
                          ? data.providers.NE_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nigéria</Th>
                      <Td>
                        {data.providers && data.providers.NG_ads
                          ? data.providers.NG_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nicarágua</Th>
                      <Td>
                        {data.providers && data.providers.NI_ads
                          ? data.providers.NI_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Holanda</Th>
                      <Td>
                        {data.providers && data.providers.NL_ads
                          ? data.providers.NL_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Noruega</Th>
                      <Td>
                        {data.providers && data.providers.NO_ads
                          ? data.providers.NO_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nova Zelândia</Th>
                      <Td>
                        {data.providers && data.providers.NZ_ads
                          ? data.providers.NZ_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Omã</Th>
                      <Td>
                        {data.providers && data.providers.OM_ads
                          ? data.providers.OM_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Panamá</Th>
                      <Td>
                        {data.providers && data.providers.PA_ads
                          ? data.providers.PA_ads
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Peru</Th>
                      <Td>
                        {data.providers && data.providers.PE_ads
                          ? data.providers.PE_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Filipinas</Th>
                      <Td>
                        {data.providers && data.providers.PH_ads
                          ? data.providers.PH_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Polônia</Th>
                      <Td>
                        {data.providers && data.providers.PL_ads
                          ? data.providers.PL_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Portugal</Th>
                      <Td>
                        {data.providers && data.providers.PT_ads
                          ? data.providers.PT_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Paraguai</Th>
                      <Td>
                        {data.providers && data.providers.PY_ads
                          ? data.providers.PY_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Catar</Th>
                      <Td>
                        {data.providers && data.providers.QA_ads
                          ? data.providers.QA_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Romênia</Th>
                      <Td>
                        {data.providers && data.providers.RO_ads
                          ? data.providers.RO_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Sérvia</Th>
                      <Td>
                        {data.providers && data.providers.RS_ads
                          ? data.providers.RS_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Rússia</Th>
                      <Td>
                        {data.providers && data.providers.RU_ads
                          ? data.providers.RU_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Arábia Saudita</Th>
                      <Td>
                        {data.providers && data.providers.SA_ads
                          ? data.providers.SA_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Suécia</Th>
                      <Td>
                        {data.providers && data.providers.SE_ads
                          ? data.providers.SE_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Singapura</Th>
                      <Td>
                        {data.providers && data.providers.SG_ads
                          ? data.providers.SG_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Eslovênia</Th>
                      <Td>
                        {data.providers && data.providers.SI_ads
                          ? data.providers.SI_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Eslováquia</Th>
                      <Td>
                        {data.providers && data.providers.SK_ads
                          ? data.providers.SK_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>El Salvador</Th>
                      <Td>
                        {data.providers && data.providers.SV_ads
                          ? data.providers.SV_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Chade</Th>
                      <Td>
                        {data.providers && data.providers.TD_ads
                          ? data.providers.TD_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Tailândia</Th>
                      <Td>
                        {data.providers && data.providers.TH_ads
                          ? data.providers.TH_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Tunísia</Th>
                      <Td>
                        {data.providers && data.providers.TN_ads
                          ? data.providers.TN_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Turquia</Th>
                      <Td>
                        {data.providers && data.providers.TR_ads
                          ? data.providers.TR_ads
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Tanzânia</Th>
                      <Td>
                        {data.providers && data.providers.TZ_ads
                          ? data.providers.TZ_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Ucrânia</Th>
                      <Td>
                        {data.providers && data.providers.UA_ads
                          ? data.providers.UA_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Uganda</Th>
                      <Td>
                        {data.providers && data.providers.UG_ads
                          ? data.providers.UG_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Estados Unidos</Th>
                      <Td>
                        {data.providers && data.providers.US_ads
                          ? data.providers.US_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Uruguai</Th>
                      <Td>
                        {data.providers && data.providers.UY_ads_ads
                          ? data.providers.UY_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Venezuela</Th>
                      <Td>
                        {data.providers && data.providers.VE_ads
                          ? data.providers.VE_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Iêmen</Th>
                      <Td>
                        {data.providers && data.providers.YE_ads
                          ? data.providers.YE_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>África do Sul</Th>
                      <Td>
                        {data.providers && data.providers.ZA_ads
                          ? data.providers.ZA_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Zâmbia</Th>
                      <Td>
                        {data.providers && data.providers.ZM_ads
                          ? data.providers.ZM_ads
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Zimbábue</Th>
                      <Td>
                        {data.providers && data.providers.ZW_ads
                          ? data.providers.ZW_ads
                          : ""}
                      </Td>
                    </Tr>
                  </Tbody>
                  <Thead />
                </Table>
              </TableContainer>
            )}
            {exibirTabelaFree && (
              <TableContainer>
                <Table size="sm">
                  <Tbody>
                    <Tr>
                      <Th>Andorra</Th>
                      <Td>
                        {data.providers && data.providers.AD_free
                          ? data.providers.AD_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Emirados Árabes Unidos</Th>
                      <Td>
                        {data.providers && data.providers.AE_free
                          ? data.providers.AE_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Albânia</Th>
                      <Td>
                        {data.providers && data.providers.AL_free
                          ? data.providers.AL_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Angola</Th>
                      <Td>
                        {data.providers && data.providers.AO_free
                          ? data.providers.AO_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Argentina</Th>
                      <Td>
                        {data.providers && data.providers.AR_free
                          ? data.providers.AR_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Áustria</Th>
                      <Td>
                        {data.providers && data.providers.AT_free
                          ? data.providers.AT_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Austrália</Th>
                      <Td>
                        {data.providers && data.providers.AU_free
                          ? data.providers.AU_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bósnia e Herzegovina</Th>
                      <Td>
                        {data.providers && data.providers.BA
                          ? data.providers.BA
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bélgica</Th>
                      <Td>
                        {data.providers && data.providers.BE_free
                          ? data.providers.BE_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Burkina Faso</Th>
                      <Td>
                        {data.providers && data.providers.BF_free
                          ? data.providers.BF_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bulgária</Th>
                      <Td>
                        {data.providers && data.providers.BG_free
                          ? data.providers.BG_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bahrein</Th>
                      <Td>
                        {data.providers && data.providers.BH_free
                          ? data.providers.BH_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Bolívia</Th>
                      <Td>
                        {data.providers && data.providers.BO_free
                          ? data.providers.BO_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Brasil</Th>
                      <Td>
                        {data.providers && data.providers.BR_free
                          ? data.providers.BR_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Belize</Th>
                      <Td>
                        {data.providers && data.providers.BZ_free
                          ? data.providers.BZ_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Canadá</Th>
                      <Td>
                        {data.providers && data.providers.CA_free
                          ? data.providers.CA_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Democrática do Congo</Th>
                      <Td>
                        {data.providers && data.providers.CD_free
                          ? data.providers.CD_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Suíça</Th>
                      <Td>
                        {data.providers && data.providers.CH_free
                          ? data.providers.CH_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Costa do Marfim</Th>
                      <Td>
                        {data.providers && data.providers.CI_free
                          ? data.providers.CI_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Chile</Th>
                      <Td>
                        {data.providers && data.providers.CL_free
                          ? data.providers.CL_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Camarões</Th>
                      <Td>
                        {data.providers && data.providers.CM_free
                          ? data.providers.CM_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Colômbia</Th>
                      <Td>
                        {data.providers && data.providers.CO_free
                          ? data.providers.CO_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Costa Rica</Th>
                      <Td>
                        {data.providers && data.providers.CR_free
                          ? data.providers.CR_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Cabo Verde</Th>
                      <Td>
                        {data.providers && data.providers.CV_free
                          ? data.providers.CV_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Cuba</Th>
                      <Td>
                        {data.providers && data.providers.CU_free
                          ? data.providers.CU_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Tcheca</Th>
                      <Td>
                        {data.providers && data.providers.CZ_free
                          ? data.providers.CZ_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Alemanha</Th>
                      <Td>
                        {data.providers && data.providers.DE_free
                          ? data.providers.DE_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Dinamarca</Th>
                      <Td>
                        {data.providers && data.providers.DK_free
                          ? data.providers.DK_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>República Dominicana</Th>
                      <Td>
                        {data.providers && data.providers.DO_free
                          ? data.providers.DO_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Argélia</Th>
                      <Td>
                        {data.providers && data.providers.DZ_free
                          ? data.providers.DZ_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Equador</Th>
                      <Td>
                        {data.providers && data.providers.EC_free
                          ? data.providers.EC_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Estônia</Th>
                      <Td>
                        {data.providers && data.providers.EE_free
                          ? data.providers.EE_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Egito</Th>
                      <Td>
                        {data.providers && data.providers.EG_free
                          ? data.providers.EG_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Espanha</Th>
                      <Td>
                        {data.providers && data.providers.ES_free
                          ? data.providers.ES_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Finlândia</Th>
                      <Td>
                        {data.providers && data.providers.FI_free
                          ? data.providers.FI_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>França</Th>
                      <Td>
                        {data.providers && data.providers.FR_free
                          ? data.providers.FR_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Reino Unido</Th>
                      <Td>
                        {data.providers && data.providers.GB_free
                          ? data.providers.GB_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Guernsey</Th>
                      <Td>
                        {data.providers && data.providers.GG_free
                          ? data.providers.GG_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Gana</Th>
                      <Td>
                        {data.providers && data.providers.GH_free
                          ? data.providers.GH_free
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Gibraltar</Th>
                      <Td>
                        {data.providers && data.providers.GI_free
                          ? data.providers.GI
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Guatemala</Th>
                      <Td>
                        {data.providers && data.providers.GT_free
                          ? data.providers.GT_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Honduras</Th>
                      <Td>
                        {data.providers && data.providers.HN_free
                          ? data.providers.HN_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Croácia</Th>
                      <Td>
                        {data.providers && data.providers.HR_free
                          ? data.providers.HR_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Hungria</Th>
                      <Td>
                        {data.providers && data.providers.HU_free
                          ? data.providers.HU_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Indonésia</Th>
                      <Td>
                        {data.providers && data.providers.ID_free
                          ? data.providers.ID_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Irlanda</Th>
                      <Td>
                        {data.providers && data.providers.IE_free
                          ? data.providers.IE_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Israel</Th>
                      <Td>
                        {data.providers && data.providers.IL_free
                          ? data.providers.IL_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Índia</Th>
                      <Td>
                        {data.providers && data.providers.IN_free
                          ? data.providers.IN_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Iraque</Th>
                      <Td>
                        {data.providers && data.providers.IQ_free
                          ? data.providers.IQ_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Itália</Th>
                      <Td>
                        {data.providers && data.providers.IT_free
                          ? data.providers.IT_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Jordânia</Th>
                      <Td>
                        {data.providers && data.providers.JO_free
                          ? data.providers.JO_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Japão</Th>
                      <Td>
                        {data.providers && data.providers.JP_free
                          ? data.providers.JP_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Quênia</Th>
                      <Td>
                        {data.providers && data.providers.KE_free
                          ? data.providers.KE_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Coreia do Sul</Th>
                      <Td>
                        {data.providers && data.providers.KR_free
                          ? data.providers.KR_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Kuwait</Th>
                      <Td>
                        {data.providers && data.providers.KW_free
                          ? data.providers.KW_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Líbano</Th>
                      <Td>
                        {data.providers && data.providers.LB_free
                          ? data.providers.LB_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Lituânia</Th>
                      <Td>
                        {data.providers && data.providers.LT_free
                          ? data.providers.LT_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Luxemburgo</Th>
                      <Td>
                        {data.providers && data.providers.LU_free
                          ? data.providers.LU_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Letônia</Th>
                      <Td>
                        {data.providers && data.providers.LV
                          ? data.providers.LV
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Líbia</Th>
                      <Td>
                        {data.providers && data.providers.LY_free
                          ? data.providers.LY_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Marrocos</Th>
                      <Td>
                        {data.providers && data.providers.MA_free
                          ? data.providers.MA_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Madagascar</Th>
                      <Td>
                        {data.providers && data.providers.MG_free
                          ? data.providers.MG_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Macedônia do Norte</Th>
                      <Td>
                        {data.providers && data.providers.MK_free
                          ? data.providers.MK_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Mali</Th>
                      <Td>
                        {data.providers && data.providers.ML_free
                          ? data.providers.ML_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Maurício</Th>
                      <Td>
                        {data.providers && data.providers.MU_free
                          ? data.providers.MU_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Malawi</Th>
                      <Td>
                        {data.providers && data.providers.MW_free
                          ? data.providers.MW_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>México</Th>
                      <Td>
                        {data.providers && data.providers.MX_free
                          ? data.providers.MX_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Malásia</Th>
                      <Td>
                        {data.providers && data.providers.MY_free
                          ? data.providers.MY_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Moçambique</Th>
                      <Td>
                        {data.providers && data.providers.MZ_free
                          ? data.providers.MZ_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Níger</Th>
                      <Td>
                        {data.providers && data.providers.NE_free
                          ? data.providers.NE_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nigéria</Th>
                      <Td>
                        {data.providers && data.providers.NG_free
                          ? data.providers.NG_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nicarágua</Th>
                      <Td>
                        {data.providers && data.providers.NI_free
                          ? data.providers.NI_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Holanda</Th>
                      <Td>
                        {data.providers && data.providers.NL_free
                          ? data.providers.NL_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Noruega</Th>
                      <Td>
                        {data.providers && data.providers.NO_free
                          ? data.providers.NO_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Nova Zelândia</Th>
                      <Td>
                        {data.providers && data.providers.NZ_free
                          ? data.providers.NZ_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Omã</Th>
                      <Td>
                        {data.providers && data.providers.OM_free
                          ? data.providers.OM_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Panamá</Th>
                      <Td>
                        {data.providers && data.providers.PA_free
                          ? data.providers.PA_free
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Peru</Th>
                      <Td>
                        {data.providers && data.providers.PE_free
                          ? data.providers.PE_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Filipinas</Th>
                      <Td>
                        {data.providers && data.providers.PH_free
                          ? data.providers.PH_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Polônia</Th>
                      <Td>
                        {data.providers && data.providers.PL_free
                          ? data.providers.PL_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Portugal</Th>
                      <Td>
                        {data.providers && data.providers.PT_free
                          ? data.providers.PT_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Paraguai</Th>
                      <Td>
                        {data.providers && data.providers.PY_free
                          ? data.providers.PY_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Catar</Th>
                      <Td>
                        {data.providers && data.providers.QA_free
                          ? data.providers.QA_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Romênia</Th>
                      <Td>
                        {data.providers && data.providers.RO_free
                          ? data.providers.RO_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Sérvia</Th>
                      <Td>
                        {data.providers && data.providers.RS_free
                          ? data.providers.RS_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Rússia</Th>
                      <Td>
                        {data.providers && data.providers.RU_free
                          ? data.providers.RU_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Arábia Saudita</Th>
                      <Td>
                        {data.providers && data.providers.SA_free
                          ? data.providers.SA_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Suécia</Th>
                      <Td>
                        {data.providers && data.providers.SE_free
                          ? data.providers.SE_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Singapura</Th>
                      <Td>
                        {data.providers && data.providers.SG_free
                          ? data.providers.SG_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Eslovênia</Th>
                      <Td>
                        {data.providers && data.providers.SI_free
                          ? data.providers.SI_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Eslováquia</Th>
                      <Td>
                        {data.providers && data.providers.SK_free
                          ? data.providers.SK_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>El Salvador</Th>
                      <Td>
                        {data.providers && data.providers.SV_free
                          ? data.providers.SV_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Chade</Th>
                      <Td>
                        {data.providers && data.providers.TD_free
                          ? data.providers.TD_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Tailândia</Th>
                      <Td>
                        {data.providers && data.providers.TH_free
                          ? data.providers.TH_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Tunísia</Th>
                      <Td>
                        {data.providers && data.providers.TN_free
                          ? data.providers.TN_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Turquia</Th>
                      <Td>
                        {data.providers && data.providers.TR_free
                          ? data.providers.TR_free
                          : ""}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Tanzânia</Th>
                      <Td>
                        {data.providers && data.providers.TZ_free
                          ? data.providers.TZ_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Ucrânia</Th>
                      <Td>
                        {data.providers && data.providers.UA_free
                          ? data.providers.UA_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Uganda</Th>
                      <Td>
                        {data.providers && data.providers.UG_free
                          ? data.providers.UG_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Estados Unidos</Th>
                      <Td>
                        {data.providers && data.providers.US_free
                          ? data.providers.US_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Uruguai</Th>
                      <Td>
                        {data.providers && data.providers.UY_free_free
                          ? data.providers.UY_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Venezuela</Th>
                      <Td>
                        {data.providers && data.providers.VE_free
                          ? data.providers.VE_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Iêmen</Th>
                      <Td>
                        {data.providers && data.providers.YE_free
                          ? data.providers.YE_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>África do Sul</Th>
                      <Td>
                        {data.providers && data.providers.ZA_free
                          ? data.providers.ZA_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Zâmbia</Th>
                      <Td>
                        {data.providers && data.providers.ZM_free
                          ? data.providers.ZM_free
                          : ""}
                      </Td>
                    </Tr>

                    <Tr>
                      <Th>Zimbábue</Th>
                      <Td>
                        {data.providers && data.providers.ZW_free
                          ? data.providers.ZW_free
                          : ""}
                      </Td>
                    </Tr>
                  </Tbody>
                  <Thead />
                </Table>
              </TableContainer>
            )}
          </ChakraProvider>
        )}
        <div />
        {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
      </div>
    </>
  );
};

export default MoviePage;
