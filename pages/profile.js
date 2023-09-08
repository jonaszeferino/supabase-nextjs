import { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  ChakraProvider,
  Divider,
  Text,
  Center
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    gender: "Prefiro não informar",
    favoriteMovie: "",
    movieGenre: "",
    favoriteTVShow: "",
    tvShowGenre: "",
    favoriteActor: "",
    favoriteActress: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica para enviar os dados do formulário para o servidor
    console.log(formData); // Exemplo: exibir os dados no console
  };

  const formatDateString = (dateString) => {
    // Esta função formata a data no formato DDMMYYYY
    if (dateString.length !== 8) return dateString;
    const day = dateString.substring(0, 2);
    const month = dateString.substring(2, 4);
    const year = dateString.substring(4, 8);
    return `${day}${month}${year}`;
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatDateString(value);
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  return (
    <ChakraProvider>
      <Box p={4} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <Heading size="lg" mb={4}>
          Dados do Perfil
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="start">
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
              <Input
                type="text"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                style={{ width: "100%" }}
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
            <Divider />
            <Center>
              <Text>Seus Gostos</Text>
            </Center>
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Filme Favorito:
              </FormLabel>
              <Input
                type="text"
                name="favoriteMovie"
                value={formData.favoriteMovie}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Gênero de Filme Favorito:
              </FormLabel>
              <Input
                type="text"
                name="movieGenre"
                value={formData.movieGenre}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Serie Favorito:
              </FormLabel>
              <Input
                type="text"
                name="favoriteTVShow"
                value={formData.favoriteTVShow}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel style={{ fontWeight: "bold" }}>
                Genero de Série Favorito:
              </FormLabel>
              <Input
                type="text"
                name="tvShowGenre"
                value={formData.tvShowGenre}
                onChange={handleChange}
                style={{ width: "100%" }}
              />
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
            <Button colorScheme="blue" type="submit" style={{ width: "100%" }}>
              Salvar
            </Button>
          </VStack>
        </form>
      </Box>
    </ChakraProvider>
  );
};

export default Profile;
