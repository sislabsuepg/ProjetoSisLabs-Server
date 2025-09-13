import "reflect-metadata";
import connection from "../database/index.js";
import { seedPermissoes } from "./001-permissoes.seeder.js";
import { seedUsuarios } from "./002-usuarios.seeder.js";
import { seedCursos } from "./003-cursos.seeder.js";
import { seedProfessores } from "./004-professores.seeder.js";
import { seedLaboratorios } from "./005-laboratorios.seeder.js";
import { seedAlunos } from "./006-alunos.seeder.js";
import { seedEventos } from "./007-eventos.seeder.js";
import { seedHorarios } from "./008-horarios.seeder.js";
import { seedOrientacoes } from "./009-orientacoes.seeder.js";
import { seedEmprestimos } from "./010-emprestimos.seeder.js";
import { seedRegistros } from "./011-registros.seeder.js";
import { seedRecados } from "./012-recados.seeder.js";

async function main() {
  const truncate = process.argv.includes("--fresh");
  try {
    console.time("[seed] total");
    await connection.authenticate();
    console.log("[seed] Conectado ao banco");

    if (truncate) {
      console.log("[seed] Limpando tabelas (truncate)");
      // Ordem reversa por FK simples
      const tables = [
        "registro",
        "emprestimo",
        "orientacao",
        "horario",
        "evento",
        "aluno",
        "laboratorio",
        "professor",
        "usuario",
        "permissaoUsuario",
        "curso",
        "recado",
      ];
      for (const t of tables) {
        try {
          await connection.query(
            `TRUNCATE TABLE "${t}" RESTART IDENTITY CASCADE;`
          );
        } catch (e) {
          console.warn("[seed] Falha ao truncar", t, e);
        }
      }
    }

    await seedPermissoes();
    await seedUsuarios();
    await seedCursos();
    await seedProfessores();
    await seedLaboratorios();
    await seedAlunos();
    await seedEventos();
    await seedHorarios();
    await seedOrientacoes();
    await seedEmprestimos();
    await seedRegistros();
    await seedRecados();

    console.timeEnd("[seed] total");
  } catch (e) {
    console.error("[seed] Erro geral", e);
  } finally {
    await connection.close();
    console.log("[seed] Conexão encerrada");
  }
}

main();
