import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { EmpresaModel } from '../../../models/empresaModel';
import { JogadorGravadoDto } from '../../../models/jogadorGravadoDto';
import { JogadorModel } from '../../../models/jogadorModel';

import { EmpresaService } from '../../../services/empresa-service';
import { JogadorService } from '../../../services/jogador-service';

@Component({
  selector: 'app-cadastro',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro implements OnInit {
  empresaSelecionada: String = "";
  jogadorCadastro: JogadorModel = undefined as unknown as JogadorModel;
  senhaConfirme: String = undefined as unknown as String;
  listaEmpresas: EmpresaModel[] = undefined as unknown as EmpresaModel[];
              
  constructor(private cdr: ChangeDetectorRef,
              private empresaService: EmpresaService,
              private jogadorService: JogadorService,
              private router: Router,
              private dialog: MatDialog,
              @Inject(MatSnackBar) private snackbar: MatSnackBar,
  ) {

  }

  ngOnInit() {
    this.jogadorCadastro = {
      Ativo: true,
      DataCadastro: new Date(),
      email: "",
      IdEmpresa: 0,
      IdJogador: 0,
      NomeApelido: "",
      Senha: ""
    };

    this.empresaService.listaEmpresas()
        .subscribe(dados => {
          this.listaEmpresas = dados as EmpresaModel[];
          this.cdr.markForCheck();

          if (this.listaEmpresas.length == 1) {
            this.empresaSelecionada = this.listaEmpresas[0].NomeEmpresa;            
          }
        });
  }

  gravar() {
    if (this.podeGravar()) {
      let index = this.listaEmpresas.findIndex(t => t.NomeEmpresa == this.empresaSelecionada);

      this.jogadorCadastro.IdEmpresa = this.listaEmpresas[index].IdEmpresa;
      this.jogadorCadastro.NomeApelido = this.jogadorCadastro.NomeApelido.toUpperCase();
      
      this.jogadorService
          .jogadorGravar(this.jogadorCadastro)
          .subscribe(dados => {
            let retorno = dados as JogadorModel[];
            this.cdr.markForCheck();

            if (retorno.length > 0) {
              this.jogadorCadastro.IdJogador = retorno[0].IdJogador,
              
              this.dialog.closeAll();
              this.router.navigate(['/Home'], 
                                    { state: { 
                                        jogador: this.jogadorCadastro
                                      } });
            } else {
              this.snackbar.open("- Ocorreu erro no cadastro !", 'Fechar', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom'
                });
            }

            /*
                                    */
          });
    }
  }

  podeGravar(): boolean {
    let erro: string = "";

    if (this.jogadorCadastro.NomeApelido.length < 3) {
      erro = "- Seu Nome/Apelido deve ter pelo menos 3 caracteres !";
    } else {
      if (this.jogadorCadastro.email.length == 0) {
        erro = "- Preencha o seu e-mail !";
      } else {
        if (this.jogadorCadastro.Senha.length < 3) {
          erro = "- Sua senha deve ter pelo menos 3 caracteres !";
        } else {
          if (this.jogadorCadastro.Senha != this.senhaConfirme) {
            erro = "- As senhas digitadas estão diferentes !";
          }
        }
      }
    }

    if (erro.length > 0) {
      this.snackbar.open(erro, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
    }

    return (erro.length == 0);
  }
}