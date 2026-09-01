# API SISLABS

API back-end para gestão de laboratórios acadêmicos da UEPG, com controle de alunos, usuários administrativos, permissões, horários, eventos, orientações, empréstimos de chaves, relatórios e notificações.

## Stack

- Node.js
- Express
- JWT
- TypeScript
- Sequelize + Sequelize TypeScript
- PostgreSQL

## Visão geral da arquitetura

A aplicação expõe rotas por recurso, com autenticação e autorização por middleware. A resposta padrão segue a estrutura:

```json
{
  "erros": [],
  "data": {}
}
```

Em caso de falha:

```json
{
  "erros": ["Mensagem de erro"],
  "data": null
}
```

## Autenticação

### Login de aluno

- POST /aluno/login
- Campos: ra, senha
- Em caso de sucesso, a API retorna cookie authToken e os dados do aluno.

### Login de usuário

- POST /usuario/login
- Campos: login, senha
- Em caso de sucesso, a API retorna cookie authToken e os dados do usuário.

### Middlewares principais

- interceptUserCookie: valida sessão de usuário administrativo.
- interceptAlunoCookie: valida sessão de aluno.
- lockPath: bloqueia ações por tipo de permissão.

## Padronização das rotas

O projeto usa convenção simples e consistente por recurso:

- Base por entidade: /aluno, /curso, /laboratorio, /professor, etc.
- Endpoints de listagem e contagem: / e /count
- Endpoints de detalhe: /:id ou /:ra quando a chave natural é o RA
- Ações específicas continuam no mesmo recurso: /reset, /login, /close/:id, /laboratorio/:id, /aluno/:idAluno

## Rotas por módulo

### Aluno

| Método | Rota                         | Descrição                             |
| ------ | ---------------------------- | ------------------------------------- |
| GET    | /aluno/                      | Lista alunos e filtros por nome/RA    |
| GET    | /aluno/count                 | Conta alunos                          |
| GET    | /aluno/:ra                   | Busca por RA                          |
| GET    | /aluno/laboratorios/:idAluno | Laboratórios disponíveis para o aluno |
| GET    | /aluno/advertencias/:idAluno | Advertências do aluno                 |
| POST   | /aluno/login                 | Login do aluno                        |
| POST   | /aluno/                      | Cadastro de aluno                     |
| PUT    | /aluno/:id                   | Atualização do aluno                  |
| PUT    | /aluno/perfil/:idAluno       | Atualização do perfil                 |
| PUT    | /aluno/senha/:idAluno        | Alteração de senha                    |
| POST   | /aluno/resetarsenha/:id      | Reset de senha                        |
| DELETE | /aluno/:id                   | Exclusão                              |

### Usuário

| Método | Rota                      | Descrição          |
| ------ | ------------------------- | ------------------ |
| GET    | /usuario/                 | Lista usuários     |
| GET    | /usuario/count            | Conta usuários     |
| GET    | /usuario/:id              | Detalhe            |
| POST   | /usuario/login            | Login de usuário   |
| POST   | /usuario/                 | Cadastro           |
| PUT    | /usuario/:id              | Atualização        |
| PUT    | /usuario/senha/:id        | Alteração de senha |
| POST   | /usuario/resetarsenha/:id | Reset de senha     |
| DELETE | /usuario/:id              | Exclusão           |

### Curso

| Método | Rota         | Descrição    |
| ------ | ------------ | ------------ |
| GET    | /curso/      | Lista cursos |
| GET    | /curso/count | Contagem     |
| GET    | /curso/:id   | Detalhe      |
| POST   | /curso/      | Cadastro     |
| PUT    | /curso/:id   | Atualização  |
| DELETE | /curso/:id   | Exclusão     |

### Permissão de usuário

| Método | Rota             | Descrição        |
| ------ | ---------------- | ---------------- |
| GET    | /permissao/      | Lista permissões |
| GET    | /permissao/count | Contagem         |
| GET    | /permissao/:id   | Detalhe          |
| POST   | /permissao/      | Cadastro         |
| PUT    | /permissao/:id   | Atualização      |
| DELETE | /permissao/:id   | Exclusão         |

### Laboratório

| Método | Rota               | Descrição          |
| ------ | ------------------ | ------------------ |
| GET    | /laboratorio/      | Lista laboratórios |
| GET    | /laboratorio/count | Contagem           |
| GET    | /laboratorio/:id   | Detalhe            |
| POST   | /laboratorio/      | Cadastro           |
| PUT    | /laboratorio/:id   | Atualização        |
| DELETE | /laboratorio/:id   | Exclusão           |

### Empréstimo

