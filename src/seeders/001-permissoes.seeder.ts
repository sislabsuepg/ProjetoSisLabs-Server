import PermissaoUsuario from "../models/PermissaoUsuario.js";

export async function seedPermissoes() {
  const existentes = await PermissaoUsuario.count();
  if (existentes > 0) {
    console.log("[seed] Permissoes já existem, pulando");
    return;
  }
  const perfis = [
    {
      nomePermissao: "Admin Geral",
      geral: true,
      cadastro: true,
      alteracao: true,
      relatorio: true,
      advertencia: true,
      ativo: true,
    },
    {
      nomePermissao: "Admin",
      geral: false,
      cadastro: true,
      alteracao: true,
      relatorio: true,
      advertencia: false,
      ativo: true,
    },
    {
      nomePermissao: "Comum",
      geral: false,
      cadastro: true,
      alteracao: true,
      relatorio: false,
      advertencia: true,
      ativo: true,
    },
    {
      nomePermissao: "Professor",
      geral: false,
      cadastro: false,
      alteracao: false,
      relatorio: true,
      advertencia: false,
      ativo: true,
    },
    {
      nomePermissao: "temporario",
      geral: false,
      cadastro: false,
      alteracao: false,
      relatorio: false,
      advertencia: false,
      ativo: true,
    },
  ];

  await PermissaoUsuario.bulkCreate(perfis);
  console.log("[seed] Permissoes inseridas");
}
