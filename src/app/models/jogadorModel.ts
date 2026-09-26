export interface JogadorModel {
	IdJogador: number;
	IdEmpresa: number;
	NomeApelido: string;
	Senha: string;
	email: string;
	DataCadastro: Date;
	Ativo: boolean;
}