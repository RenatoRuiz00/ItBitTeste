export interface IUsuario {
    UsuarioId: number,
    Nome: string,
    DataNascimento: Date,
    Email: string,
    Senha: string,
    Ativo: boolean,
    SexoId: number,
    Sexo: string
}