| Método | Rota                  | Descrição                |
| ------ | --------------------- | ------------------------ |
| GET    | /emprestimo/          | Lista empréstimos        |
| GET    | /emprestimo/count     | Contagem                 |
| GET    | /emprestimo/:id       | Detalhe                  |
| POST   | /emprestimo/          | Cria registro de entrada |
| PUT    | /emprestimo/:id       | Atualiza advertência     |
| PUT    | /emprestimo/close/:id | Fecha empréstimo         |

### Evento

| Método | Rota          | Descrição     |
| ------ | ------------- | ------------- |
| GET    | /evento/      | Lista eventos |
| GET    | /evento/count | Contagem      |
| GET    | /evento/:id   | Detalhe       |
| POST   | /evento/      | Cadastro      |
| PUT    | /evento/:id   | Atualização   |
| DELETE | /evento/:id   | Exclusão      |

### Horário

| Método | Rota                     | Descrição                |
| ------ | ------------------------ | ------------------------ |
| GET    | /horario/                | Lista horários           |
| GET    | /horario/laboratorio/:id | Horários por laboratório |
| GET    | /horario/dia/:diaSemana  | Horários por dia         |
| GET    | /horario/:id             | Detalhe                  |
| POST   | /horario/                | Cadastro                 |
| PUT    | /horario/:id             | Atualização              |
| DELETE | /horario/:id             | Exclusão                 |

### Orientação

| Método | Rota                       | Descrição             |
| ------ | -------------------------- | --------------------- |
| GET    | /orientacao/               | Lista orientações     |
| GET    | /orientacao/count          | Contagem              |
| GET    | /orientacao/:id            | Detalhe               |
| GET    | /orientacao/aluno/:idAluno | Orientações por aluno |
| POST   | /orientacao/               | Cadastro              |
| PUT    | /orientacao/:id            | Atualização           |
| DELETE | /orientacao/:id            | Exclusão              |

### Professor

| Método | Rota             | Descrição         |
| ------ | ---------------- | ----------------- |
| GET    | /professor/      | Lista professores |
| GET    | /professor/count | Contagem          |
| GET    | /professor/:id   | Detalhe           |
| POST   | /professor/      | Cadastro          |
| PUT    | /professor/:id   | Atualização       |
| DELETE | /professor/:id   | Exclusão          |

### Recado

| Método | Rota          | Descrição     |
| ------ | ------------- | ------------- |
| GET    | /recado/      | Lista recados |
| GET    | /recado/count | Contagem      |
| GET    | /recado/:id   | Detalhe       |
| POST   | /recado/      | Cadastro      |
| PUT    | /recado/:id   | Atualização   |
| DELETE | /recado/:id   | Exclusão      |

### Registro

| Método | Rota            | Descrição       |
| ------ | --------------- | --------------- |
| GET    | /registro/      | Lista registros |
| GET    | /registro/count | Contagem        |

### E-mail

| Método | Rota    | Descrição                                     |
| ------ | ------- | --------------------------------------------- |
| POST   | /email/ | Envio de e-mail de advertência ou comunicação |

### Relatórios

| Método | Rota                         | Descrição                     |
| ------ | ---------------------------- | ----------------------------- |
| GET    | /relatorio/academico         | Relatório acadêmico           |
| GET    | /relatorio/academicoPorCurso | Relatório acadêmico por curso |
| GET    | /relatorio/emprestimo        | Relatório de empréstimos      |

### Solicitações

| Método | Rota           | Descrição            |
| ------ | -------------- | -------------------- |
| POST   | /solicitacoes/ | Cria solicitação     |
| PUT    | /solicitacoes/ | Responde solicitação |
| GET    | /solicitacoes/ | Lista solicitações   |

### Reset de sistema

| Método | Rota           | Descrição                   |
| ------ | -------------- | --------------------------- |
| POST   | /reseter/reset | Reinicialização de horarios |

## Regras de negócio relevantes

- Aluno e usuário devem estar ativos para determinadas operações.
- Empréstimos restritos exigem orientação ativa no laboratório.
- Usuários e alunos passam por validação de sessão e permissões por middleware.
- Endpoints de contagem usam /count e retornam um objeto com count.

## Exemplos de uso

### Cadastrar aluno

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

### Login de usuário

```http
POST /usuario/login
Content-Type: application/json

{
  "login": "admin",
  "senha": "Senha123"
}
```

### Criar empréstimo

```http
POST /emprestimo/
Content-Type: application/json

{
  "idLaboratorio": 2,
  "idAluno": 5,
  "idUsuario": 1
}
```

## Observações finais

Este documento foi revisado em 31/08/2026.

- Padronização da descrição das rotas
- Limpeza da documentação

© UEPG / SISLABS
