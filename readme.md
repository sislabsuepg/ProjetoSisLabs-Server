<div align="center">

# API ProjetoSisLabs

Documentação detalhada e gerada a partir do código-fonte atual (branch `main`).

</div>

> Esta versão substitui a documentação anterior e reflete fielmente validações, formatos de resposta e diferenças reais do código. Onde houver divergência entre README anterior e código, aqui prevalece o comportamento implementado.

## Sumário

1. [Visão Geral](#visão-geral)
2. [Autenticação & Segurança](#autenticação--segurança)
3. [Paginação](#paginação)
4. [Formato de Resposta](#formato-de-resposta)
5. [Entidades & Rotas](#entidades--rotas)
   - [Aluno](#aluno)
   - [Curso](#curso)
   - [Usuário](#usuário)
   - [Permissão de Usuário](#permissão-de-usuário)
   - [Laboratório](#laboratório)
   - [Empréstimo](#empréstimo)
   - [Evento](#evento)
   - [Horário](#horário)
   - [Orientação](#orientação)
   - [Professor](#professor)
   - [Recado](#recado)
   - [Registro](#registro)
   - [Email](#email)
   - [Home / Healthcheck](#home--healthcheck)
6. [Validações Resumidas](#validações-resumidas)
7. [Mensagens de Erro Comuns](#mensagens-de-erro-comuns)
8. [Inconsistências Conhecidas](#inconsistências-conhecidas)
9. [Melhorias Futuras Sugeridas](#melhorias-futuras-sugeridas)

---

## Visão Geral

API para gestão de uso dos laboratórios (SISLABS / UEPG): alunos, usuários administrativos, permissões, empréstimos de chave/acesso, eventos, horários, orientações acadêmicas, professores, recados e registros de atividade.

Stack principal: Node.js + Express + Sequelize (sequelize-typescript) + JWT + Cookies httpOnly.

## Autenticação & Segurança

| Tipo | Endpoint | Credenciais | Retorno | Observações |
|------|----------|-------------|---------|-------------|
| Login Aluno | `POST /aluno/login` | `ra`, `senha` (4–6 dígitos) | Cookie `authToken` + dados do aluno | Rejeita aluno inativo |
| Login Usuário | `POST /usuario/login` | `login`, `senha` (6–20 alfanum.) | Cookie `authToken` + dados do usuário | Rejeita usuário inativo |

Tokens são assinados com segredo definido em configuração (`config.secret`) e expiração (`config.expires`).

> IMPORTANTE: O middleware de autenticação (`alunoAutenticado`, `usuarioAutenticado`) **existe**, porém **não está aplicado nas rotas** atualmente – todas as rotas estão públicas no código presente.

## Paginação

Parâmetros de query aceitos onde indicado: `?page=<n>&items=<n>`.

Regra: se `page` ou `items` ausentes/invalidos → retorna todos.

| Campo | Tipo | Regra |
|-------|------|-------|
| page  | number >= 1 | Caso contrário ignorado |
| items | number > 0  | Caso contrário ignorado |

## Formato de Resposta

Formato uniforme atual (todas as rotas, exceto observação abaixo sobre ordem em Empréstimo):

Sucesso (com payload objeto ou lista):
```json
{ "erros": [], "data": { } }
```
ou
```json
{ "erros": [], "data": [] }
```

Falha:
```json
{ "erros": ["Mensagem de erro"], "data": null }
```

Exceção histórica: rotas de Empréstimo mantêm ordem `{ "data": ..., "erros": [] }` por retrocompatibilidade.

`/count` endpoints retornam `{ "count": <number> }`.

Status usados: 200, 201, 400, 401 (login usuário falho), 403 (login aluno sem token válido), 409 (conflito orientação), 500 (falhas internas). `204` definido mas não usado.

## Entidades & Rotas

### Aluno

Base: `/aluno/`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Lista ou busca por `nome` / `ra` + filtros `ativo`, paginação |
| GET | `/count` | Conta alunos (opcional `ativo=true|false`) |
| GET | `/:id` | Detalhe por ID |
| POST | `/` | Cria aluno |
| POST | `/login` | Autentica aluno |
| PUT | `/:id` | Atualiza campos (parciais) |
| DELETE | `/:id` | Remove aluno |

Campos criação obrigatórios: `nome`, `ra`, `anoCurso`, `senha`, `idCurso`.

Validações principais:
* RA: 5–13 dígitos, único.
* Nome: 3–40 letras/acentos.
* Senha: **4–6 dígitos numéricos** (difere do README antigo que dizia ≥6).
* Ano: 1–8.
* Telefone (se fornecido): 10–15 dígitos numéricos (sem formatação, ex: `42999999999`).
* Email (opcional; se omisso recebe `ra@uepg.br`), máx 40 chars.
* Atualização exige ao menos um campo.

### Curso

Base: `/curso/`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Lista (ou filtra por `nome`) |
| GET | `/count` | Contagem |
| GET | `/:id` | Detalhe |
| POST | `/` | Cria curso (`nome`, `anosMaximo`) |
| PUT | `/:id` | Atualiza (`nome` e/ou `anosMaximo`) |
| DELETE | `/:id` | Remove |

Validações: nome 3–40 letras; `anosMaximo` 1–8; nome único.

### Usuário

Base: `/usuario/`

| Método | Rota |
|--------|------|
| GET | `/` |
| GET | `/count` (filtro `ativo` opcional) |
| GET | `/:id` |
| POST | `/` |
| POST | `/login` |
| PUT | `/:id` |
| DELETE | `/:id` |

Criação: `login`, `senha`, `nome`, `idPermissao`.

Validações:
* login 3–20 somente letras, único
* senha 6–20 alfanumérica
* nome 3–40 letras/acentos
* permissão deve existir

### Permissão de Usuário

Base: `/permissao/`

| Método | Rota | Observação |
|--------|------|------------|
| GET | `/` | Lista (query `nomePermissao` parcial) |
| GET | `/count` | Contagem |
| GET | `/:id` | Detalhe |
| POST | `/` | Cria |
| PUT | `/:id` | Atualiza |
| DELETE | `/:id` | Remove |

Campos: `nomePermissao`, flags booleanas (`geral`, `cadastro`, `alteracao`, `relatorio`, `advertencia`). Nome 3–40 letras/números/espaços, único.

### Laboratório

Base: `/laboratorio/`

| Método | Rota |
|--------|------|
| GET | `/` |
| GET | `/count` |
| GET | `/:id` |
| POST | `/` |
| PUT | `/:id` |
| DELETE | `/:id` |

Criação: `numero`, `nome`, `restrito?`.

Validações:
* numero: obrigatório, alfanumérico, ≤8, único
* nome: 3–60, letras/números/espaços, único

### Empréstimo

Base: `/emprestimo/`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Lista (ordenado por `dataHoraEntrada` DESC) |
| GET | `/count` | Se `ativo=true` conta abertos (sem saída) |
| GET | `/:id` | Detalhe |
| POST | `/` | Cria (entrada) |
| PUT | `/close/:id` | Fecha (registra saída) |
| PUT | `/:id` | Atualiza `advertencia` |

Regras:
* Requer: `idLaboratorio`, `idAluno`, `idUsuario` (entrada).
* Laboratório restrito exige orientação ativa do aluno naquele laboratório.
* Usuário e aluno devem estar ativos.
* Fechamento: erro se já fechado.
* `posseChave = restrito`.
* Resposta ordem invertida (`data` antes de `erros`).

### Evento

Base: `/evento/`

| Método | Rota |
|--------|------|
| GET | `/` |
| GET | `/count` |
| GET | `/:id` |
| POST | `/` |
| PUT | `/:id` |
| DELETE | `/:id` |

Campos criação: `nome`, `dataEvento`, `duracao` (inteiro >0), `responsavel`, `idLaboratorio`.

Validações: nome 5–40; data futura; duração >0; responsável 5–40; laboratório existe.

### Horário

Base: `/horario/`

| Método | Rota | Observação |
|--------|------|------------|
| GET | `/` | Todos |
| GET | `/laboratorio/:id` | Por laboratório |
| GET | `/:id` | Detalhe |
| POST | `/` | Cria |
| PUT | `/:id` | Atribui professor / semestral |
| DELETE | `/:id` | Remove |

Campos: `diaSemana` (0–6), `horario` (HH:mm), `idLaboratorio`. Update: `idProfessor` e/ou `semestral`.

Nota: Comentários divergentes sobre o que é diaSemana=0 (código sugere Domingo; mensagem indica Segunda). Necessita padronização.

### Orientação

Base: `/orientacao/`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Lista (filtro `ativo=true` => `dataFim > now`) |
| GET | `/count` | Conta (ativo opcional) |
| GET | `/:id` | Detalhe |
| POST | `/` | Cria |
| PUT | `/:id` | Atualiza |
| DELETE | `/:id` | Remove |

Criação: `dataFim`, `idAluno`, `idProfessor`, `idLaboratorio`; `dataInicio` opcional (default agora). Controller impede criar se já houver orientação ativa do aluno (409).

Regras datas:
* `dataInicio < dataFim`.
* Update valida coerência: nova dataInicio não pode ≥ dataFim; nova dataFim deve ser > agora e > dataInicio.

### Professor

Base: `/professor/`

| Método | Rota | Observação |
|--------|------|------------|
| GET | `/` | Lista com paginação via `page` e `items` |
| GET | `/count` | Filtro `ativo` opcional |
| GET | `/:id` | Detalhe |
| POST | `/` | Cria |
| PUT | `/:id` | Atualiza |
| DELETE | `/:id` | Remove |

Validações: nome 3–40, email válido ≤40; ambos únicos.

### Recado

Base: `/recado/`

| Método | Rota |
|--------|------|
| GET | `/` |
| GET | `/count` |
| GET | `/:id` |
| POST | `/` |
| PUT | `/:id` |
| DELETE | `/:id` |

Validação: `texto` obrigatório (1–1000).

### Registro

Base: `/registro/`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Lista (ordenado por `dataHora` DESC) |
| GET | `/count` | Filtro `userId` opcional |
| GET | `/:id` | Detalhe |
| GET | `/user/:userId` | Por usuário |
| POST | `/` | Cria (dataHora = agora) |

Criação: `descricao` (até 100 chars – limite de model), `idUsuario` existente.

### Email

Base: `/email/`

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/` | Envia e-mail (advertência/comunicação) |

Campos: `to`, `subject`, `text`, (`html` opcional). Usa SMTP Gmail (`process.env.EMAIL`, `process.env.PASSWORD`).

Respostas:
* Sucesso: `{ success: true, message, data }`
* Falha validação: 400
* Erro interno: 500

### Home / Healthcheck

| Método | Rota | Retorno |
|--------|------|---------|
| GET | `/` | "Operante" |
| GET | `/test` | "Tudo certo :)" |

## Validações Resumidas

| Campo | Regra |
|-------|-------|
| RA (Aluno) | 5–13 dígitos, único |
| Senha Aluno | 4–6 dígitos numéricos |
| Senha Usuário | 6–20 alfanumérica |
| Nome (Aluno/Professor/Curso/Evento/Resp.) | Tamanho conforme entidade; apenas letras/acentos (curso sem números) |
| Email | Regex ampla, ≤40 |
| Telefone Aluno | 10–15 dígitos numéricos |
| Ano Curso | 1–8 |
| anosMaximo (Curso) | 1–8 |
| numero (Lab) | Alfanum., ≤8, único |
| nome (Lab) | 3–60 |
| nomePermissao | 3–40 letras/números/espaços, único |
| Evento.nome | 5–40 |
| Evento.data | Futuro |
| Evento.duracao | >0 |
| Horario.diaSemana | 0–6 |
| Horario.horario | HH:mm |
| Recado.texto | 1–1000 |
| Registro.descricao | ≤100 |
| Orientação datas | inicio < fim; fim futura (create) |
| Advertencia empréstimo | ≤255 chars (model) |

## Mensagens de Erro Comuns

* "Nenhum <entidade> encontrado"
* "<Entidade> não encontrado(a)"
* "RA já cadastrado"
* "Curso já existe"
* "Professor já cadastrado"
* "Permissão de usuario já existe"
* "Laboratório com o mesmo número ou nome já existe"
* "Aluno não possui orientação no laboratório"
* "Empréstimo já fechado"
* "Aluno não está ativo" / "Usuário inativo"
* "Login inválido" / "Senha inválida" / "senha inválida"
* "Dados incompletos" / "Dados faltantes" / "Pelo menos um campo deve ser informado"
* "Horario já existe para este laboratorio, dia e horário"
* "Já existe uma orientação ativa para este aluno"

## Inconsistências Conhecidas

| Tema | Observação |
|------|------------|
| Formato resposta | Padrão `{ erros, data }` em todas as rotas (Empréstimo mantém ordem inversa) |
| Professor lista | Padronizado: apenas `page` + `items` |
| Horário diaSemana | Historicamente ambíguo; definido: 0 = Segunda-feira |
| Middleware auth | Implementado mas não aplicado (todas rotas expostas) |
| Campo Evento | Body usa `dataEvento`, model armazena `data` |

## Melhorias Futuras Sugeridas

1. Aplicar middleware de autenticação nas rotas sensíveis.
2. Uniformizar formato de resposta (ordem consistente e inclusão opcional de `status`).
3. Normalizar mensagens de erro (capitalização, idioma único, evitar variações de "usuario/usuário").
4. Adicionar testes automatizados de contrato (ex: Supertest) para garantir estabilidade de respostas.
5. Centralizar esquema de resposta em middleware.

### Detalhamento (Itens 4 e 5 – planejamento)

**Item 4 – Testes de Contrato / Supertest**
Objetivo: Garantir que mudanças futuras não quebrem o contrato público.
Escopo inicial sugerido:
* Suites por recurso (Aluno, Usuário, Laboratório, Empréstimo...)
* Casos mínimos: criação válida, validação inválida, busca paginada, detalhe inexistente, update parcial, delete, fluxos específicos (fechamento de empréstimo, login, restrição de laboratório restrito sem orientação)
* Testar headers/cookies de autenticação após implementar middleware
* Cobrir códigos de status e shape JSON (usar matcher parcial para tolerar campos extras)
Pipeline:
* Executar em CI antes de merge (branch protection)
Ferramentas:
* Jest + Supertest
* Factories simples para dados (ou seeds controlados)

**Item 5 – Middleware de Resposta Uniforme**
Objetivo: Reduzir duplicação e prevenir inconsistências (ex: ordem de chaves em Empréstimo).
Abordagem:
1. Criar utilitário `respond(res, { data, erros, status? })`
2. Padrão único: `{ success: boolean, erros: string[], data: any }`
3. Converter controllers gradualmente (pull requests pequenos)
4. Log centralizado de erros (winston/pino) antes de enviar resposta
5. Hook opcional para métricas (contar erros por rota)
Considerações:
* Manter compatibilidade durante transição com feature flag
* Documentar alteração no CHANGELOG

## Exemplos de Requisições

### Criar Aluno
```http
POST /aluno/
Content-Type: application/json

{
  "nome": "Maria Silva",
  "ra": "123456",
  "anoCurso": 2,
  "senha": "1234",
  "idCurso": 1,
  "telefone": "4299999999"
}
```

### Login Usuário
```http
POST /usuario/login
Content-Type: application/json

{ "login": "admin", "senha": "Senha123" }
```

### Criar Empréstimo
```http
POST /emprestimo/
Content-Type: application/json

{ "idLaboratorio": 2, "idAluno": 5, "idUsuario": 1 }
```

### Fechar Empréstimo
```http
PUT /emprestimo/close/10
Content-Type: application/json

{ "idUsuario": 1 }
```

### Criar Evento
```http
POST /evento/
Content-Type: application/json

{
  "nome": "Workshop IA",
  "dataEvento": "2025-12-01T14:00:00.000Z",
  "duracao": 120,
  "responsavel": "Prof. João",
  "idLaboratorio": 3
}
```

---

### Histórico

Esta documentação foi gerada e revisada em: **2025-09-01**.

---

Se encontrar divergência entre este documento e o comportamento real em produção, abra uma issue descrevendo o endpoint e payload utilizado.

---

© UEPG / SISLABS
