import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApostaIdDto } from '../models/apostaIdDto';
import { JogadorApostaRodadaDto } from '../models/jogadorApostaRodadaDto';
import { PontosRodadaDto } from '../models/pontosRodadaDto';
import { RankingEmpresaModel } from '../models/rankingEmpresaModel';
import { RankingEmpresaCampeonatoDto } from '../models/rankingEmpresaCampeonatoDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
    private linkBase = "https://lightcyan-echidna-380972.hostingersite.com/bolao/";

    constructor(private http: HttpClient) { }

    apostaGravar(idAposta:number, idCampeonatoJogo: number, idJogador: number, golsTimeCasa: number, golsTimeVisitante: number) {
        let id = 0;

        if (idAposta != null) {
            id = idAposta;
        }

        return this.http.get<ApostaIdDto[]>(this.linkBase + "apostaGravar" + "/" +  id + "/" + idCampeonatoJogo + "/" + idJogador + "/" + golsTimeCasa + "/" + golsTimeVisitante);
    }

    apostasRankingCampeonato(idEmpresa: number, idCampeonato: number) {
        return this.http.get<RankingEmpresaCampeonatoDto[]>(this.linkBase + "apostasRankingCampeonato/" + idEmpresa + "/" + idCampeonato);
    }

    jogadorApostasCampeonato(idJogador: number, idCampeonato: number) {
        return this.http.get<PontosRodadaDto[]>(this.linkBase + "apostasJogadorCampeonato/" + idJogador + "/" + idCampeonato);
    }

    jogadorApostasRodada(idJogador: number, idCampeonato: number, rodada: number) {
        return this.http.get<JogadorApostaRodadaDto[]>(this.linkBase + "apostasJogadorRodada/" + idJogador + "/" + idCampeonato + "/" + rodada);
    }

    rankingRodada(idEmpresa: number, idCampeonato: number, rodada: number): Observable<RankingEmpresaModel[]> {
        return this.http.get<RankingEmpresaModel[]>(this.linkBase + "rankingRodada/" + idEmpresa + "/" + idCampeonato + "/" + rodada);
    }
}