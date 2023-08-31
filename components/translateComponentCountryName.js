import React from "react";

const countryNames = {
  Afghanistan: { pt: "Afeganistão" },
  Albania: { pt: "Albânia" },
  Algeria: { pt: "Argélia" },
  Andorra: { pt: "Andorra" },
  Angola: { pt: "Angola" },
  "Antigua and Barbuda": { pt: "Antígua e Barbuda" },
  Argentina: { pt: "Argentina" },
  Armenia: { pt: "Armênia" },
  Australia: { pt: "Austrália" },
  Austria: { pt: "Áustria" },
  Azerbaijan: { pt: "Azerbaijão" },
  Bahamas: { pt: "Bahamas" },
  Bahrain: { pt: "Bahrein" },
  Bangladesh: { pt: "Bangladesh" },
  Barbados: { pt: "Barbados" },
  Belarus: { pt: "Belarus" },
  Belgium: { pt: "Bélgica" },
  Belize: {
    pt: "Belize",
    en: "Belize",
  },
  Benin: {
    pt: "Benin",
    en: "Benin",
  },
  Bhutan: {
    pt: "Butão",
    en: "Bhutan",
  },
  Bolivia: {
    pt: "Bolívia",
    en: "Bolivia",
  },
  "Bosnia and Herzegovina": {
    pt: "Bósnia e Herzegovina",
    en: "Bosnia and Herzegovina",
  },
  Botswana: {
    pt: "Botswana",
    en: "Botswana",
  },
  Brazil: {
    pt: "Brasil",
    en: "Brazil",
  },
  Brunei: {
    pt: "Brunei",
    en: "Brunei",
  },
  Bulgaria: {
    pt: "Bulgária",
    en: "Bulgaria",
  },
  "Burkina Faso": {
    pt: "Burkina Faso",
    en: "Burkina Faso",
  },
  Burundi: {
    pt: "Burundi",
    en: "Burundi",
  },
  "Cabo Verde": {
    pt: "Cabo Verde",
    en: "Cape Verde",
  },
  Cambodia: {
    pt: "Camboja",
    en: "Cambodia",
  },
  Cameroon: {
    pt: "Camarões",
    en: "Cameroon",
  },
  Canada: {
    pt: "Canadá",
    en: "Canada",
  },
  "Central African Republic": {
    pt: "República Centro-Africana",
    en: "Central African Republic",
  },
  Chad: {
    pt: "Chade",
    en: "Chad",
  },
  Chile: {
    pt: "Chile",
    en: "Chile",
  },
  China: {
    pt: "China",
    en: "China",
  },
  Colombia: {
    pt: "Colômbia",
    en: "Colombia",
  },
  Comoros: {
    pt: "Comores",
    en: "Comoros",
  },
  Congo: {
    pt: "Congo",
    en: "Congo",
  },
  "Costa Rica": {
    pt: "Costa Rica",
    en: "Costa Rica",
  },
  "Cote d'Ivoire": {
    pt: "Costa do Marfim",
    en: "Cote d'Ivoire",
  },
  Croatia: {
    pt: "Croácia",
    en: "Croatia",
  },
  Cuba: {
    pt: "Cuba",
    en: "Cuba",
  },
  Cyprus: {
    pt: "Chipre",
    en: "Cyprus",
  },
  "Czech Republic": {
    pt: "República Tcheca",
    en: "Czech Republic",
  },
  Denmark: {
    pt: "Dinamarca",
  },
  Djibouti: {
    pt: "Djibuti",
  },
  Dominica: {
    pt: "Dominica",
  },
  "Dominican Republic": {
    pt: "República Dominicana",
  },
  Ecuador: {
    pt: "Equador",
  },
  Egypt: {
    pt: "Egito",
  },
  "El Salvador": {
    pt: "El Salvador",
  },
  "Equatorial Guinea": {
    pt: "Guiné Equatorial",
  },
  Eritrea: {
    pt: "Eritreia",
  },
  Estonia: {
    pt: "Estônia",
  },
  Ethiopia: {
    pt: "Etiópia",
  },
  Fiji: {
    pt: "Fiji",
  },
  Finland: {
    pt: "Finlândia",
  },
  France: {
    pt: "França",
  },
  Gabon: {
    pt: "Gabão",
  },
  Gambia: {
    pt: "Gâmbia",
  },
  Georgia: {
    pt: "Geórgia",
  },
  Germany: {
    pt: "Alemanha",
  },
  Ghana: {
    pt: "Gana",
  },
  Greece: {
    pt: "Grécia",
  },
  Grenada: {
    pt: "Granada",
  },
  Guatemala: {
    pt: "Guatemala",
  },
  Guinea: {
    pt: "Guiné",
  },
  "Guinea-Bissau": {
    pt: "Guiné-Bissau",
  },
  Guyana: {
    pt: "Guiana",
  },
  Haiti: {
    pt: "Haiti",
  },
  Honduras: {
    pt: "Honduras",
  },
  Hungary: {
    pt: "Hungria",
  },
  Iceland: {
    pt: "Islândia",
  },
  India: {
    pt: "Índia",
  },
  Indonesia: {
    pt: "Indonésia",
  },
  Iran: {
    pt: "Irã",
  },
  Iraq: {
    pt: "Iraque",
  },
  Ireland: {
    pt: "Irlanda",
  },
  Israel: {
    pt: "Israel",
  },
  Italy: {
    pt: "Itália",
  },
  Jamaica: {
    pt: "Jamaica",
  },
  Japan: {
    pt: "Japão",
  },
  Jordan: {
    pt: "Jordânia",
  },
  Kazakhstan: { pt: "Cazaquistão" },
  Kenya: { pt: "Quênia" },
  Kiribati: { pt: "Kiribati" },
  "North Korea": { pt: "Coréia do Norte" },
  "South Korea": { pt: "Coréia do Sul" },
  Kuwait: { pt: "Kuwait" },
  Kyrgyzstan: { pt: "Quirguistão" },
  Laos: { pt: "Laos" },
  Latvia: { pt: "Latvia" },
  Lebanon: { pt: "Líbano" },
  Lesotho: { pt: "Lesoto" },
  Liberia: { pt: "Libéria" },
  Libya: { pt: "Líbia" },
  Liechtenstein: { pt: "Liechtenstein" },
  Lithuania: { pt: "Lituânia" },
  Luxembourg: { pt: "Luxemburgo" },
  Macedonia: { pt: "Macedônia" },
  Madagascar: { pt: "Madagascar" },
  Malawi: { pt: "Malawi" },
  Malaysia: { pt: "Malásia" },
  Maldives: { pt: "Maldivas" },
  Mali: { pt: "Mali" },
  Malta: { pt: "Malta" },
  "Marshall Islands": { pt: "Ilhas Marshall" },
  Mauritania: { pt: "Mauritânia" },
  Mauritius: { pt: "Maurício" },
  Mexico: { pt: "México" },
  Micronesia: { pt: "Micronésia" },
  Moldova: { pt: "Moldávia" },
  Monaco: { pt: "Mônaco" },
  Mongolia: { pt: "Mongólia" },
  Montenegro: { pt: "Montenegro" },
  Morocco: { pt: "Marrocos" },
  Mozambique: { pt: "Moçambique" },
  Myanmar: { pt: "Myanmar" },
  Namibia: { pt: "Namíbia" },
  Nauru: { pt: "Nauru" },
  Nepal: { pt: "Nepal" },
  Netherlands: { pt: "Países Baixos" },
  "New Zealand": { pt: "Nova Zelândia" },
  Nicaragua: { pt: "Nicarágua" },
  Niger: { pt: "Níger" },
  Nigeria: { pt: "Nigéria" },
  Norway: { pt: "Noruega" },
  Oman: { pt: "Omã" },
  Pakistan: { pt: "Paquistão" },
  Palau: { pt: "Palau" },
  Panama: { pt: "Panamá" },
  "Papua New Guinea": {
    en: "Papua New Guinea",
    pt: "Papua Nova Guiné",
  },
  Paraguay: {
    en: "Paraguay",
    pt: "Paraguai",
  },
  Peru: {
    en: "Peru",
    pt: "Peru",
  },
  Philippines: {
    en: "Philippines",
    pt: "Filipinas",
  },
  Poland: {
    en: "Poland",
    pt: "Polônia",
  },
  Portugal: {
    en: "Portugal",
    pt: "Portugal",
  },
  Qatar: {
    en: "Qatar",
    pt: "Catar",
  },
  Romania: {
    en: "Romania",
    pt: "Romênia",
  },
  Russia: {
    en: "Russia",
    pt: "Rússia",
  },
  Rwanda: {
    en: "Rwanda",
    pt: "Ruanda",
  },
  "Saint Kitts and Nevis": {
    en: "Saint Kitts and Nevis",
    pt: "São Cristóvão e Nevis",
  },
  "Saint Lucia": {
    en: "Saint Lucia",
    pt: "Santa Lúcia",
  },
  "Saint Vincent and the Grenadines": {
    en: "Saint Vincent and the Grenadines",
    pt: "São Vicente e Granadinas",
  },
  Samoa: {
    en: "Samoa",
    pt: "Samoa",
  },
  "San Marino": {
    en: "San Marino",
    pt: "San Marino",
  },
  "Sao Tome and Principe": {
    en: "Sao Tome and Principe",
    pt: "São Tomé e Príncipe",
  },
  "Saudi Arabia": {
    en: "Saudi Arabia",
    pt: "Arábia Saudita",
  },
  Senegal: {
    en: "Senegal",
    pt: "Senegal",
  },
  Serbia: {
    en: "Serbia",
    pt: "Sérvia",
  },
  Seychelles: {
    en: "Seychelles",
    pt: "Seychelles",
  },
  "Sierra Leone": {
    en: "Sierra Leone",
    pt: "Serra Leoa",
  },
  Singapore: {
    en: "Singapore",
    pt: "Cingapura",
  },
  Slovakia: {
    en: "Slovakia",
    pt: "Eslováquia",
  },
  Slovenia: {
    en: "Slovenia",
    pt: "Eslovênia",
  },
  "Solomon Islands": {
    en: "Solomon Islands",
    pt: "Ilhas Salomão",
  },
  Somalia: {
    en: "Somalia",
    pt: "Somália",
  },
  "South Africa": {
    en: "South Africa",
    pt: "África do Sul",
  },
  "South Korea": {
    en: "South Korea",
    pt: "Coreia do Sul",
  },
  "South Sudan": {
    en: "South Sudan",
    pt: "Sudão do Sul",
  },
  Spain: { pt: "Espanha" },
  "Sri Lanka": {
    pt: "Sri Lanka",
  },
  Sudan: {
    pt: "Sudão",
  },
  Suriname: {
    pt: "Suriname",
  },
  Sweden: {
    pt: "Suécia",
  },
  Switzerland: {
    pt: "Suíça",
  },
  Syria: {
    pt: "Síria",
  },
  "Soviet Union": {
    pt: "União Soviética",
  },
  Taiwan: {
    pt: "Taiwan",
  },
  Tajikistan: {
    pt: "Tajiquistão",
  },
  Tanzania: {
    pt: "Tanzânia",
  },
  Thailand: {
    pt: "Tailândia",
  },
  "Timor-Leste": {
    pt: "Timor-Leste",
  },
  Togo: {
    pt: "Togo",
  },
  Tonga: {
    pt: "Tonga",
  },
  "Trinidad and Tobago": {
    pt: "Trinidad e Tobago",
  },
  Tunisia: {
    pt: "Tunísia",
  },
  Turkey: {
    pt: "Turquia",
  },
  Turkmenistan: {
    pt: "Turcomenistão",
  },
  Tuvalu: {
    pt: "Tuvalu",
  },
  Uganda: {
    pt: "Uganda",
  },
  Ukraine: {
    pt: "Ucrânia",
  },
  "United Arab Emirates": {
    pt: "Emirados Árabes Unidos",
  },
  "United Kingdom": {
    pt: "Reino Unido",
  },
  "United States of America": {
    pt: "Estados Unidos da América",
  },
  Uruguay: {
    pt: "Uruguai",
  },
  Uzbekistan: {
    pt: "Uzbequistão",
  },
  Vanuatu: {
    pt: "Vanuatu",
  },
  "Vatican City": {
    pt: "Cidade do Vaticano",
  },
  Venezuela: {
    pt: "Venezuela",
  },
  Vietnam: {
    pt: "Vietnã",
  },
  Yemen: {
    pt: "Iêmen",
  },
  Zambia: {
    pt: "Zâmbia",
  },
  Zimbabwe: {
    pt: "Zimbábue",
  },
};

const TranslationComponentCountryName = ({ text, language }) => {
  const translate = (text) => {
    return countryNames[text]?.[language] || text;
  };
  return translate(text);
};

export default TranslationComponentCountryName;
