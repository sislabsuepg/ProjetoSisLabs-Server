import { faker } from "@faker-js/faker";

// Define locale (faker v9+ usa setDefaultLocale)
// @ts-ignore - compat layer se versão não expõe método
if ((faker as any).setDefaultLocale) {
  (faker as any).setDefaultLocale("pt_BR");
}

export function randomCursoNome(index: number) {
  const base = [
    "Ciência da Computação",
    "Engenharia de Software",
    "Sistemas de Informação",
    "Tecnologia em Análise de Sistemas",
  ];
  return base[index] || faker.word.words({ count: 3 });
}

export function randomProfessorNome() {
  return faker.person.fullName();
}

export function randomLaboratorioNome(index: number) {
  const temas = ["Redes", "Hardware", "Robótica", "Pesquisa", "IA", "Dados"];
  return `Lab ${temas[index % temas.length]}`;
}

export function randomLaboratorioNumero(index: number) {
  return (100 + index).toString();
}

export function randomAlunoNome() {
  return faker.person.fullName();
}

export function randomEmail(nome?: string) {
  if (nome) {
    const slug = nome
      .toLowerCase()
      .replace(/[^a-zà-ú0-9 ]/gi, "")
      .replace(/\s+/g, ".");
    return `${slug}.${faker.number.int({ min: 100, max: 999 })}@exemplo.br`;
  }
  return faker.internet.email();
}

export function randomRA() {
  return faker.number
    .int({ min: 1000000000000, max: 9999999999999 })
    .toString();
}

export function randomTelefone() {
  const ddd = faker.number.int({ min: 41, max: 49 });
  return `(${ddd}) 9${faker.number.int({
    min: 1000,
    max: 9999,
  })}-${faker.number.int({ min: 1000, max: 9999 })}`;
}

export function randomBoolean(trueProbability = 0.5) {
  return Math.random() < trueProbability;
}

export function randomHorario() {
  const horas = [8, 10, 13, 15, 19];
  const h = horas[faker.number.int({ min: 0, max: horas.length - 1 })];
  return `${h.toString().padStart(2, "0")}:${faker.helpers.arrayElement([
    "00",
    "30",
  ])}`;
}

export function randomDescricaoRegistro() {
  const acoes = [
    "Criação de usuário",
    "Atualização de curso",
    "Login efetuado",
    "Logout realizado",
    "Alteração de permissão",
    "Geração de relatório",
    "Importação de dados",
  ];
  return faker.helpers.arrayElement(acoes);
}

export function randomRecadoTexto() {
  return faker.lorem.sentence({ min: 8, max: 16 });
}

export function randomAdvertencia() {
  return faker.helpers.arrayElement([
    null,
    null,
    "Chave devolvida com atraso",
    "Uso indevido de equipamento",
  ]);
}

export function randomEventoNome() {
  const nomes = [
    "Workshop",
    "Apresentação Projeto",
    "Manutenção",
    "Treinamento",
    "Reunião Pesquisa",
  ];
  return faker.helpers.arrayElement(nomes) + " " + faker.word.noun();
}

export function randomResponsavel() {
  return faker.person.lastName();
}
