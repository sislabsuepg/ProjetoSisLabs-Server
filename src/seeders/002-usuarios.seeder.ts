import { faker } from "@faker-js/faker";
import Usuario from "../models/Usuario.js";
import PermissaoUsuario from "../models/PermissaoUsuario.js";

export async function seedUsuarios() {
  const count = await Usuario.count();
  if (count > 0) {
    console.log("[seed] Usuarios já existem, pulando");
    return;
  }

  const permissoes = await PermissaoUsuario.findAll();
  const mapPerm = new Map(permissoes.map((p) => [p.nomePermissao, p.id]));

  const base = [
    { login: "admin", nome: "Administrador Geral", perfil: "Admin Geral" },
    { login: "gestor1", nome: "Gestor Principal", perfil: "Admin" },
    { login: "gestor2", nome: "Gestor Secundario", perfil: "Comum" },
    { login: "atendente1", nome: "Atendente A", perfil: "Professor" },
    { login: "atendente2", nome: "Atendente B", perfil: "temporario" },
    {
      login: "profview1",
      nome: "Professor Viewer 1",
      perfil: "Professor",
    },
    {
      login: "profview2",
      nome: "Professor Viewer 2",
      perfil: "Professor",
    },
    { login: "auditor1", nome: "Auditor Interno", perfil: "Admin" },
    { login: "auditor2", nome: "Auditor Externo", perfil: "Admin" },
    { login: "suporte", nome: "Usuario Suporte", perfil: "Admin Geral" },
  ];

  const usuarios = base.map((u) => ({
    login: u.login,
    senha: "senha123",
    nome: u.nome,
    ativo: true,
    idPermissao: mapPerm.get(u.perfil) as number,
  }));

  await Usuario.bulkCreate(usuarios);
  console.log("[seed] Usuarios inseridos");
}
