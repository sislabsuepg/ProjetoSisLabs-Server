export default interface IAluno {
  id: number;
  nome: string;
  ra: string;
  telefone?: string;
  email?: string;
  anoCurso?: number;
  ativo: boolean;
  idCurso?: number;
  curso?: {
    id: number;
    nome: string;
    anosMaximo: number;
  };
}
