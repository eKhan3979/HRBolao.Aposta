import { ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Jwt } from 'jsonwebtoken'; 'jsonwebtoken';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { EmpresaModel } from '../../models/empresaModel';
import { JogadorModel } from '../../models/jogadorModel';

import { EmpresaService } from '../../services/empresa-service';
import { JogadorService } from '../../services/jogador-service';

import { Cadastro } from './cadastro/cadastro';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  listaEmpresas: EmpresaModel[] = undefined as unknown as EmpresaModel[];

  empresaSelecionada: EmpresaModel = undefined as unknown as EmpresaModel;

  jogadorLogin: JogadorModel = {
    IdJogador: 0,
    IdEmpresa: 0,
    NomeApelido: "",
    Senha: "",
    Ativo: true,
    DataCadastro: new Date(),
    email: ""
  };

  constructor(private dialog: MatDialog,
              private empresaService: EmpresaService,
              private jogadorService: JogadorService,
              private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              @Inject(MatSnackBar) private snackbar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit() {
    /*
    this.empresaService.listaEmpresas()
      .subscribe(dados => {
        this.listaEmpresas = dados as EmpresaModel[];        
        this.cdr.markForCheck(); 

        this.jogadorLogin.email = "";
        this.jogadorLogin.NomeApelido = "";
        this.jogadorLogin.Senha = "";

        if (this.listaEmpresas.length == 1)
        {
          this.jogadorLogin.IdEmpresa = this.listaEmpresas[0].IdEmpresa;
          this.empresaSelecionada = this.listaEmpresas[0];
        }
    });
    */
  }

  async loginJogador() {
    this.jogadorService.loginToken(this.jogadorLogin.email, this.jogadorLogin.Senha)
        .subscribe(dados => {
          let retorno = dados as JogadorModel[];
          let ok = false;

          this.cdr.markForCheck();

          if ((retorno != undefined) && (retorno.length > 0)) {
            this.jogadorLogin = (dados as JogadorModel[])[0];

            if (this.jogadorLogin.IdJogador > 0) {
              ok = true;
              this.router.navigate(['/Home'], 
                                   { state: { 
                                                jogador: this.jogadorLogin
                                            } });
            }
          }
          if (!ok) {
            this.snackbar.open('- Usuário/senha não encontrado !', 'Fechar', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              });
          }
        });
  }

  cadastro() {
    this.dialog.open(Cadastro, {
      width: "520px",
      height: "540px;",
      data: {
        
      }
    });
  }
}