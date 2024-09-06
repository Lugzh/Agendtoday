import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatebaseService } from '../datebase/datebase.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private nav: NavController, private fb: FormBuilder, private db: DatebaseService) {
    this.loginForm = this.fb.group({
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]], // CNPJ com 14 dígitos
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$') // Critérios: pelo menos 1 minúscula, 1 maiúscula, 1 número
      ]]
    });
  }

  loginForm: FormGroup;
  result: any;
  loginError: any;
  async onLogin() {
    if (this.loginForm.valid) {
      const { cnpj, password } = this.loginForm.value;
      try {
        // Reseta a variável de erro antes de tentar o login
        this.loginError = false;

        // Aguarda a verificação de CNPJ e senha
        const isValid = await this.db.verifyCnpjAndPassword(cnpj, password);

        // Verifica se a autenticação foi bem-sucedida
        if (isValid) {
          this.irparadashboard();
        } else {
          this.loginError = true; // Exibe a mensagem de erro
        }
      } catch (error) {
        console.error("Erro durante a verificação do login: ", error);
        this.loginError = true; // Exibe a mensagem de erro se houver um problema na verificação
      }
    } else {
      console.log('Formulário inválido');
    }
  }

  irparacadastro() {
    this.nav.navigateForward("cadastro")
  }
  irparadashboard() {
    this.nav.navigateForward("dashboard")
  }
}

