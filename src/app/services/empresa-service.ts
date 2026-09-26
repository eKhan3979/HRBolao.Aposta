import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EmpresaModel } from '../models/empresaModel';
import { RankingModel } from '../models/rankingModel';
import { RankingEmpresaModel } from '../models/rankingEmpresaModel';

@Injectable({
    providedIn: 'root'
})
export class EmpresaService {
    private linkBase = "https://lightcyan-echidna-380972.hostingersite.com/bolao/";

    constructor(private http: HttpClient) {}

    empresaGet(idEmpresa: number) {
        return this.http.get<EmpresaModel[]>(this.linkBase + "empresaGet/" + idEmpresa);
    }

    empresaCampeonatoRanking(idEmpresa: number, idCampeonato: number) {
        return this.http.get<RankingEmpresaModel[]>(this.linkBase + "empresaRanking/" + idEmpresa + "/" + idCampeonato);
    }

    listaEmpresas() {
        return this.http.get<EmpresaModel[]>(this.linkBase + "empresas");
    }
}