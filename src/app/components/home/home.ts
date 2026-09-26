import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';

import { CampeonatoModel } from '../../models/campeonatoModel';
import { EmpresaModel } from '../../models/empresaModel';
import { JogadorApostaRodadaDto } from '../../models/jogadorApostaRodadaDto';
import { JogadorModel } from '../../models/jogadorModel';
import { RankingEmpresaModel } from '../../models/rankingEmpresaModel';
import { RodadaDto } from '../../models/rodadaDto';

import { CampeonatoService } from '../../services/campeonato-service';
import { EmpresaService } from '../../services/empresa-service';
import { HomeService } from '../../services/home-service';

import { Detalhes } from '../../components/home/detalhes/detalhes';
import { DetRodada } from '../../components/home/det-rodada/det-rodada';
import { TrocarSenha } from './trocar-senha/trocar-senha';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  empresaSelecionada: EmpresaModel = undefined as unknown as EmpresaModel;
  campeonatoDetalhes: CampeonatoModel = undefined as unknown as CampeonatoModel;
  campeonatoSelecionado: string = undefined as unknown as string;
  gravarDesabilitado: boolean = true;
  jogadorLogado: JogadorModel = undefined as unknown as JogadorModel;
  rodadaAtual: number = undefined as unknown as number;
  rodadaFinalizada: boolean = undefined as unknown as boolean;
  rodadaSelecionada: string = undefined as unknown as string;
  totalPontosRodada: number = 0;

  listaApostas: JogadorApostaRodadaDto[] = undefined as unknown as JogadorApostaRodadaDto[];
  listaCampeonatos: CampeonatoModel[] = undefined as unknown as CampeonatoModel[];
  listaCampeonatosStr: string[] = undefined as unknown as string[];
  listaRanking: RankingEmpresaModel[] = undefined as unknown as RankingEmpresaModel[];
  listaRankingRodada: RankingEmpresaModel[] = undefined as unknown as RankingEmpresaModel[];
  listaRodadas: RodadaDto[] = undefined as unknown as RodadaDto[];

  constructor(private campeonatoService: CampeonatoService,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private empresaService: EmpresaService,
              private homeService: HomeService,
              private router: Router,
              private snack: MatSnackBar) {
    this.jogadorLogado = history.state.jogador;
  }

  ngOnInit(): void {
    try {
      this.empresaService
          .empresaGet(this.jogadorLogado.IdEmpresa)
          .subscribe(dados => {
              let lista = dados;
              this.cdr.markForCheck();

              if (lista.length > 0) 
                this.empresaSelecionada = lista[0];
          });    

      this.campeonatoService.listaCampeonatos()
          .subscribe(dados => {
              this.listaCampeonatos = dados;

              let listaStr = this.listaCampeonatos
                                 .map(t => t.Nome + ' - ' + t.Ano);

              listaStr.unshift("(Selecione o campeonato)");

              this.listaCampeonatosStr = listaStr;

              this.cdr.markForCheck();
          });
    } catch (e) {
      this.snack.open("- Erro na inicialização: " + e,
                      "Fechar",
                      {
                          duration: 5000,
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom'
                      });
    }
  }

  carregarCampeonato() {
    try {
      let index = this.listaCampeonatos.findIndex(t => (t.Nome + " - " + t.Ano) == this.campeonatoSelecionado);
      /*
      if ((index < 0) && (this.listaCampeonatos.length > 1)) {
        index = 0;
      }
      */
      
      if (index >= 0) {
        this.campeonatoDetalhes =  this.listaCampeonatos[index];

        this.listaRanking = [];
        this.listaRankingRodada = [];
        this.listaRodadas = [];      

        this.empresaService
            .empresaCampeonatoRanking(this.empresaSelecionada.IdEmpresa, this.campeonatoDetalhes.IdCampeonato)
            .subscribe(dados => {
                let lista = dados;
                this.cdr.markForCheck();

                for (let index = 0; index < lista.length; index++)
                  lista[index].Posicao = index + 1;

                this.listaRanking = lista;

                this.campeonatoService
                    .campeonatoRodadas(this.campeonatoDetalhes.IdCampeonato)
                    .subscribe(dados => {
                        let lista = dados;

                        lista.unshift({
                          Rodada: 0,
                          RodadaNome: ""
                        });

                        this.listaRodadas = lista;
                        this.rodadaSelecionada = this.listaRodadas[this.listaRodadas.length - 1].RodadaNome;
                        this.cdr.markForCheck();

                        this.campeonatoService
                            .campeonatoRodadaAtual(this.campeonatoDetalhes.IdCampeonato)
                            .subscribe(dados => {
                                let atual = dados;
                                let index = this.listaRodadas.findIndex(t => t.Rodada == atual[0].RodadaAtual);

                                this.rodadaSelecionada = this.listaRodadas[index].RodadaNome;
                                this.cdr.markForCheck();

                                this.carregarRodada2(this.campeonatoDetalhes);
                              });
                            });
                          });
      } else {
        this.limparTela();
      }
    } catch (e) {
      this.snack.open("- Erro no carregamento do Campeonato: " + e,
                      "Fechar",
                      {
                          duration: 5000,
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom'
                      });
    }
  }

  carregarRodada2(campeonato: CampeonatoModel) {
    if (campeonato != undefined) {
      this.campeonatoDetalhes = campeonato;
      this.carregarRodada();
    }
  }

  carregarRodada() {
    let index = this.listaRodadas.findIndex(t => t.RodadaNome == this.rodadaSelecionada);
    let index2 = this.listaCampeonatos.findIndex(t => (t.Nome + " - " + t.Ano) == this.campeonatoSelecionado);

    this.totalPontosRodada = 0;
    this.rodadaFinalizada = true;

    this.homeService
        .jogadorApostasRodada(this.jogadorLogado.IdJogador, this.listaCampeonatos[index2].IdCampeonato, this.listaRodadas[index].Rodada)
        .subscribe(dados => {
            let lista = dados;

            lista.forEach(element => {
              if (element.Finalizado)
              {
                element.Pontos = this.pontosJogo(element.GolsApostaTimeCasa, element.GolsApostaTimeVisitante, element.GolsTimeCasa, element.GolsTimeVisitante);
                this.totalPontosRodada += element.Pontos;
              }
              element.Editavel = !element.Finalizado && 
                                 !this.dataVencida(element.Dd_Mm_Yyyy, element. Hh_Mm);
              element.EscudoCasa = "https://bisque-antelope-888426.hostingersite.com/escudos/" +
                                      element.TimeCasa.toLowerCase()
                                                      .replaceAll(" ", "-",)
                                                      .replaceAll(".", "")
                                                      .replaceAll("á", "a")
                                                      .replaceAll("ã", "a")
                                                      .replaceAll("é", "e")
                                                      .replaceAll("ê", "e")
                                                      .replaceAll("í", "i")
                                                      .replaceAll("ó", "o")
                                                      .replaceAll("ú", "u")
                                                      .replaceAll("ç", "c") + ".png";
              element.EscudoVisitante = "https://bisque-antelope-888426.hostingersite.com/escudos/" +
                                          element.TimeVisitante.toLowerCase()
                                                               .replaceAll(" ", "-",)
                                                               .replaceAll(".", "")
                                                               .replaceAll("á", "a")
                                                               .replaceAll("ã", "a")
                                                               .replaceAll("é", "e")
                                                               .replaceAll("ê", "e")
                                                               .replaceAll("í", "i")
                                                               .replaceAll("ó", "o")
                                                               .replaceAll("ú", "u")
                                                               .replaceAll("ç", "c") + ".png";
            });

            this.listaApostas = lista;
            this.gravarDesabilitado = false;
            this.cdr.markForCheck();
        });

      this.homeService
          .rankingRodada(this.empresaSelecionada.IdEmpresa,
                         this.listaCampeonatos[index2].IdCampeonato,
                         this.listaRodadas[index].Rodada)
          .subscribe(dados => {
              let lista = dados;
              this.cdr.markForCheck();

              lista.sort((a, b) => b.Pontos - a.Pontos);

              for (let index3 = 0; index3 < lista.length; index3++) {
                  lista[index3].Posicao = index3 + 1;
              }

              this.listaRankingRodada = lista;
          });
  }

  dataVencida(dd_mm_yyyy: string, hh_mm: string): boolean {
    let vencida = false;
    let hoje = new Date();

    const [dia, mes, ano] = dd_mm_yyyy.split('/').map(Number);
    
    const [diaHoje, mesHoje, anoHoje] = hoje.toLocaleDateString().split('/').map(Number);

    const data = ano * 10000 + mes * 100 + dia;
    const dataHoje = anoHoje * 10000 + mesHoje * 100 + diaHoje;

    if (data < dataHoje) {
      vencida = true;
    }      
    else if (data == dataHoje) {
      const [hh, mm] = hh_mm.split(':').map(Number);

      const horario = hh * 100 + mm;
      const horarioAgora = hoje.getHours() * 100 + hoje.getMinutes();

      vencida = horario <= (horarioAgora - 1);
    }

    return vencida;
  }

  detalhes(ranking: RankingEmpresaModel) {
    //let index = this.listaCampeonatos.findIndex(t => (t.IdCampeonato == this.campeonatoSelecionado.IdCampeonato));
    let index = this.listaCampeonatos.findIndex(t => (t.Nome + " - " + t.Ano) == this.campeonatoSelecionado);    

    this.dialog.open(Detalhes, {
      width: '180px',
      height: '360px',
      disableClose: true,
      data: {
        campeonato: this.listaCampeonatos[index],
        empresa: this.empresaSelecionada,
        ranking: ranking
      }
    });
  }

  detRodada(ranking: RankingEmpresaModel) {
    let index = this.listaCampeonatos.findIndex(t => (t.Nome + " - " + t.Ano) == this.campeonatoSelecionado);
    let index2 = this.listaRodadas.findIndex(t => t.RodadaNome == this.rodadaSelecionada);

    this.dialog.open(DetRodada, {
      width: '747px',
      height: '540px',
      maxWidth: '770px',
      maxHeight: '540px',
      panelClass: 'fullscreen-dialog',
      disableClose: true,
      data: {
        campeonato: this.listaCampeonatos[index],
        empresa: this.empresaSelecionada,
        ranking: ranking,
        rodada: this.listaRodadas[index2].Rodada
      }
    });
  }

  gravarApostas() {
    let golsCasa = 0;
    let golsVisitante = 0;
    let apostas = 0;

    try {
      this.listaApostas.forEach(t => {
        if (!t.Finalizado) {
            golsCasa = ((t.GolsApostaTimeCasa != null) ? t.GolsApostaTimeCasa : 0);
            golsVisitante = ((t.GolsApostaTimeVisitante != null) ? t.GolsApostaTimeVisitante : 0);
            this.homeService
                .apostaGravar(t.IdAposta, t.IdCampeonatoJogo, this.jogadorLogado.IdJogador, golsCasa, golsVisitante)
                .subscribe(dados => {
                    t.IdAposta = dados[0].IdAposta;
                    apostas = apostas + 1;
                    this.cdr.markForCheck();
                    
                    this.snack.open("- Gravada(s) " + apostas + " aposta(s) !",
                                    "Fechar",
                                    {
                                        duration: 3000,
                                        horizontalPosition: 'center',
                                        verticalPosition: 'bottom'
                                    });
            });
        }      
      });
    } catch (e) {
      this.snack.open("- Erro na gravação: " + e,
                      "Fechar",
                      {
                          duration: 3000,
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom'
                      });
    }
  }

  limparTela() {
    this.gravarDesabilitado = true;
    this.listaApostas = [];
    this.listaRanking = [];
    this.listaRankingRodada = [];
    this.listaRodadas = [];
    this.campeonatoDetalhes = undefined as unknown as CampeonatoModel;
    this.rodadaAtual = 0;
    this.rodadaSelecionada = "";
    this.totalPontosRodada = 0;
  
    this.cdr.markForCheck();
  }

  listarRodadas() {
  }

  pontosJogo(golsApostaCasa: number, golsApostaVisitante: number, golsCasa: number, golsVisitante: number): number {
      let pontos = 0;

      if (golsApostaCasa != null) {
        if ((golsApostaCasa == golsCasa) && (golsVisitante == golsApostaVisitante))
            pontos = 10;
        else {
          if (((golsApostaCasa > golsApostaVisitante) && (golsCasa > golsVisitante)) ||
              ((golsApostaCasa == golsApostaVisitante) && (golsCasa == golsVisitante)) ||
              ((golsApostaCasa < golsApostaVisitante) && (golsCasa < golsVisitante)))
              pontos = 5;

          if ((golsApostaCasa == golsCasa) || (golsApostaVisitante == golsVisitante))
              pontos += 2;
        }
      }

      return pontos;
  }

  sair() {
    this.router.navigate(['/Login']);
  }

  trocarSenha() {
     this.dialog.open(TrocarSenha, {
      width: '402px',
      height: '348px',
      disableClose: false,
      data: {
        jogador: this.jogadorLogado
     }
    });   
  }
}