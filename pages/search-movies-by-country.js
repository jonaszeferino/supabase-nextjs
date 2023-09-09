import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import { format } from "date-fns";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import {
  ChakraProvider,
  FormControl,
  Select,
  FormLabel,
  Button,
  Input,
  Center,
  VStack,
  IconButton
} from "@chakra-ui/react";
import { BiSolidUpArrow } from "react-icons/bi";


export default function Discovery() {
  let [searchMovies, setSearchMovies] = useState([]);
  let [searchRatingSort, setSearchRatingSort] = useState("vote_average.desc");
  let [searchVoteCount, setSearchVoteCount] = useState(100);
  let [searchMovieTotalPages, setSearchMovieTotalPages] = useState("");
  let [searchMovieRealPage, setSearchMovieRealPage] = useState("");
  let [searchMovieTotalResults, setSearchMovieTotalResults] = useState("");
  let [searchMovieReleaseDateFrom, setSearchMovieReleaseDateFrom] =
    useState(1800);
  let [searchMovieReleaseDateTo, setSearchMovieReleaseDateTo] = useState(2023);
  let [searchMovieCountry, setSearchMovieCountry] = useState("pt");
  let [page, setPage] = useState(1);
  let [isError, setError] = useState(false);
  let [isLoading, setIsLoading] = useState(false);

  const [showBackToTopButton, setShowBackToTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTopButton(true);
      } else {
        setShowBackToTopButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let urlString =
    "https://api.themoviedb.org/3/discover/movie?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR&with_original_language=" +
    searchMovieCountry +
    "&include_adult=false&include_video=false&vote_count.gte=" +
    searchVoteCount +
    "&vote_count.lte=10000000&sort_by=" +
    searchRatingSort +
    "&primary_release_date.gte=" +
    searchMovieReleaseDateFrom +
    "&primary_release_date.lte=" +
    searchMovieReleaseDateTo;

  const apiCall = (currentPage) => {
    setIsLoading(true);
    const url = urlString + "&page=" + currentPage;

    console.log(url + " o que chamou");
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

  return (
    <>
      <div>
        <div className={styles.top}>
          <h3 className={styles.title}>Filmes por Língua</h3>
          {/* <span>Escolha a língua, o ano, a quantidade de votos, e ordene os resultados</span> */}
        </div>
        <br />
        <br />
        <br />

        <ChakraProvider>
          <Center>
            <VStack>
              <FormControl>
                <FormLabel htmlFor="select">Ordem:</FormLabel>
                <Select
                  id="select"
                  name="select"
                  value={searchRatingSort}
                  onChange={(event) => setSearchRatingSort(event.target.value)}
                >
                  <option value="vote_average.asc">
                    Da Pior Nota Para Melhor
                  </option>
                  <option value="vote_average.desc">
                    Da Melhor Nota Para Pior
                  </option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="select">Nº de Votos:</FormLabel>
                <Select
                  id="select"
                  name="select"
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

              <div />

              <br />
              <FormControl>
                <FormLabel>Língua do Filme:</FormLabel>
                <Select
                  name="country"
                  value={searchMovieCountry}
                  onChange={(event) =>
                    setSearchMovieCountry(event.target.value)
                  }
                >
                  {/* ISO 639-1 */}
                  <option value="pt">Português</option>
                  <option value="en">Inglês</option>
                  <option value="ab">Abkhaziano</option>
                  <option value="aar">Afar</option>
                  <option value="af">Africano</option>
                  <option value="ak">Akan</option>
                  <option value="sq">Albanes</option>
                  <option value="am">Amárico</option>
                  <option value="am">Árabe</option>
                  <option value="an">Aragonês</option>
                  <option value="hy">Armeno</option>
                  <option value="as">Assamês</option>
                  <option value="av">Avarico</option>
                  <option value="ay">Aimará</option>
                  <option value="az">Azerbaijano</option>
                  <option value="bm">Bambara</option>
                  <option value="ba">Bashkir</option>
                  <option value="eu">Basco</option>
                  <option value="be">Belorusso</option>
                  <option value="bn">Bengali</option>
                  <option value="bi">Bislama</option>
                  <option value="bs">Bósnio</option>
                  <option value="br">Bretão</option>
                  <option value="bg">Bulgaro</option>
                  <option value="my">Birmanês</option>
                  <option value="ca">Catalão</option>
                  <option value="ch">Chamarro</option>
                  <option value="ce">Checheno</option>
                  <option value="ny">Chichewa</option>
                  <option value="zh">Chinês</option>
                  <option value="cu">Eslavo</option>
                  <option value="cv">Chuvash</option>
                  <option value="kw">Córnico</option>
                  <option value="co">Corso</option>
                  <option value="cr">Cree</option>
                  <option value="hr">Croata</option>
                  <option value="cs">Tcheco</option>
                  <option value="da">Dinamarquês</option>
                  <option value="dv">Divehi</option>
                  <option value="nl">Holandês</option>
                  <option value="dz">Dzongkha</option>
                  <option value="en">Inglês</option>
                  <option value="eo">Esperanto</option>
                  <option value="et">Estoniano</option>
                  <option value="en">Inglês</option>
                  <option value="ee">Ewe</option>
                  <option value="fo">Faroense</option>
                  <option value="fj">Fijiano</option>
                  <option value="fi">Finlandês</option>
                  <option value="fr">Francês</option>
                  <option value="fy">Frísia Ocidental</option>

                  <option value="ff">Fulah</option>
                  <option value="gd">Gaélico</option>
                  <option value="gl">Galego</option>
                  <option value="lg">Ganda</option>
                  <option value="ka">Geórgio</option>
                  <option value="de">Alemão</option>
                  <option value="el">Grego</option>
                  <option value="kl">Kalaallisut</option>
                  <option value="gn">Guarani</option>
                  <option value="gu">Gujarati</option>
                  <option value="ht">Haitiano</option>
                  <option value="ha">Hauçá</option>
                  <option value="he">Hebraico</option>
                  <option value="ho">Hiri Motu</option>
                  <option value="hu">Húngaro</option>
                  <option value="is">Islandês</option>
                  <option value="io">Ido(esperanto)</option>

                  <option value="id">Indonésio</option>
                  <option value="ia">Interlíngua</option>
                  <option value="ie">Interlíngue</option>
                  <option value="iu">Inuktitut</option>
                  <option value="ik">Inupiaq</option>
                  <option value="ga">Irlandês</option>
                  <option value="it">Italiano</option>
                  <option value="ja">Joponês</option>
                  <option value="jv">Javanês</option>
                  <option value="kn">Kannada</option>
                  <option value="kr">Kanuri</option>
                  <option value="ks">Caxemira</option>
                  <option value="kk">Cazaques</option>
                  <option value="km">Khmer Central</option>
                  <option value="ki">Kikuyu</option>
                  <option value="rw">Kinyarwanda</option>
                  <option value="ky">Quirguiz</option>
                  <option value="kv">Komi</option>
                  <option value="ko">Coreano</option>
                  <option value="kj">Kuanyama</option>
                  <option value="ku">Curdo</option>
                  <option value="lo">Laos</option>
                  <option value="la">Latin</option>
                  <option value="lv">Letão</option>
                  <option value="li">Limburguês</option>
                  <option value="ln">Lingala</option>
                  <option value="lt">Lituano</option>
                  <option value="lu">Luba-Katanga</option>
                  <option value="lb">Luxemburguês</option>
                  <option value="mk">Macedônio</option>
                  <option value="mg">Malgaxe</option>
                  <option value="ms">Malaio</option>
                  <option value="ml">Malaiala</option>
                  <option value="mt">Maltês</option>
                  <option value="gv">Manx</option>
                  <option value="mi">Maori</option>
                  <option value="mr">Marathi</option>
                  <option value="mh">Marshallês</option>
                  <option value="mn">Mongol</option>
                  <option value="na">Nauru</option>
                  <option value="nv">Navajo</option>
                  <option value="nd">Norte Ndebele</option>
                  <option value="nr">South Ndebele</option>
                  <option value="ng">Ndonga</option>
                  <option value="ne">Nepalês</option>
                  <option value="no">Norueguês</option>
                  <option value="nb">Bokmal norueguês</option>
                  <option value="nn">Norueguês Nynorsk</option>
                  <option value="ii">Sichuan Yi</option>
                  <option value="oc">Occitano</option>
                  <option value="oj">Ojibwa</option>
                  <option value="or">Oriá</option>
                  <option value="os">Ossétia</option>
                  <option value="pi">Páli</option>
                  <option value="ps">Pashto</option>
                  <option value="fa">Perso</option>
                  <option value="pl">Polonês</option>
                  <option value="pt">Português</option>
                  <option value="pa">Punjabi</option>
                  <option value="qu">Quechua</option>
                  <option value="ro">Romenos</option>
                  <option value="rm">Romanche</option>
                  <option value="rn">Rundi</option>
                  <option value="ru">Russo</option>
                  <option value="se">Sami do Norte</option>
                  <option value="sm">Samoano</option>
                  <option value="sg">Sango</option>
                  <option value="sa">Sânscrito</option>
                  <option value="sc">Sardos</option>
                  <option value="sr">Sérvio</option>
                  <option value="sn">Shona</option>
                  <option value="sd">Sindi</option>
                  <option value="si">Cingalês</option>
                  <option value="sk">Eslovaco</option>
                  <option value="sl">Esloveno</option>
                  <option value="so">Somali</option>
                  <option value="st">Southern Sotho</option>
                  <option value="es">Espanhol</option>
                  <option value="su">Sundanês</option>
                  <option value="sw">Suaíli</option>
                  <option value="ss">Swati</option>
                  <option value="sv">Sueco</option>
                  <option value="tl">Tagalo</option>
                  <option value="ty">Taitiano</option>
                  <option value="tg">Tadjique</option>
                  <option value="ta">Tâmil</option>
                  <option value="tt">Tártaro</option>
                  <option value="te">Telugu</option>
                  <option value="th">Tailandês</option>
                  <option value="bo">Tibetano</option>
                  <option value="ti">Tigrinya</option>
                  <option value="to">Tonga</option>
                  <option value="ts">Tsonga</option>
                  <option value="tn">Tswana</option>
                  <option value="tr">Turco</option>
                  <option value="tk">Turcomano</option>
                  <option value="tw">Twi</option>
                  <option value="ug">Uigur</option>
                  <option value="uk">Ucraniano</option>
                  <option value="ur">Urdu</option>
                  <option value="uz">Uzbeque</option>
                  <option value="ve">Venda</option>
                  <option value="vi">Vietnamita</option>
                  <option value="vo">Volapük</option>
                  <option value="cy">Valão</option>
                  <option value="cy">Galês</option>
                  <option value="wo">Wolof</option>
                  <option value="xh">Xhosa</option>
                  <option value="yi">Iídiche</option>
                  <option value="yo">Iorubá</option>
                  <option value="za">Zhuang</option>
                  <option value="zu">Zulu</option>
                </Select>
              </FormControl>

              <br />
              <FormControl>
                <FormLabel>Ano Inicial:</FormLabel>
                <Input
                  type="number"
                  min={1800}
                  max={2022}
                  value={searchMovieReleaseDateFrom}
                  onChange={(event) =>
                    setSearchMovieReleaseDateFrom(event.target.value)
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Ano Final:</FormLabel>
                <Input
                  type="number"
                  min={1801}
                  max={2023}
                  value={searchMovieReleaseDateTo}
                  onChange={(event) =>
                    setSearchMovieReleaseDateTo(event.target.value)
                  }
                />
              </FormControl>
              <br />
              <Button
                size="lg"
                colorScheme="purple"
                mt="24px"
                onClick={apiCall}
              >
                Verificar
              </Button>
            </VStack>
          </Center>
        </ChakraProvider>

        <br />

        <br />
        {!searchMovies ? (
          <div>
            <span className={styles.spantext}>
              Pág: {searchMovieRealPage} de: {searchMovieTotalPages} Total de
              Resultados: {searchMovieTotalResults}
            </span>
          </div>
        ) : (
          ""
        )}
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
          {isLoading ? <div>Carregando...</div> : " "}
        </span>
        {isError === true ? (
          <ErrorPage message={`Verifique as Credenciais`}></ErrorPage>
        ) : (
          <div className={styles.grid}>
            {searchMovies.map((search) => (
              <div key={search.id}>
                {console.log(
                  "https://image.tmdb.org/t/p/original" +
                    search.poster_path +
                    " ver o path da imagem"
                )}
                <span className={styles.spantext}>{search.original_title}</span>{" "}
                <br />
                <span className={styles.spantext}>{search.title}</span> <br />
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
                  <span className={styles.spantext}>
                    Média: {search.vote_average} - Nº de Votos:{" "}
                    {search.vote_count}
                  </span>{" "}
                </span>
                <span className={styles.spantext}></span> <br />
                <span className={styles.spantext}>
                  Data de Lançamento:
                  {search.release_date.length > 0
                    ? format(new Date(search.release_date), " dd/MM/yyyy")
                    : ""}
                </span>
                <br />
                {/* <span className={styles.spantext}>MovieID: {search.id}</span> */}
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
      </div>
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
      {showBackToTopButton && (
        <IconButton
          onClick={scrollToTop}
          position="fixed"
          bottom="120px"
          right="40px"
          zIndex="9999"
          borderRadius="full"
          aria-label="Voltar para o topo"
          bg="transparent"
        >
          <span
            style={{
              border: "2px solid black",
              borderRadius: "50%",
              padding: "2px",
              display: "inline-block",
            }}
          >
            <BiSolidUpArrow size={30} color="black" />
          </span>
        </IconButton>
      )}
      
      {!searchMovies ? (
        <div>
          <span className={styles.spantext}>Total Paginas: {totalPages}</span>{" "}
          <span className={styles.spantext}>Pagina Atual: {currentPage}</span>{" "}
          <span className={styles.spantext}>
            Total Resultados: {totalResults}
          </span>{" "}
        </div>
      ) : (
        ""
      )}
      {!totalResults ? (
        <span className={styles.spantext}>
          Escolha os filtros acima, e clique em Verificar para uma consulta de
          acordo com o seu desejo! Escolha as Opções:
          <ul>Ordem das Notas</ul>
          <ul>Número de Avaliações</ul>
          <ul>Língua do Filme</ul>
          <ul>Ano de lançamento</ul>
        </span>
      ) : (
        ""
      )}
    </>
  );
}
