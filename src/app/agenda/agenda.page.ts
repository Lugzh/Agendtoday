import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { DatebaseService } from '../datebase/datebase.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AgendaPage implements OnInit {
  agendamentoss = [
    {data: "2024-09-07",
    horario: "11:17",
    profissional: "Rosana",
    servico: "Salcihcha",
    telefone: "3597845422222",
    tempoServico: "234",}];  
    diaAtual = ''; // Inicializa a variável, que armazena data
    servico = '';
    diaEscolhido ='';
    agendamentosEscolhidos: {
      data: string;
      horario: string;
      profissional: string;
      servico: string;
      telefone: string;
      tempoServico: string;
    }[] = [];
    isModalOpen = false;
    selectedAgendamento: any; // Armazena o agendamento selecionado
    
    constructor(
    private db: DatebaseService ,)
   {
    this.loadagenda()
    console.log(this.diaAtual)
    }

  ngOnInit() {
    this.diaAtual = this.obterDataAtual();
  }
  obterDataAtual(): string {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0'); // Meses são indexados a partir de 0
    const ano = hoje.getFullYear();

    return `${ano}-${mes}-${dia}`; // Formato YYYY-MM-DD
  }
  filtrardata(){
    this.diaEscolhido = this.diaAtual
    this.agendamentosEscolhidos = [];
    for (let i = 0; i < this.agendamentoss.length; i++) {
      let agendamento = this.agendamentoss[i];
      if (agendamento.data === this.diaEscolhido) {
        this.agendamentosEscolhidos.push(agendamento);
        console.log(this.agendamentosEscolhidos)
      }
    }
  }
  setOpen(isOpen: boolean, agendamento?:any) {
    this.isModalOpen = isOpen;
    if (agendamento) {
      this.selectedAgendamento = agendamento; // Armazena o agendamento selecionado
    }
  }



  async loadagenda() {
    try {
      const data = await this.db.getagendamento();
      if (data) {
        if (data.agendamentos) {
          this.agendamentoss = data.agendamentos;

          console.log('Horários e dias carregados com sucesso!', this.agendamentoss);
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
}
