import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { CampeonatoModel } from '../../../models/campeonatoModel';
import { EmpresaModel } from '../../../models/empresaModel';
import { PontosRodadaDto } from '../../../models/pontosRodadaDto';
import { RankingEmpresaModel } from '../../../models/rankingEmpresaModel';
import { RankingModel } from '../../../models/rankingModel';

import { HomeService } from '../../../services/home-service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule
  ],
  templateUrl: './detalhes.html',
  styleUrl: './detalhes.css',
})
export class Detalhes implements OnInit {
  campeonato: CampeonatoModel = undefined as unknown as CampeonatoModel;
  listaRanking: RankingModel[] = undefined as unknown as RankingModel[];
  listaRodada: PontosRodadaDto[] = undefined as unknown as PontosRodadaDto[];
  ranking: RankingEmpresaModel = undefined as unknown as RankingEmpresaModel;

  constructor(private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private homeService: HomeService,              
              @Inject(MAT_DIALOG_DATA) public data: {
                campeonato: CampeonatoModel;
                empresa: EmpresaModel,
                ranking: RankingEmpresaModel
              },
              public dialogRef: MatDialogRef<Detalhes>) {
                this.campeonato = this.data.campeonato;
                this.ranking = this.data.ranking;
  }
    
  ngOnInit(): void {
    this.homeService
        .jogadorApostasCampeonato(this.data.ranking.IdJogador, this.data.campeonato.IdCampeonato)
        .subscribe(dados => {
          this.listaRodada = dados;
          this.cdr.markForCheck();
        });
  }  

  fechar() {
    this.dialogRef.close();
  }
}