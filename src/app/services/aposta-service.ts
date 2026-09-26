import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { JogadorApostaRodadaDto } from '../models/jogadorApostaRodadaDto';
import { JogadorPontosRodadaDto } from '../models/jogadorPontosRodadaDto';

@Injectable({
  providedIn: 'root'
})
export class ApostaService {
    private linkBase = "https://lightcyan-echidna-380972.hostingersite.com/bolao/";

    constructor(private http: HttpClient) { }

    apostasJogadorRodada(idJogador: number, idCampeonato: number, rodada: number) {
        return this.http.get<JogadorApostaRodadaDto[]>(this.linkBase + "apostasJogadorRodada/" + idJogador + "/" + idCampeonato + "/" + rodada);
    }

    jogadorPontosRodada(idJogador: number, idCampeonato: number, rodada: number) {
        return this.http.get<JogadorPontosRodadaDto[]>(this.linkBase + "JogadorPontosRodada/" + idJogador + "/" + idCampeonato + "/" + rodada);
    }
}