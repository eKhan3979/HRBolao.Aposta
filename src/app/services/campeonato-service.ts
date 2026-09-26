import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CampeonatoModel } from '../models/campeonatoModel';
import { CampeonatoRetornoDto } from '../models/campeonatoRetornoDto';
import { RodadaAtualDto } from '../models/rodadaAtualDto';
import { RodadaDto } from '../models/rodadaDto'

@Injectable({
  providedIn: 'root'
})
export class CampeonatoService {
    private linkBase = "https://lightcyan-echidna-380972.hostingersite.com/bolao/";

    constructor(private http: HttpClient) {
    }

    campeonatoRodadaAtual(idCampeonato: number) {
        return this.http.get<RodadaAtualDto[]>(this.linkBase + "rodadaAtual/" + idCampeonato);
    }

    campeonatoRodadas(idCampeonato: number) {
        return this.http.get<RodadaDto[]>(this.linkBase + "campeonatoRodadas/" + idCampeonato);
    }

    gravar(campeonato: CampeonatoModel): Observable<CampeonatoRetornoDto[]> {
        return this.http.get<CampeonatoRetornoDto[]>(this.linkBase + "campeonatoGravar/" +
                campeonato.IdCampeonato + "/" + campeonato.Nome + "/" + campeonato.Ano + "/" + campeonato.Ativo);
    }

    listaCampeonatos() {
        return this.http.get<CampeonatoModel[]>(this.linkBase + "campeonatos");
    }

    timesDoCampeonato(idCampeonato: number) {
        return this.http.get<CampeonatoModel[]>(this.linkBase + "timescampeonato/" + idCampeonato);
    }
}