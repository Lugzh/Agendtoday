import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatebaseService } from '../datebase/datebase.service';
@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  ngOnInit(): void {
    
  }
  cadastroForm: FormGroup;

  constructor(
    private nav: NavController,
    private fb: FormBuilder,
    private http: HttpClient,
    private db: DatebaseService  
  ) {
    this.cadastroForm = this.fb.group({
      nomeResponsavel: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]], // CNPJ com 14 dígitos
      email: ['', [Validators.required, Validators.email]],
      cidade: ['', Validators.required],
      enderecoFisico: ['', Validators.required],
      bairro: ['', Validators.required],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]], // CEP formato 00000-000
      numero: ['', Validators.required],
      senha: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$') // Critérios: pelo menos 1 minúscula, 1 maiúscula, 1 número
      ]],
      confirmarSenha: ['', [Validators.required, Validators.minLength(8)]],
    }, { validator: this.matchingPasswords('senha', 'confirmarSenha') });
  }

  matchingPasswords(senhaKey: string, confirmarSenhaKey: string) {
    return (group: FormGroup) => {
      let senhaInput = group.controls[senhaKey];
      let confirmarSenhaInput = group.controls[confirmarSenhaKey];
      if (senhaInput.value !== confirmarSenhaInput.value) {
        return confirmarSenhaInput.setErrors({ notEquivalent: true });
      } else {
        return confirmarSenhaInput.setErrors(null);
      }
    };
  }

  buscarEnderecoPorCep() {
    const cep = this.cadastroForm.get('cep')?.value.replace(/\D/g, '');
    if (cep.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe(
        (data: any) => {
          if (data && !data.erro) {
            this.cadastroForm.patchValue({
              cidade: data.localidade,
              enderecoFisico: data.logradouro,
              bairro: data.bairro,
            });
          } else {
            console.log('CEP não encontrado');
          }
        },
        (error) => {
          console.log('Erro ao buscar CEP', error);
        }
      );
    }
  }

  async onCadastro() {
    if (this.cadastroForm.valid) {
      try {
        const cadastroData = this.cadastroForm.value;
       await this.db.saveCadastroData(cadastroData);
        console.log('Cadastro realizado com sucesso!', cadastroData);
        this.nav.navigateForward("home"); // Navegar para a próxima página
      } catch (error) {
        console.error('Erro ao salvar cadastro:', error);
      }
    } else {
      console.log('Formulário inválido');
    }
  }

  retornarpagina(){
    this.nav.back();
  }
}
