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
      <Box p={4}>
        <Heading size="lg" mb={4}>
          Perfil
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="start">
            <FormControl>
              <FormLabel>Nome:</FormLabel>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Sobrenome:</FormLabel>
              <Input
                type="text"
                name="firstName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Origem:</FormLabel>
              <Input
                type="text"
                name="firstName"
                value={formData.nationality}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Data de Nascimento:</FormLabel>
              <DatePicker
                selected={formData.dateOfBirth}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Gênero:</FormLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Não binário">Não binário</option>
                <option value="Prefiro não informar">
                  Prefiro não informar
                </option>
              </Select>
            </FormControl>
            <Button colorScheme="blue" type="submit">
              Salvar
            </Button>
          </VStack>
        </form>
      </Box>
    </ChakraProvider>
  );
};

export default Profile;
