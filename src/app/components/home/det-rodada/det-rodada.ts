import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { CampeonatoModel } from '../../../models/campeonatoModel';
import { EmpresaModel } from '../../../models/empresaModel';
import { JogadorPontosRodadaDto } from '../../../models/jogadorPontosRodadaDto';
import { PontosRodadaDto } from '../../../models/pontosRodadaDto';
import { RankingEmpresaModel } from '../../../models/rankingEmpresaModel';

import { ApostaService } from '../../../services/aposta-service';

@Component({
  selector: 'app-det-rodada',
  imports: [
    CommonModule
  ],
  templateUrl: './det-rodada.html',
  styleUrl: './det-rodada.css',
})
export class DetRodada {
  campeonato: CampeonatoModel = undefined as unknown as CampeonatoModel;
  listaJogos: JogadorPontosRodadaDto[] = undefined as unknown as JogadorPontosRodadaDto[];
  listaRodada: PontosRodadaDto[] = undefined as unknown as PontosRodadaDto[];
  ranking: RankingEmpresaModel = undefined as unknown as RankingEmpresaModel;
  rodada: number = 0;

  constructor(private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private apostaService: ApostaService,
              @Inject(MAT_DIALOG_DATA) public data: {
                campeonato: CampeonatoModel;
                empresa: EmpresaModel,
                ranking: RankingEmpresaModel,
                rodada: number
              }) {
                this.campeonato = this.data.campeonato;
                this.ranking = this.data.ranking;
                this.rodada = this.data.rodada;
  }
    
  ngOnInit(): void {
    this.apostaService
        .jogadorPontosRodada(this.data.ranking.IdJogador, this.data.campeonato.IdCampeonato, this.data.rodada)
        .subscribe(dados => {
          this.listaJogos = dados;
          console.log(this.listaJogos);
          this.cdr.markForCheck();
        });
  }
}