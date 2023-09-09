import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import { format } from "date-fns";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import {
  ChakraProvider,
  Progress,
  Select,
  FormLabel,
  Button,
  FormControl,
  Flex,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { BiSolidUpArrow } from "react-icons/bi";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";

export default function Discovery() {
  let [movieId, setMovieId] = useState();
  let [searchMovies, setSearchMovies] = useState([]);
  let [searchRatingSort, setSearchRatingSort] = useState("vote_average.desc");
  let [searchVoteCount, setSearchVoteCount] = useState(5000);
  let [searchMovieReleaseDateFrom, setSearchMovieReleaseDateFrom] =
    useState(1800);
  let [searchMovieReleaseDateTo, setSearchMovieReleaseDateTo] = useState(2023);
  //paginação
  let [page, setPage] = useState(1);
  let [searchMovieTotalPages, setSearchMovieTotalPages] = useState("");
  let [searchMovieRealPage, setSearchMovieRealPage] = useState("");
  let [searchMovieTotalResults, setSearchMovieTotalResults] = useState("");
  // erro e loading
  let [isError, setError] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  const { showBackToTopButton, scrollToTop } = useBackToTopButton(); // tranformado num hook
  // estado pra amarzenar os filtros utilizados

  const [searchFilters, setSearchFilters] = useState({
    ratingSort: "vote_average.desc",
    voteCount: 5000,
    releaseDateFrom: 1800,
    releaseDateTo: 2023,
    with_origin_country: "NOTHING",
  });

  let urlString =
    "https://api.themoviedb.org/3/discover/movie?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR&include_adult=false&include_video=false&vote_count.gte=" +
    searchVoteCount +
    "&vote_count.lte=10000000&sort_by=" +
    searchRatingSort +
    "&primary_release_date.gte=" +
    searchMovieReleaseDateFrom +
    "&primary_release_date.lte=" +
    searchMovieReleaseDateTo;

  if (searchFilters.with_origin_country === "NOTHING") {
    urlString;
  } else {
    urlString += "&with_origin_country=" + searchFilters.with_origin_country;
  }

  const apiCall = (currentPage) => {
    const url = urlString + "&page=" + currentPage;
    setIsLoading(true);

    console.log(url + " o que chamou");
    console.log(movieId + "Id dos filmes");

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
    setPage(page - 1), apiCall(page - 1);
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

  const options = [
    { value: "AF", label: "Afeganistão" },
    { value: "AL", label: "Albânia" },
    { value: "DZ", label: "Argélia" },
    { value: "AS", label: "Samoa Americana" },
    { value: "AD", label: "Andorra" },
    { value: "AO", label: "Angola" },
    { value: "AQ", label: "Antártica" },
    { value: "AG", label: "Antígua e Barbuda" },
    { value: "AR", label: "Argentina" },
    { value: "AM", label: "Armênia" },
    { value: "AW", label: "Aruba" },
    { value: "AU", label: "Austrália" },
    { value: "AT", label: "Áustria" },
    { value: "AZ", label: "Azerbaijão" },
    { value: "BS", label: "Bahamas" },
    { value: "BH", label: "Bahrein" },
    { value: "BD", label: "Bangladesh" },
    { value: "BB", label: "Barbados" },
    { value: "BY", label: "Bielorrússia" },
    { value: "BE", label: "Bélgica" },
    { value: "BZ", label: "Belize" },
    { value: "BJ", label: "Benin" },
    { value: "BM", label: "Bermudas" },
    { value: "BT", label: "Butão" },
    { value: "BO", label: "Bolívia" },
    { value: "BA", label: "Bósnia e Herzegovina" },
    { value: "BW", label: "Botsuana" },
    { value: "BV", label: "Ilha Bouvet" },
    { value: "BR", label: "Brasil" },
    { value: "IO", label: "Território Britânico do Oceano Índico" },
    { value: "BN", label: "Brunei" },
    { value: "BG", label: "Bulgária" },
    { value: "BF", label: "Burkina Faso" },
    { value: "BI", label: "Burundi" },
    { value: "KH", label: "Camboja" },
    { value: "CM", label: "Camarões" },
    { value: "CA", label: "Canadá" },
    { value: "CV", label: "Cabo Verde" },
    { value: "KY", label: "Ilhas Cayman" },
    { value: "CF", label: "República Centro-Africana" },
    { value: "TD", label: "Chade" },
    { value: "CL", label: "Chile" },
    { value: "CN", label: "China" },
    { value: "CX", label: "Ilha Christmas" },
    { value: "CC", label: "Ilhas Cocos (Keeling)" },
    { value: "CO", label: "Colômbia" },
    { value: "KM", label: "Comores" },
    { value: "CG", label: "Congo" },
    { value: "CD", label: "República Democrática do Congo" },
    { value: "CK", label: "Ilhas Cook" },
    { value: "CR", label: "Costa Rica" },
    { value: "CI", label: "Costa do Marfim" },
    { value: "HR", label: "Croácia" },
    { value: "CU", label: "Cuba" },
    { value: "CY", label: "Chipre" },
    { value: "CZ", label: "República Tcheca" },
    { value: "DK", label: "Dinamarca" },
    { value: "DJ", label: "Djibuti" },
    { value: "DM", label: "Dominica" },
    { value: "DO", label: "República Dominicana" },
    { value: "EC", label: "Equador" },
    { value: "EG", label: "Egito" },
    { value: "SV", label: "El Salvador" },
    { value: "GQ", label: "Guiné Equatorial" },
    { value: "ER", label: "Eritreia" },
    { value: "EE", label: "Estônia" },
    { value: "ET", label: "Etiópia" },
    { value: "FK", label: "Ilhas Malvinas" },
    { value: "FO", label: "Ilhas Faroe" },
    { value: "FJ", label: "Fiji" },
    { value: "FI", label: "Finlândia" },
    { value: "FR", label: "França" },
    { value: "GF", label: "Guiana Francesa" },
    { value: "PF", label: "Polinésia Francesa" },
    { value: "TF", label: "Territórios Franceses do Sul" },
    { value: "GA", label: "Gabão" },
    { value: "GM", label: "Gâmbia" },
    { value: "GE", label: "Geórgia" },
    { value: "DE", label: "Alemanha" },
    { value: "GH", label: "Gana" },
    { value: "GI", label: "Gibraltar" },
    { value: "GR", label: "Grécia" },
    { value: "GL", label: "Groenlândia" },
    { value: "GD", label: "Granada" },
    { value: "GP", label: "Guadalupe" },
    { value: "GU", label: "Guam" },
    { value: "GT", label: "Guatemala" },
    { value: "GG", label: "Guernsey" },
    { value: "GN", label: "Guiné" },
    { value: "GW", label: "Guiné-Bissau" },
    { value: "GY", label: "Guiana" },
    { value: "HT", label: "Haiti" },
    { value: "HM", label: "Ilha Heard e Ilhas McDonald" },
    { value: "VA", label: "Cidade do Vaticano" },
    { value: "HN", label: "Honduras" },
    { value: "HK", label: "Hong Kong" },
    { value: "HU", label: "Hungria" },
    { value: "IS", label: "Islândia" },
    { value: "IN", label: "Índia" },
    { value: "ID", label: "Indonésia" },
    { value: "IR", label: "Irã" },
    { value: "IQ", label: "Iraque" },
    { value: "IE", label: "Irlanda" },
    { value: "IM", label: "Ilha de Man" },
    { value: "IL", label: "Israel" },
    { value: "IT", label: "Itália" },
    { value: "JM", label: "Jamaica" },
    { value: "JP", label: "Japão" },
    { value: "JE", label: "Jersey" },
    { value: "JO", label: "Jordânia" },
    { value: "KZ", label: "Cazaquistão" },
    { value: "KE", label: "Quênia" },
    { value: "KI", label: "Quiribati" },
    { value: "KP", label: "Coreia do Norte" },
    { value: "KR", label: "Coreia do Sul" },
    { value: "KW", label: "Kuwait" },
    { value: "KG", label: "Quirguistão" },
    { value: "LA", label: "Laos" },
    { value: "LV", label: "Letônia" },
    { value: "LB", label: "Líbano" },
    { value: "LS", label: "Lesoto" },
    { value: "LR", label: "Libéria" },
    { value: "LY", label: "Líbia" },
    { value: "LI", label: "Liechtenstein" },
    { value: "LT", label: "Lituânia" },
    { value: "LU", label: "Luxemburgo" },
    { value: "MO", label: "Macau" },
    { value: "MK", label: "Macedônia do Norte" },
    { value: "MG", label: "Madagascar" },
    { value: "MW", label: "Malawi" },
    { value: "MY", label: "Malásia" },
    { value: "MV", label: "Maldivas" },
    { value: "ML", label: "Mali" },
    { value: "MT", label: "Malta" },
    { value: "MH", label: "Ilhas Marshall" },
    { value: "MQ", label: "Martinica" },
    { value: "MR", label: "Mauritânia" },
    { value: "MU", label: "Maurício" },
    { value: "YT", label: "Mayotte" },
    { value: "MX", label: "México" },
    { value: "FM", label: "Micronésia" },
    { value: "MD", label: "Moldávia" },
    { value: "MC", label: "Mônaco" },
    { value: "MN", label: "Mongólia" },
    { value: "ME", label: "Montenegro" },
    { value: "MS", label: "Montserrat" },
    { value: "MA", label: "Marrocos" },
    { value: "MZ", label: "Moçambique" },
    { value: "MM", label: "Mianmar (Birmânia)" },
    { value: "NA", label: "Namíbia" },
    { value: "NR", label: "Nauru" },
    { value: "NP", label: "Nepal" },
    { value: "NL", label: "Países Baixos" },
    { value: "NC", label: "Nova Caledônia" },
    { value: "NZ", label: "Nova Zelândia" },
    { value: "NI", label: "Nicarágua" },
    { value: "NE", label: "Níger" },
    { value: "NG", label: "Nigéria" },
    { value: "NU", label: "Niue" },
    { value: "NF", label: "Ilha Norfolk" },
    { value: "MP", label: "Ilhas Marianas do Norte" },
    { value: "NO", label: "Noruega" },
    { value: "OM", label: "Omã" },
    { value: "PK", label: "Paquistão" },
    { value: "PW", label: "Palau" },
    { value: "PS", label: "Territórios Palestinos" },
    { value: "PA", label: "Panamá" },
    { value: "PG", label: "Papua Nova Guiné" },
    { value: "PY", label: "Paraguai" },
    { value: "PE", label: "Peru" },
    { value: "PH", label: "Filipinas" },
    { value: "PN", label: "Ilhas Pitcairn" },
    { value: "PL", label: "Polônia" },
    { value: "PT", label: "Portugal" },
    { value: "PR", label: "Porto Rico" },
    { value: "QA", label: "Catar" },
    { value: "RE", label: "Reunião" },
    { value: "RO", label: "Romênia" },
    { value: "RU", label: "Rússia" },
    { value: "RW", label: "Ruanda" },
    { value: "SH", label: "Santa Helena" },
    { value: "KN", label: "São Cristóvão e Nevis" },
    { value: "LC", label: "Santa Lúcia" },
    { value: "PM", label: "Saint Pierre e Miquelon" },
    { value: "VC", label: "São Vicente e Granadinas" },
    { value: "WS", label: "Samoa" },
    { value: "SM", label: "San Marino" },
    { value: "ST", label: "São Tomé e Príncipe" },
    { value: "SA", label: "Arábia Saudita" },
    { value: "SN", label: "Senegal" },
    { value: "RS", label: "Sérvia" },
    { value: "SC", label: "Seychelles" },
    { value: "SL", label: "Serra Leoa" },
    { value: "SG", label: "Singapura" },
    { value: "SX", label: "Sint Maarten" },
    { value: "SK", label: "Eslováquia" },
    { value: "SI", label: "Eslovênia" },
    { value: "SB", label: "Ilhas Salomão" },
    { value: "SO", label: "Somália" },
    { value: "ZA", label: "África do Sul" },
    { value: "GS", label: "Geórgia do Sul e Ilhas Sandwich do Sul" },
    { value: "SS", label: "Sudão do Sul" },
    { value: "ES", label: "Espanha" },
    { value: "LK", label: "Sri Lanka" },
    { value: "SD", label: "Sudão" },
    { value: "SR", label: "Suriname" },
    { value: "SJ", label: "Svalbard e Jan Mayen" },
    { value: "SZ", label: "Suazilândia" },
    { value: "SE", label: "Suécia" },
    { value: "CH", label: "Suíça" },
    { value: "SY", label: "Síria" },
    { value: "TW", label: "Taiwan" },
    { value: "TJ", label: "Tajiquistão" },
    { value: "TZ", label: "Tanzânia" },
    { value: "TH", label: "Tailândia" },
    { value: "TL", label: "Timor-Leste" },
    { value: "TG", label: "Togo" },
    { value: "TK", label: "Tokelau" },
    { value: "TO", label: "Tonga" },
    { value: "TT", label: "Trinidad e Tobago" },
    { value: "TN", label: "Tunísia" },
    { value: "TR", label: "Turquia" },
    { value: "TM", label: "Turcomenistão" },
    { value: "TC", label: "Ilhas Turcas e Caicos" },
    { value: "TV", label: "Tuvalu" },
    { value: "UG", label: "Uganda" },
    { value: "UA", label: "Ucrânia" },
    { value: "AE", label: "Emirados Árabes Unidos" },
    { value: "GB", label: "Reino Unido" },
    { value: "US", label: "Estados Unidos da América" },
    { value: "UM", label: "Ilhas Menores Distantes dos Estados Unidos" },
    { value: "UY", label: "Uruguai" },
    { value: "UZ", label: "Uzbequistão" },
    { value: "VU", label: "Vanuatu" },
    { value: "VE", label: "Venezuela" },
    { value: "VN", label: "Vietnã" },
    { value: "VG", label: "Ilhas Virgens Britânicas" },
    { value: "VI", label: "Ilhas Virgens Americanas" },
    { value: "WF", label: "Wallis e Futuna" },
    { value: "EH", label: "Saara Ocidental" },
    { value: "YE", label: "Iêmen" },
    { value: "ZM", label: "Zâmbia" },
    { value: "ZW", label: "Zimbábue" },
  ];

  return (
    <>
      <Head>
        <title>Descubra Filmes</title>
        <meta name="keywords" content="movies,watch,review"></meta>
        <meta name="description" content="encontre tudo de nba aqui"></meta>
      </Head>
      <div>
        <div className={styles.top}>
          <h3 className={styles.title}> Descubra Filmes</h3>
        </div>

        <br />
        <ChakraProvider>
          <FormLabel htmlFor="ordenation">Ordenação do Resultado</FormLabel>
          <Select
            id="ordenation"
            placeholder="Ordenação"
            type="text"
            isRequired={true}
            value={searchRatingSort}
            onChange={(event) => setSearchRatingSort(event.target.value)}
          >
            <option value="vote_average.asc">Da Pior Nota Para Melhor</option>
            <option value="vote_average.desc">Da Melhor Nota Para Pior</option>
          </Select>
        </ChakraProvider>

        <br />
        <ChakraProvider>
          <FormLabel htmlFor="votes">Range de Votos</FormLabel>
          <Select
            id="votes"
            placeholder="Número de Votos"
            type="number"
            isRequired={true}
            value={searchVoteCount}
            onChange={(event) => setSearchVoteCount(event.target.value)}
          >
            <option value="0">0 Votos</option>
            <option value="50">Mais de 50</option>
            <option value="100">Mais de 100</option>
            <option value="200">Mais de 200</option>
            <option value="500">Mais de 500</option>
            <option value="1000">Mais de 1000</option>
            <option value="5000">Mais de 5000</option>
          </Select>
        </ChakraProvider>
        <br />
        <ChakraProvider>
          <FormControl>
            <FormLabel>Ano Inicial e Final:</FormLabel>
            <Flex align="center">
              <Select value={searchMovieReleaseDateFrom}>
                {Array.from({ length: 2024 - 1900 + 1 }, (_, index) => (
                  <option key={index} value={1900 + index}>
                    {1900 + index}
                  </option>
                ))}
              </Select>
              <Box w="20px" />
              <Select value={searchMovieReleaseDateTo}>
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
          <FormLabel htmlFor="origin_country">País de Origem</FormLabel>
          <Select
            id="origin_country"
            placeholder="Selecione o País"
            value={searchFilters.with_origin_country}
            onChange={(event) =>
              setSearchFilters({
                ...searchFilters,
                with_origin_country: event.target.value,
              })
            }
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </ChakraProvider>
        <br />
        <ChakraProvider>
          <Button size="lg" colorScheme="purple" mt="24px" onClick={apiCall}>
            Verificar
          </Button>
        </ChakraProvider>
        <br />
        {!searchMovies ? (
          <div>
            <button
              onClick={previousPage}
              disabled={page <= 1}
              className={styles.card}
            >
              Anterior
            </button>
            <button
              onClick={nextPage}
              disabled={page >= totalPages}
              className={styles.card}
            >
              Próxima
            </button>
          </div>
        ) : (
          ""
        )}
        <span className={styles.spantext}>
          {isLoading ? (
            <ChakraProvider>
              <Progress size="xs" isIndeterminate />{" "}
            </ChakraProvider>
          ) : null}
        </span>

        {isError === true ? (
          <ErrorPage message={`Verifique as Credenciais`}></ErrorPage>
        ) : (
          <div className={styles.grid}>
            {searchMovies.map((search) => (
              <div key={search.id}>
                <span className={styles.spantext}>{search.original_title}</span>{" "}
                <br />
                <span className={styles.spantext}>{search.title}</span> <br />
                <div style={{ maxWidth: "240px", margin: "0 auto" }}>
                  <ChakraProvider>
                    <Progress
                      hasStripe
                      value={search.vote_average}
                      max={10}
                      colorScheme={getProgressColor(search.vote_average)}
                    />
                  </ChakraProvider>
                  <br />
                </div>
                <span className={styles.spantext}>
                  {search.poster_path != null ? (
                    <span className={styles.spantext}>
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
                    <span className={styles.spantext}>
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
                  <br />
                </span>
                <span className={styles.spantext}>
                  Média: {search.vote_average} - Nº de Votos:{" "}
                  {search.vote_count}
                </span>{" "}
                <br />
                <span className={styles.spantext}>
                  Data de Lançamento:
                  {search.release_date.length > 0
                    ? format(new Date(search.release_date), " dd/MM/yyyy")
                    : ""}
                </span>
                <br />
                <Link
                  href={{
                    pathname: "/movie-page",
                    query: { movieId: search.id },
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

        <span className={styles.spantext}>
          {!searchMovies ? (
            <div>
              <button
                onClick={previousPage}
                disabled={page <= 1}
                className={styles.card}
              >
                Anterior
              </button>
              <button
                onClick={nextPage}
                disabled={page >= totalPages}
                className={styles.card}
              >
                Próxima
              </button>
            </div>
          ) : (
            ""
          )}
          <br />
          {!searchMovies ? (
            <div>
              <span className={styles.spantext}>
                Total Paginas: {totalPages}{" "}
              </span>{" "}
              <span className={styles.spantext}>
                Pagina Atual: {currentPage}
              </span>{" "}
              <span className={styles.spantext}>
                Total Resultados: {totalResults}
              </span>{" "}
            </div>
          ) : (
            ""
          )}
        </span>

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

        {!totalResults ? <span className={styles.spantext}></span> : ""}
      </div>
      {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
    </>
  );
}
