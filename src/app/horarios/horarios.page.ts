import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatebaseService } from '../datebase/datebase.service';




@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})
export class HorariosPage implements OnInit {
    constructor(
      private alertController: AlertController,
      private db: DatebaseService ,
    ) {
   }
   documents: any[] = [];

 
   data: any[] = [];

    alertButtons = ['Ok'];
    timeButtons: string[] = []; // Armazena os botões adicionados
    isModalOpen = false;
    horarioAtual = '12:00'; // Inicializa a variável, que armazena hora data e ano
    handlerMessage = '';
    roleMessage = '';


    document: any;


    diasDaSemana = [
      { nome: 'Seg', desativado: false },
      { nome: 'Ter', desativado: false },
      { nome: 'Qua', desativado: false },
      { nome: 'Qui', desativado: false },
      { nome: 'Sex', desativado: false },
      { nome: 'Sáb', desativado: false },
      { nome: 'Dom', desativado: false }
    ];
    alternarDia(index: number) {
        this.diasDaSemana[index].desativado = !this.diasDaSemana[index].desativado; // Troca o estado do botão
      }
    
  inclui_vetor(){

  }

  addTimeButton(){
    if (!this.timeButtons.includes(this.horarioAtual) ){
      this.timeButtons.push(this.horarioAtual);}
  }
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  async presentAlert(horario: string) {
    const alert = await this.alertController.create({
      header: 'Deseja excluir esse horário?!',
      message: horario,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Ação quando cancelar
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            let indice = this.timeButtons.indexOf(horario);
            if (indice !== -1) {
              this.timeButtons.splice(indice, 1);  // Remove o item correto
            }
          },
        },
      ],
    });
  
    await alert.present();
  
    const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
  }
  async onHoras() {
      try {
       await this.db.saveHorarios(this.timeButtons,this.diasDaSemana);
        console.log('Cadastro realizado com sucesso!', this.timeButtons);
      } catch (error) {
        console.error('Erro ao salvar cadastro:', error);
      }
  }



  async loadHorarios() {
    try {
      const data = await this.db.getHorarios();
      if (data) {
        if (data.horários && data.dias) {
          this.timeButtons = data.horários;
          this.diasDaSemana = data.dias;
          console.log('Horários e dias carregados com sucesso!', this.timeButtons, this.diasDaSemana);
        } else {
          console.log('Dados de horários ou dias estão incompletos.');
        }
      } else {
        console.log('Nenhum horário encontrado.');
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
    }
  }


  ngOnInit() {
    this.loadHorarios()
}
}
