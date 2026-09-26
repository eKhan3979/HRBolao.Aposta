import { ChangeDetectorRef, Component, numberAttribute, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { JogadorModel } from '../../../models/jogadorModel';
import { JogadorService } from '../../../services/jogador-service';

@Component({
  selector: 'app-trocar-senha',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './trocar-senha.html',
  styleUrl: './trocar-senha.css',
})
export class TrocarSenha {
  jogador: JogadorModel = undefined as unknown as JogadorModel;
  novaSenha: string = '';
  confirmeSenha: string = '';

  constructor(private jogadorService: JogadorService,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private snack: MatSnackBar
  ) {
    this.jogador = history.state.jogador;
  }

  gravar() {
    if (this.podeGravar()) {
      this.jogadorService
          .jogadorChange(this.jogador.IdJogador, this.novaSenha)
          .subscribe(dados => {
            this.cdr.markForCheck();

            this.snack.open('- Senha Alterada !', 'Fechar', { duration: 5000 });

            this.dialog.closeAll();
          });
    }
  }

  podeGravar(): boolean {
    let ok: boolean = true;

    if (this.novaSenha.length < 3) {
      ok = false;
      this.snack.open('- A nova senha deve ter no mínimo 3 caracteres.', 'Fechar', { duration: 5000 });
    } else if (this.novaSenha != this.confirmeSenha) {
      ok = false;
      this.snack.open('- Os valores digitados estão diferentes !', 'Fechar', { duration: 5000 });
    }

    return ok;
  }
}