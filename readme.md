# API ProjetoSisLabs - Documentação das Rotas

## Tabela de Conteúdos

- [Aluno](#aluno)
- [Curso](#curso)
- [Empréstimo](#empréstimo)
- [Evento](#evento)
- [Horário](#horário)
- [Laboratório](#laboratório)
- [Orientação](#orientação)
- [Permissão de Usuário](#permissão-de-usuário)
- [Professor](#professor)
- [Recado](#recado)
- [Registro](#registro)
- [Usuário](#usuário)

---

## Aluno

### GET /aluno/

**Descrição:** Lista todos os alunos ou busca por nome/RA

**Parâmetros Query (Opcionais):**

- `nome` (string): Nome para busca parcial
- `ra` (string): RA para busca parcial

**Restrições de Validação:**

- Nome: 3-40 caracteres, apenas letras e acentos
- RA: 5-13 caracteres, apenas números

**Resposta:** Array de alunos com informações do curso

---

### GET /aluno/:id

**Descrição:** Busca aluno por ID

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do aluno

**Resposta:** Dados do aluno específico

---

### POST /aluno/

**Descrição:** Cria novo aluno

**Parâmetros Body (Obrigatórios):**

- `nome` (string): Nome do aluno
- `ra` (string): Registro Acadêmico
- `anoCurso` (number): Ano do curso
- `senha` (string): Senha
- `idCurso` (number): ID do curso

**Parâmetros Body (Opcionais):**

- `telefone` (string): Telefone no formato "(dd) 99999-9999"
- `email` (string): Email (se não fornecido, usa RA@uepg.br)

**Restrições de Validação:**

- Nome: 3-40 caracteres, apenas letras e acentos
- RA: 5-13 caracteres, apenas números, único
- Telefone: formato "(dd) 99999-9999"
- Ano: 1-8
- Email: formato válido
- Senha: mínimo 6 caracteres

---

### POST /aluno/login

**Descrição:** Autentica aluno

**Parâmetros Body (Obrigatórios):**

- `ra` (string): Registro Acadêmico
- `senha` (string): Senha

---

### PUT /aluno/:id

**Descrição:** Atualiza dados do aluno

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do aluno

**Parâmetros Body (Opcionais):**

- `nome` (string): Nome do aluno
- `telefone` (string): Telefone
- `anoCurso` (number): Ano do curso
- `email` (string): Email
- `senha` (string): Nova senha
- `idCurso` (number): ID do curso

**Restrições:** Mesmas validações do POST

---

### DELETE /aluno/:id

**Descrição:** Remove aluno

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do aluno

---

## Curso

### GET /curso/

**Descrição:** Lista todos os cursos ou busca por nome

**Parâmetros Query (Opcionais):**

- `nome` (string): Nome para busca parcial

**Restrições de Validação:**

- Nome: 3-40 caracteres, apenas letras e acentos

---

### GET /curso/:id

**Descrição:** Busca curso por ID

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do curso

---

### POST /curso/

**Descrição:** Cria novo curso

**Parâmetros Body (Obrigatórios):**

- `nome` (string): Nome do curso
- `anosMax` (number): Anos máximos do curso

**Restrições de Validação:**

- Nome: 3-40 caracteres, apenas letras e acentos, único
- Anos máximos: 1-8

---

### PUT /curso/:id

**Descrição:** Atualiza curso

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do curso

**Parâmetros Body (Opcionais):**

- `nome` (string): Nome do curso
- `anosMax` (number): Anos máximos

**Restrições:** Mesmas validações do POST

---

### DELETE /curso/:id

**Descrição:** Remove curso

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do curso

---

## Empréstimo

### GET /emprestimo/

**Descrição:** Lista todos os empréstimos com relacionamentos

**Resposta:** Array de empréstimos com dados do usuário, laboratório e aluno

---

### GET /emprestimo/:id

**Descrição:** Busca empréstimo por ID

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do empréstimo

---

### POST /emprestimo/

**Descrição:** Cria novo empréstimo (entrada)

**Parâmetros Body (Obrigatórios):**

- `idLaboratorio` (number): ID do laboratório
- `idAluno` (number): ID do aluno
- `idUsuario` (number): ID do usuário responsável

---

### PUT /emprestimo/:id

**Descrição:** Atualiza empréstimo

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do empréstimo

**Parâmetros Body (Opcionais):**

- `advertencia` (string): Advertência
- Outros campos conforme modelo

---

### PUT /emprestimo/close/:id

**Descrição:** Finaliza empréstimo (saída)

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do empréstimo

---

## Evento

### GET /evento/

**Descrição:** Lista todos os eventos

---

### GET /evento/:id

**Descrição:** Busca evento por ID

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do evento

---

### POST /evento/

**Descrição:** Cria novo evento

**Parâmetros Body (Obrigatórios):**

- `nome` (string): Nome do evento
- `data` (Date): Data do evento
- `duracao` (number): Duração em horas
- `responsavel` (string): Nome do responsável
- `idLaboratorio` (number): ID do laboratório

**Restrições de Validação:**

- Nome: 5-40 caracteres
- Data: não pode ser no passado
- Duração: maior que zero
- Responsável: 5-40 caracteres

---

### PUT /evento/:id

**Descrição:** Atualiza evento

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do evento

**Parâmetros Body (Opcionais):**

- `nome` (string): Nome do evento
- `data` (Date): Data do evento
- `duracao` (number): Duração
- `responsavel` (string): Responsável
- `idLaboratorio` (number): ID do laboratório

**Restrições:** Mesmas validações do POST

---

### DELETE /evento/:id

**Descrição:** Remove evento

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do evento

---

## Horário

### GET /horario/

**Descrição:** Lista todos os horários

---

### GET /horario/:id

**Descrição:** Busca horário por ID

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do horário

---

### POST /horario/

**Descrição:** Cria novo horário

---

### PUT /horario/:id

**Descrição:** Atualiza horário

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do horário

---

### DELETE /horario/:id

**Descrição:** Remove horário

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do horário

---

## Laboratório

### GET /laboratorio/

**Descrição:** Lista todos os laboratórios

---

### GET /laboratorio/:id

**Descrição:** Busca laboratório por ID

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do laboratório

---

### POST /laboratorio/

**Descrição:** Cria novo laboratório

**Parâmetros Body (Obrigatórios):**

- `nome` (string): Nome do laboratório

**Restrições de Validação:**

- Nome: 3-40 caracteres, apenas letras, números e espaços

---

### PUT /laboratorio/:id

**Descrição:** Atualiza laboratório

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do laboratório

**Parâmetros Body (Opcionais):**

- `nome` (string): Nome do laboratório

---

### DELETE /laboratorio/:id

**Descrição:** Remove laboratório

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do laboratório

---

## Orientação

### GET /orientacao/

**Descrição:** Lista todas as orientações

---

### GET /orientacao/:id

**Descrição:** Busca orientação por ID

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID da orientação

---

### POST /orientacao/

**Descrição:** Cria nova orientação

**Parâmetros Body (Obrigatórios):**

- `dataFim` (Date): Data de fim
- `idAluno` (number): ID do aluno
- `idProfessor` (number): ID do professor
- `idLaboratorio` (number): ID do laboratório

**Parâmetros Body (Opcionais):**

- `dataInicio` (Date): Data de início (padrão: data atual)

**Restrições de Validação:**

- Data início deve ser anterior à data fim
- Aluno, professor e laboratório devem existir

---

### PUT /orientacao/:id

**Descrição:** Atualiza orientação

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID da orientação

**Parâmetros Body (Opcionais):**

- `dataInicio` (Date): Data de início
- `dataFim` (Date): Data de fim
- `idAluno` (number): ID do aluno
- `idProfessor` (number): ID do professor
- `idLaboratorio` (number): ID do laboratório

**Restrições:** Mesmas validações do POST

---

### DELETE /orientacao/:id

**Descrição:** Remove orientação

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID da orientação

---

## Permissão de Usuário

### GET /permissao/

**Descrição:** Lista todas as permissões ou busca por nome

**Parâmetros Query (Opcionais):**

- `nome` (string): Nome da permissão para busca

---

### GET /permissao/:id

**Descrição:** Busca permissão por ID

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID da permissão

---

### POST /permissao/

**Descrição:** Cria nova permissão

**Parâmetros Body (Obrigatórios):**

- `nomePermissao` (string): Nome da permissão

**Parâmetros Body (Opcionais):**

- `geral` (boolean): Permissão geral (padrão: false)
- `cadastro` (boolean): Permissão de cadastro (padrão: false)
- `alteracao` (boolean): Permissão de alteração (padrão: false)
- `relatorio` (boolean): Permissão de relatório (padrão: false)
- `advertencia` (boolean): Permissão de advertência (padrão: false)

**Restrições de Validação:**

- Nome: 3-40 caracteres, letras, números e espaços, único

---

### PUT /permissao/:id

**Descrição:** Atualiza permissão

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID da permissão

**Parâmetros Body (Opcionais):**

- `nomePermissao` (string): Nome da permissão
- `geral` (boolean): Permissão geral
- `cadastro` (boolean): Permissão de cadastro
- `alteracao` (boolean): Permissão de alteração
- `relatorio` (boolean): Permissão de relatório
- `advertencia` (boolean): Permissão de advertência

---

### DELETE /permissao/:id

**Descrição:** Remove permissão

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID da permissão

---

## Professor

### GET /professor/

**Descrição:** Lista todos os professores

---

### GET /professor/:id

**Descrição:** Busca professor por ID

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do professor

---

### POST /professor/

**Descrição:** Cria novo professor

**Parâmetros Body (Obrigatórios):**

- `nome` (string): Nome do professor

**Restrições de Validação:**

- Nome: 3-40 caracteres, apenas letras e acentos

---

### PUT /professor/:id

**Descrição:** Atualiza professor

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do professor

---

### DELETE /professor/:id

**Descrição:** Remove professor

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do professor

---

## Recado

### GET /recado/

**Descrição:** Lista todos os recados

---

### GET /recado/:id

**Descrição:** Busca recado por ID

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do recado

---

### POST /recado/

**Descrição:** Cria novo recado

**Parâmetros Body (Obrigatórios):**

- `texto` (string): Texto do recado

**Restrições de Validação:**

- Texto: obrigatório, máximo 1000 caracteres

---

### PUT /recado/:id

**Descrição:** Atualiza recado

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do recado

---

### DELETE /recado/:id

**Descrição:** Remove recado

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do recado

---

## Registro

### GET /registro/

**Descrição:** Lista todos os registros

---

### GET /registro/:id

**Descrição:** Busca registro por ID

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do registro

---

### GET /registro/user/:userId

**Descrição:** Lista registros por usuário

**Parâmetros de Rota (Obrigatórios):**

- `userId` (number): ID do usuário

---

### POST /registro/

**Descrição:** Cria novo registro

---

## Usuário

### GET /usuario/

**Descrição:** Lista todos os usuários

---

### GET /usuario/:id

**Descrição:** Busca usuário por ID

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do usuário

---

### POST /usuario/

**Descrição:** Cria novo usuário

**Parâmetros Body (Obrigatórios):**

- `nome` (string): Nome do usuário

**Restrições de Validação:**

- Nome: 3-40 caracteres, apenas letras e acentos

---

### POST /usuario/login

**Descrição:** Autentica usuário

---

### PUT /usuario/:id

**Descrição:** Atualiza usuário

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do usuário

---

### DELETE /usuario/:id

**Descrição:** Remove usuário

**Parâmetros de Rota (Obrigatórios):**

- `id` (number): ID do usuário

---

## Códigos de Status Utilizados

- `200` - OK: Operação realizada com sucesso
- `201` - Created: Recurso criado com sucesso
- `204` - No Content: Nenhum conteúdo encontrado
- `400` - Bad Request: Dados inválidos ou faltantes
- `404` - Not Found: Recurso não encontrado
- `409` - Conflict: Conflito (ex: dados duplicados)
- `500` - Internal Server Error: Erro interno do servidor

## Formato de Resposta

Todas as rotas retornam dados no formato:

```json
{
  "erros": ["array de mensagens de erro"],
  "data": "dados solicitados ou vazio",
  "status": "numero do status"
}
```
