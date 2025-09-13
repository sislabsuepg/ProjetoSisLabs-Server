export default interface IUsuario {
    id: number,
    nome: string,
    login: string,
    ativo: boolean,
    idPermissao: number,
    permissaoUsuario: {
        id: number,
        nomePermissao: string,
        geral: boolean,
        cadastro: boolean,
        alteracao: boolean,
        relatorio: boolean,
        advertencia: boolean
    }
}