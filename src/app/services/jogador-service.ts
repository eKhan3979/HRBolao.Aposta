import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CampeonatoModel } from '../models/campeonatoModel';
import { JogadorModel } from '../models/jogadorModel';
import { LoginRequestDto } from '../models/loginRequestDto';
import { LoginResponseDto } from '../models/loginResponseDto';
import { RankingModel } from '../models/rankingModel';

@Injectable({
    providedIn: 'root'
})
export class JogadorService {
    private linkBase = "https://lightcyan-echidna-380972.hostingersite.com/bolao/";

    constructor(private http: HttpClient) {}

    campeonatosDaEmpresa(idEmpresa: number) {
        return this.http.get<CampeonatoModel[]>(this.linkBase + "campeonatosDaEmpresa/" + idEmpresa);
    }

    empresaCampeonatoRanking(idEmpresa: number, idCampeonato: number) {
        return this.http.get<RankingModel[]>(this.linkBase + "empresaRanking/" + idEmpresa + "/" + idCampeonato);
    }

    jogadorChange(idJogador: number, senha: string) {
        return this.http.get(this.linkBase + "jogadorChange/" + idJogador + "/" + senha);
    }

    jogadorGravar(jogador: JogadorModel) {
        if (jogador.IdJogador == 0) {
            return this.http.get<[]>(this.linkBase + "jogadorGravar/" + jogador.IdJogador + "/" + jogador.IdEmpresa + "/" + jogador.NomeApelido + "/" + jogador.Senha + "/" + jogador.email);
        } else {
            return this.http.get<[]>(this.linkBase + "jogadorGravar/" + jogador.IdJogador + "/" + jogador.IdEmpresa + "/" + jogador.NomeApelido + "/" + jogador.Senha + "/" + jogador.email);
        }
    }

    jogadorListaEmpresa(idEmpresa: number) {
        return this.http.get<JogadorModel[]>(this.linkBase + "jogadorListaEmpresa/" + idEmpresa);
    }

    jogadorLogin(idEmpresa: number, nomeApelido: string, senha: string) {
        return this.http.get(this.linkBase + "jogadorLogin/" + idEmpresa + "/" + nomeApelido + "/" + senha);
    }

    loginToken(email: string, senha: string) {
        let retorno = this.http.get(this.linkBase + "loginToken/" + email + "/" + senha);
        return retorno;
    }
}